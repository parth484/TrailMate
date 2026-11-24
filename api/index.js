const app = require('../server/src/index.js');

/**
 * Vercel Serverless Function for the bare /api endpoint.
 * Vercel filesystem routing: requests to /api go here.
 * req.url will be "/" so we re-add /api prefix for Express.
 */
module.exports = (req, res) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};
