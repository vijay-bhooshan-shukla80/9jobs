import { inflateRawSync } from 'node:zlib';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';
import { MAX_RESUME_BYTES } from './validation';

export class ResumeError extends Error {}
const fail = () => { throw new ResumeError('Upload a valid, unencrypted PDF or DOCX without scripts, macros, embedded files or external document links.'); };

function validateDocx(buffer) {
  // Parse the ZIP central directory; never extract user-controlled paths to disk.
  let end = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i--) if (buffer.readUInt32LE(i) === 0x06054b50) { end = i; break; }
  if (end < 0 || buffer.readUInt16LE(end + 4) || buffer.readUInt16LE(end + 6)) fail();
  const count = buffer.readUInt16LE(end + 10);
  let offset = buffer.readUInt32LE(end + 16), total = 0;
  const names = new Set();
  if (!count || count > 200 || offset + buffer.readUInt32LE(end + 12) !== end) fail();
  for (let i = 0; i < count; i++) {
    if (offset + 46 > end || buffer.readUInt32LE(offset) !== 0x02014b50) fail();
    const flags = buffer.readUInt16LE(offset + 8), method = buffer.readUInt16LE(offset + 10);
    const compressed = buffer.readUInt32LE(offset + 20), size = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28), extra = buffer.readUInt16LE(offset + 30), comment = buffer.readUInt16LE(offset + 32);
    const local = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    if (flags & 1 || ![0, 8].includes(method) || size > 10 * 1024 * 1024 || (total += size) > 20 * 1024 * 1024 || names.has(name) || /(^\/|\\|\.\.|\x00|vbaProject|embeddings\/|activeX\/|\.(exe|js|bat|cmd|vbs|dll)$)/i.test(name)) fail();
    names.add(name);
    if (local + 30 > offset || buffer.readUInt32LE(local) !== 0x04034b50) fail();
    const localNameLength = buffer.readUInt16LE(local + 26);
    if (buffer.subarray(local + 30, local + 30 + localNameLength).toString('utf8') !== name) fail();
    const start = local + 30 + localNameLength + buffer.readUInt16LE(local + 28);
    if (start + compressed > offset) fail();
    const raw = buffer.subarray(start, start + compressed);
    const content = method === 8 ? inflateRawSync(raw, {maxOutputLength: 10 * 1024 * 1024}) : raw;
    if (content.length !== size) fail();
    if (/\.(xml|rels)$/i.test(name)) {
      const xml = content.toString('utf8');
      if (/<!DOCTYPE|<!ENTITY|macroEnabled|vbaProject|TargetMode\s*=\s*["']External/i.test(xml)) fail();
      if (name === 'word/document.xml' && !/<w:document[\s>]/.test(xml)) fail();
      if (name === '[Content_Types].xml' && !xml.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml')) fail();
    }
    offset += 46 + nameLength + extra + comment;
  }
  if (offset !== end || !names.has('[Content_Types].xml') || !names.has('word/document.xml') || !names.has('_rels/.rels')) fail();
}

export async function validateResume(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || !file.size || file.size > MAX_RESUME_BYTES) throw new ResumeError('Choose a PDF or DOCX resume up to 5 MB.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mime = extension === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (!['pdf', 'docx'].includes(extension) || file.type !== mime) fail();
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    if (extension === 'pdf') {
      if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-')) || !buffer.subarray(-1024).includes(Buffer.from('%%EOF'))) fail();
      const pdf = await PDFDocument.load(buffer, {ignoreEncryption: false, updateMetadata: false});
      if (pdf.getPageCount() < 1 || pdf.getPageCount() > 100) fail();
      for (const [, object] of pdf.context.enumerateIndirectObjects()) {
        if (object instanceof PDFDict) {
          const serialized = object.toString();
          if (/\/(JavaScript|JS|Launch|EmbeddedFiles|EmbeddedFile|RichMedia|OpenAction|AA|XFA)\b/.test(serialized)) fail();
          const action = object.get(PDFName.of('S'))?.toString();
          if (action && ['/SubmitForm', '/ImportData', '/GoToR'].includes(action)) fail();
        }
      }
    } else validateDocx(buffer);
  } catch (error) { if (error instanceof ResumeError) throw error; fail(); }
  return {buffer, extension, contentType: mime, size: buffer.length};
}
