const app = require('../server/src/index.js');

/**
 * Vercel Serverless Function catch-all for /api/* routes.
 *
 * When Vercel uses filesystem routing (no explicit /api rewrite in vercel.json),
 * req.url is set to the full path relative to the api/ directory, e.g.:
 *   Request: POST /api/auth/register
 *   req.url inside function: /auth/register  (Vercel strips the /api prefix)
 *
 * Express is mounted at /api/auth, /api/trips, etc.
 * So we must re-prepend /api before passing to Express.
 */
module.exports = (req, res) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
