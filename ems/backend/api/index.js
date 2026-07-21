// Vercel auto-detects any file under /api as a serverless function.
// This simply re-exports our existing Express app so all routes work as-is.
module.exports = require("../server");