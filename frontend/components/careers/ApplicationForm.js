'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { applicationSchema, fieldErrors, MAX_RESUME_BYTES } from '@/lib/careers/validation';
import { departments } from '@/data/careers';
import { Asset, IconBox } from './Primitives';
import { UserRound, Mail, Phone, MapPin, BriefcaseBusiness, ChartNoAxesColumnIncreasing, Link as LinkIcon, FileText, CloudUpload, Info, Send, Layers, UsersRound, Check } from 'lucide-react';
import styles from '@/app/careers/careers.module.css';

export default function ApplicationForm({role}) {
  const formRef = useRef(null), pending = useRef(false), key = useRef(null), successRef = useRef(null);
  const [errors, setErrors] = useState({}), [error, setError] = useState('');
  const [busy, setBusy] = useState(false), [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null), [reference, setReference] = useState('');
  const [position, setPosition] = useState(role?.title || 'Future Opportunities');
  const [dragging, setDragging] = useState(false);
  const eoi = !role;
  const selectedRole = role;
  const title = position.trim() || selectedRole?.title || 'Future Opportunities';

  function focusError(fields) {
    requestAnimationFrame(() => formRef.current?.elements.namedItem(Object.keys(fields)[0])?.focus());
  }
  function selectFile(selected) {
    setFile(selected || null); setProgress(0);
    let message = '';
    if (selected && (!/\.(pdf|docx)$/i.test(selected.name) || !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selected.type))) message = 'Choose a PDF or DOCX file.';
    if (selected && (!selected.size || selected.size > MAX_RESUME_BYTES)) message = 'Choose a non-empty resume up to 5 MB.';
    setErrors(previous => ({...previous, resume: message}));
  }
  function chooseFile(event) { selectFile(event.target.files?.[0]); }
  async function submit(event) {
    event.preventDefault(); if (pending.current) return;
    setError('');
    const form = new FormData(formRef.current);
    if (file) form.set('resume', file);
    form.set('submissionType', eoi ? 'expression-of-interest' : 'role-interest');
    if (role) form.set('jobId', role.id);
    form.set('consent', form.get('consent') === 'on' ? 'true' : 'false');
    const result = applicationSchema.safeParse(Object.fromEntries(form));
    const fields = result.success ? {} : fieldErrors(result.error);
    if (!file || !file.size || file.size > MAX_RESUME_BYTES || !/\.(pdf|docx)$/i.test(file.name) || !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) fields.resume = 'Choose a PDF or DOCX resume up to 5 MB.';
    setErrors(fields);
    if (Object.keys(fields).length) {focusError(fields); return;}
    pending.current = true; setBusy(true); setProgress(0);
    if (!key.current) key.current = crypto.randomUUID();
    // XHR exposes real upload progress; success depends solely on the persisted API response.
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/careers/applications');
    xhr.setRequestHeader('Idempotency-Key', key.current);
    xhr.timeout = 120000;
    xhr.upload.onprogress = event => {if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100));};
    const finish = () => {pending.current = false; setBusy(false);};
    xhr.onload = () => {
      let response; try { response = JSON.parse(xhr.responseText); } catch { response = {}; }
      if (xhr.status >= 200 && xhr.status < 300 && response.success && response.reference) {
        setReference(response.reference); setFile(null); formRef.current?.reset();
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        setError(response.error || 'We could not submit your application. Your details are still in the form. Please try again.');
        if (response.fields) {setErrors(response.fields); focusError(response.fields);}
      }
      finish();
    };
    xhr.onerror = xhr.ontimeout = () => {setError('The connection was interrupted. Your details are still here. Please retry; duplicate submissions are protected.'); finish();};
    xhr.send(form);
  }
  const labelText = label => label.endsWith(' *') ? <span>{label.slice(0, -2)} <span className={styles.required}>*</span></span> : label;
  const input = (name, label, Icon, props = {}) => <label className={styles.field}>{labelText(label)}<span className={styles.inputShell}><Icon size={19} aria-hidden="true" /><input name={name} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined} {...props} /></span>{errors[name] && <span className={styles.error} id={name + '-error'}>{errors[name]}</span>}</label>;
  return <section className={[styles.formPage, styles.applicationPage].join(' ')}><div className={styles.applicationContainer}>
    <Link className={styles.back} href="/careers#opportunities"><Asset name="d2483.svg" />Back to Career Opportunities</Link>
    {!reference && <header className={styles.applicationBanner}><h1>{eoi ? <>Share <span>Your Profile</span></> : <>Apply for <span>{title}</span></>}</h1><p>Join 9Jobs and contribute to career services and technology that support Australian job seekers.</p>{eoi && <p className={styles.applicationPreview}>Share your profile as an expression of interest for future opportunities.</p>}</header>}
    <div className={reference ? styles.applicationSuccessLayout : styles.applicationLayout}>
      <div className={styles.formCard}>{reference ? <div className={styles.success} ref={successRef} tabIndex={-1} role="status"><IconBox>check_circle</IconBox><span className={styles.eyebrow}>Application received</span><h1>Thank you for your application!</h1><p>We’ve received your details. Our recruitment team will review your profile and contact you if a suitable opportunity is available.</p><Link href="/careers" className={styles.primary}>Back to Careers</Link></div> : <>
        {error && <div role="alert" className={styles.errorBanner}>{error}</div>}
        <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy}>
          <fieldset disabled={busy} className={styles.applicationFieldset}>
            <FormGroup title="Personal Details">
              {input('fullName', 'Full Name *', UserRound, {autoComplete:'name', placeholder:'Enter your full name', required:true, maxLength:120})}
              {input('email', 'Email Address *', Mail, {type:'email', autoComplete:'email', placeholder:'Enter your email address', required:true, maxLength:254})}
              {input('phone', 'Phone Number *', Phone, {type:'tel', autoComplete:'tel', placeholder:'+61 400 000 000', required:true, maxLength:32})}
              {input('location', 'Current Location *', MapPin, {autoComplete:'address-level2', placeholder:'Enter your current location', required:true, maxLength:160})}
            </FormGroup>
            <FormGroup title="Application Details">
              <label className={styles.field}>{labelText('Position Applying For *')}<span className={styles.inputShell}><BriefcaseBusiness size={19} aria-hidden="true" /><input name="position" value={position} onChange={event => setPosition(event.target.value)} maxLength={160} required aria-invalid={Boolean(errors.position)} aria-describedby={errors.position ? 'position-error' : undefined} /></span>{errors.position && <span id="position-error" className={styles.error}>{errors.position}</span>}</label>
              <label className={styles.field}>{labelText('Years of Experience *')}<span className={styles.inputShell}><ChartNoAxesColumnIncreasing size={19} aria-hidden="true" /><select name="experience" required defaultValue="" aria-invalid={Boolean(errors.experience)} aria-describedby={errors.experience ? 'experience-error' : undefined}><option value="" disabled>Select years</option>{['0–1','1–3','3–5','5–10','10+'].map(value => <option key={value} value={value}>{value} years</option>)}</select></span>{errors.experience && <span id="experience-error" className={styles.error}>{errors.experience}</span>}</label>
              {eoi && <label className={[styles.field, styles.fullWidth].join(' ')}>{labelText('Preferred Department *')}<span className={styles.inputShell}><BriefcaseBusiness size={19} aria-hidden="true" /><select name="preferredDepartment" defaultValue="" required aria-invalid={Boolean(errors.preferredDepartment)} aria-describedby={errors.preferredDepartment ? 'department-error' : undefined}><option value="" disabled>Select a department</option>{departments.map(department => <option key={department}>{department}</option>)}</select></span>{errors.preferredDepartment && <span id="department-error" className={styles.error}>{errors.preferredDepartment}</span>}</label>}
            </FormGroup>
            <FormGroup title="Online Profiles">
              {input('linkedin', 'LinkedIn Profile URL *', LinkedInMark, {type:'url', placeholder:'https://linkedin.com/in/username', required:true, maxLength:500})}
              {input('portfolio', 'Portfolio URL (Optional)', LinkIcon, {type:'url', placeholder:'https://github.com/username', maxLength:500})}
            </FormGroup>
            <FormGroup title="Documents">
              <div className={[styles.field, styles.fullWidth].join(' ')}><label htmlFor="resume">{labelText('Upload Resume *')} <span className={styles.uploadHint}>(PDF or DOCX, up to 5 MB)</span></label>
                <div className={[styles.resumeDropzone, dragging ? styles.dropzoneActive : ''].join(' ')} onDragOver={event => {event.preventDefault(); if (!busy) setDragging(true);}} onDragLeave={event => {if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);}} onDrop={event => {event.preventDefault(); setDragging(false); if (!busy) selectFile(event.dataTransfer.files?.[0]);}}>
                  <CloudUpload size={36} aria-hidden="true" />
                  <div className={styles.dropzonePrompt}><strong>{file ? file.name : 'Drag & drop your resume here, or'}</strong><label className={styles.secondary}>Choose File<input id="resume" name="resume" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={chooseFile} required aria-invalid={Boolean(errors.resume)} aria-describedby="resume-help" /></label></div>
                  <p>Supported formats: PDF, DOCX&nbsp; | &nbsp;Max size: 5 MB</p>
                  {busy && <progress className={styles.progress} value={progress} max="100" aria-label="Resume upload progress" />}
                </div>
                <span id="resume-help" className={errors.resume ? styles.error : busy ? styles.caption : styles.srOnly}>{errors.resume || (busy ? progress === 100 ? 'Upload complete. Securely processing your application…' : 'Uploading… ' + progress + '%' : 'Encrypted or active-content documents are not accepted.')}</span>
              </div>
            </FormGroup>
            <label className={[styles.field, styles.applicationLongField].join(' ')}><span className={styles.applicationLabel}><FileText size={20} aria-hidden="true" />Cover Letter (Optional)</span><textarea name="coverLetter" maxLength={5000} placeholder="Tell us why you would like to join 9Jobs and how your experience fits the role..." aria-invalid={Boolean(errors.coverLetter)} aria-describedby={errors.coverLetter ? 'coverLetter-error' : undefined} />{errors.coverLetter && <span id="coverLetter-error" className={styles.error}>{errors.coverLetter}</span>}</label>
            <label className={[styles.field, styles.applicationLongField].join(' ')}><span className={styles.applicationLabel}><Info size={20} aria-hidden="true" />Additional Information (Optional)</span><textarea name="additionalInformation" maxLength={2000} placeholder="Notice period, availability, or any other relevant information..." aria-invalid={Boolean(errors.additionalInformation)} aria-describedby={errors.additionalInformation ? 'additionalInformation-error' : undefined} />{errors.additionalInformation && <span id="additionalInformation-error" className={styles.error}>{errors.additionalInformation}</span>}</label>
            <div className={styles.submitRow}><div className={styles.applicationConsentBlock}><label className={styles.consent}><input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-error' : undefined} /><span>I agree to the processing of my personal information for recruitment purposes in accordance with the <Link href="/privacy-policy" target="_blank">9Jobs Privacy Policy</Link>.</span></label>{errors.consent && <p id="consent-error" className={styles.error}>{errors.consent}</p>}</div><button type="submit" className={styles.primary} disabled={busy}><Send size={18} aria-hidden="true" />{busy ? 'Submitting…' : 'Submit Application'}<Asset name="d9608.svg" /></button><p>No payment is ever requested from applicants.</p></div>
          </fieldset>
        </form>
      </>}</div>
      {!reference && <aside className={styles.applicationAside}>
        <section className={styles.applicationRoleCard}><header><IconBox>{selectedRole?.icon || 'person_search'}</IconBox><div><h2>{title}</h2><p>{selectedRole?.department || 'Expression of Interest'}</p></div></header>{selectedRole && <ul className={styles.applicationRoleMeta}><li><MapPin size={20} aria-hidden="true" />{selectedRole.location}</li><li><BriefcaseBusiness size={20} aria-hidden="true" />{selectedRole.type}</li><li><Layers size={20} aria-hidden="true" />{selectedRole.arrangement}</li></ul>}<div className={styles.applicationAbout}><h3>About the Role</h3><p>{selectedRole?.description || 'Share your experience, interests and preferred department to connect with 9Jobs for future opportunities.'}</p></div></section>
        <section className={styles.applicationCultureCard}><h2><span><UsersRound size={24} aria-hidden="true" /></span>Why Join 9Jobs?</h2><ul>{['Support Australian job seekers','Contribute to 9Jobs career services','Improve profiles and application workflows','Bring your skills to candidate-focused work'].map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul><p className={styles.applicationPreview}>Role responsibilities and work arrangements are listed in each 9Jobs vacancy.</p></section>
      </aside>}
    </div>
  </div></section>;
}

function FormGroup({title, children}) {
  return <section className={styles.applicationGroup} aria-label={title}><div className={styles.formGrid}>{children}</div></section>;
}

function LinkedInMark() { return <span className={styles.linkedinMark} aria-hidden="true">in</span>; }
