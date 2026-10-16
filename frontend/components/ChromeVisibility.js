'use client';

import { usePathname } from 'next/navigation';

function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export default function ChromeVisibility() {
  const pathname = usePathname();
  const hideChrome = isAdminPath(pathname || '') || /^\/(?:agreements|fortnight-agreements)\/[^/]+\/sign\/?$/.test(pathname || '');

  if (!hideChrome) {
    return null;
  }

  return (
    <style>{`
      .site-nav,
      .site-footer,
      .admin-whatsapp-button {
        display: none !important;
      }
    `}</style>
  );
}
