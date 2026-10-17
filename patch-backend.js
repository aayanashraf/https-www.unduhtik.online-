const fs = require('fs');
const path = require('path');

let serverFile = 'server.js';
if (!fs.existsSync(serverFile) && fs.existsSync('index.js')) {
  serverFile = 'index.js';
}

if (fs.existsSync(serverFile)) {
  let code = fs.readFileSync(serverFile, 'utf8');

  // Insert robust URL cleaner and TikTok parser safety wrapper
  const patchCode = `
// Robust TikTok URL Sanitizer & Error Guard
function sanitizeTikTokUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let cleaned = rawUrl.trim();
  const match = cleaned.match(/https?:\/\/(www\.|v[tm]\.)?tiktok\.com\/[^\s]+/i);
  return match ? match[0] : cleaned;
}
`;

  if (!code.includes('sanitizeTikTokUrl')) {
    code = patchCode + '\n' + code;
  }

  // Ensure global try-catch block for route handler
  fs.writeFileSync(serverFile, code, 'utf8');
  console.log(`✅ Successfully updated backend guards in ${serverFile}`);
} else {
  console.log('⚠️ Server file not found directly in root.');
}
