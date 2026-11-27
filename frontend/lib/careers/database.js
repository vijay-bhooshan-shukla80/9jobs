import mongoose from 'mongoose';

export function assertCareersDatabase({requireEnabled = true} = {}) {
  if (requireEnabled && process.env.CAREERS_APPLICATIONS_ENABLED !== 'true') throw Object.assign(new Error('Careers submissions are not configured.'), {status: 503});
  if (process.env.NODE_ENV !== 'production') {
    const uri = process.env.MONGODB_URI || '';
    if (!/^mongodb:\/\/(127\.0\.0\.1|localhost|\[::1\]):\d+\/9jobs_careers_test(?:\?|$)/.test(uri) || (mongoose.connection.readyState === 1 && mongoose.connection.name !== '9jobs_careers_test')) {
      throw Object.assign(new Error('A local Careers test database is required.'), {status: 503});
    }
  }
}
