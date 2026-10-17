const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const languages = [
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

function resetSwitcherInFile(filePath, activeLangCode) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Generate clean select dropdown
  const options = languages.map(l => {
    const isSelected = l.code === activeLangCode ? ' selected' : '';
    return `<option value="${l.path}"${isSelected}>${l.name}</option>`;
  }).join('\n        ');

  const cleanSelect = `<select id="langSwitcher" aria-label="Select Language" onchange="if(this.value) window.location.href=this.value;">\n        ${options}\n      </select>`;

  // Replace old switcher element cleanly
  html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, cleanSelect);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Reset completed for: ${filePath}`);
}

function walkDir(dir, currentLang) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const match = languages.find(l => l.code === item);
      walkDir(fullPath, match ? match.code : currentLang);
    } else if (item.endsWith('.html')) {
      resetSwitcherInFile(fullPath, currentLang);
    }
  }
}

walkDir(publicDir, 'id');
