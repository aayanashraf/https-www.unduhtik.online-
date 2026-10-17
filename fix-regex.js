const fs = require('fs');
const path = require('path');

let serverFile = 'server.js';
if (!fs.existsSync(serverFile) && fs.existsSync('index.js')) {
  serverFile = 'index.js';
}

if (fs.existsSync(serverFile)) {
  let code = fs.readFileSync(serverFile, 'utf8');

  // Replace with safe RegEx syntax
  const safeRegexCode = `
function sanitizeTikTokUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let cleaned = rawUrl.trim();
  const match = cleaned.match(/https?:\\/\\/(www\\.|v[tm]\\.)?tiktok\\.com\\/[^\\s]+/i);
  return match ? match[0] : cleaned;
}
`;

  // If broken regex exists, replace it, otherwise prepend
  if (code.includes('cleaned.match')) {
    code = code.replace(/const match = cleaned\.match\(.*?\);/s, 'const match = cleaned.match(/https?:\\/\\/(www\\.|v[tm]\\.)?tiktok\\.com\\/[^\\s]+/i);');
  } else {
    code = safeRegexCode + '\n' + code;
  }

  fs.writeFileSync(serverFile, code, 'utf8');
  console.log('✅ Fixed server.js RegEx syntax error successfully!');
}
