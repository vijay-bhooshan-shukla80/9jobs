export function loginRetryDeadline(header, now = Date.now()) {
  const value = String(header || '').trim();
  const seconds = /^\d+$/.test(value) ? Number(value) : null;
  const date = seconds === null ? Date.parse(value) : NaN;
  const delay = seconds !== null ? seconds * 1000 : Number.isFinite(date) ? date - now : 60000;
  return now + Math.min(86400000, Math.max(1000, delay));
}

export function loginRetrySeconds(deadline, now = Date.now()) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function formatLoginRetry(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const deadlines = new Map();
const retryEvent = '9jobs-admin-login-retry-change';
export const loginRetryServerSnapshot = () => 0;

export function readLoginRetry(key) {
  if (typeof window === 'undefined') return 0;
  let stored = 0;
  try { stored = Number(window.sessionStorage.getItem(key)) || 0; } catch { /* Memory fallback below. */ }
  return Math.max(deadlines.get(key) || 0, Number.isFinite(stored) ? stored : 0);
}
export function storeLoginRetry(key, deadline) {
  deadlines.set(key, deadline);
  try { window.sessionStorage.setItem(key, String(deadline)); } catch { /* Retain in memory when storage is unavailable. */ }
  window.dispatchEvent(new Event(retryEvent));
}
export function subscribeLoginRetry(notify) {
  window.addEventListener(retryEvent, notify);window.addEventListener('storage', notify);
  return () => {window.removeEventListener(retryEvent, notify);window.removeEventListener('storage', notify);};
}
export const readLoginClock = () => Math.floor(Date.now() / 1000) * 1000;
export function subscribeLoginClock(notify) {
  const timer = setInterval(notify, 1000);
  return () => clearInterval(timer);
}
