const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Supported languages and their path prefixes
const langs = [
  { code: 'id', name: 'Bahasa Indonesia', path: '/' },
  { code: 'en', name: 'English', path: '/en/' },
  { code: 'es', name: 'Español', path: '/es/' },
  { code: 'fr', name: 'Français', path: '/fr/' },
  { code: 'ms', name: 'Bahasa Melayu', path: '/ms/' },
  { code: 'pt', name: 'Português', path: '/pt/' },
  { code: 'tr', name: 'Türkçe', path: '/tr/' },
  { code: 'vi', name: 'Tiếng Việt', path: '/vi/' },
  { code: 'th', name: 'ไทย', path: '/th/' },
  { code: 'hi', name: 'हिन्दी', path: '/hi/' },
  { code: 'ar', name: 'العربية', path: '/ar/' }
];

function processHtmlFile(filePath, currentLangCode) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Build proper <select id="langSwitcher">
  let optionsHtml = langs.map(l => {
    const selected = l.code === currentLangCode ? ' selected' : '';
    return `<option value="${l.path}"${selected}>${l.name}</option>`;
  }).join('\n');

  const newSelect = `<select id="langSwitcher" aria-label="Pilih Bahasa" onchange="window.location.href=this.value;">\n${optionsHtml}\n</select>`;

  // Replace existing langSwitcher select element
  html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, newSelect);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated language switcher in: ${filePath}`);
}

function scanAndFix(dir, currentLangCode) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Check if directory matches a language code
      const matchedLang = langs.find(l => l.code === item);
      scanAndFix(fullPath, matchedLang ? matchedLang.code : currentLangCode);
    } else if (item === 'index.html') {
      processHtmlFile(fullPath, currentLangCode);
    }
  }
}

scanAndFix(publicDir, 'id');
