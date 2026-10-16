// PDF review responses stay private and open inline when the browser supports it.
export const PDF_PREVIEW_HEADERS = {
  'content-type': 'application/pdf',
  'content-disposition': 'inline; filename="agreement-preview.pdf"',
  'cache-control': 'private, no-store, no-cache, must-revalidate',
  'x-robots-tag': 'noindex, nofollow, nosnippet',
};
