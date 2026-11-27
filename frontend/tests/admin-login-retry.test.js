import {jest} from '@jest/globals';
import {loginRetryDeadline, loginRetrySeconds, formatLoginRetry, readLoginRetry, storeLoginRetry, subscribeLoginRetry} from '@/lib/admin/auth/login-retry';

test('respects server Retry-After seconds without extending the lock on each tick', () => {
  const now = 1800000000000, deadline = loginRetryDeadline('321', now);
  expect(deadline).toBe(now + 321000);
  expect(loginRetrySeconds(deadline, now)).toBe(321);
  expect(loginRetrySeconds(deadline, now + 60000)).toBe(261);
  expect(loginRetrySeconds(deadline, deadline)).toBe(0);
  expect(loginRetrySeconds(deadline, deadline + 1000)).toBe(0);
  expect(formatLoginRetry(321)).toBe('5:21');
});
test('handles HTTP-date Retry-After values and malformed/missing headers', () => {
  const now = 1800000000000;
  expect(loginRetryDeadline(new Date(now + 90000).toUTCString(), now)).toBe(now + 90000);
  expect(loginRetryDeadline(null, now)).toBe(now + 60000);
  expect(loginRetryDeadline('not-valid', now)).toBe(now + 60000);
  expect(loginRetryDeadline('0', now)).toBe(now + 1000);
});

test('restores only the relevant account cooldown after refresh and notifies the same tab', () => {
  const original = global.window, values = new Map(), listeners = new Map();
  global.window = {sessionStorage:{getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name),dispatchEvent:event=>listeners.get(event.type)?.()};
  try {
    const notify=jest.fn(), unsubscribe=subscribeLoginRetry(notify);
    storeLoginRetry('account-one',1800000100000);
    expect(readLoginRetry('account-one')).toBe(1800000100000);
    expect(notify).toHaveBeenCalledTimes(1);
    values.set('restored-account','1800000200000');
    expect(readLoginRetry('restored-account')).toBe(1800000200000);
    expect(readLoginRetry('different-account')).toBe(0);
    unsubscribe();expect(listeners.size).toBe(0);
  } finally { if(original===undefined)delete global.window;else global.window=original; }
});

test('storage restrictions still retain the countdown in memory', () => {
  const original=global.window;
  global.window={sessionStorage:{getItem:()=>{throw new Error('blocked');},setItem:()=>{throw new Error('blocked');}},dispatchEvent:()=>{}};
  try {storeLoginRetry('storage-blocked-account',1800000300000);expect(readLoginRetry('storage-blocked-account')).toBe(1800000300000);} finally {if(original===undefined)delete global.window;else global.window=original;}
});
