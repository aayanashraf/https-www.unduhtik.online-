const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Language list with exact paths
const languages = [
  { code: 'id', name: 'Bahasa Indonesia', url: '/' },
  { code: 'en', name: 'English', url: '/en/' },
  { code: 'es', name: 'Español', url: '/es/' },
  { code: 'fr', name: 'Français', url: '/fr/' },
  { code: 'ms', name: 'Bahasa Melayu', url: '/ms/' },
  { code: 'pt', name: 'Português', url: '/pt/' },
  { code: 'tr', name: 'Türkçe', url: '/tr/' },
  { code: 'vi', name: 'Tiếng Việt', url: '/vi/' },
  { code: 'th', name: 'ไทย', url: '/th/' },
  { code: 'hi', name: 'हिन्दी', url: '/hi/' },
  { code: 'ar', name: 'العربية', url: '/ar/' }
];

function fixAllPages(dir, langCode) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const matched = languages.find(l => l.code === file);
      fixAllPages(filePath, matched ? matched.code : langCode);
    } else if (file === 'index.html') {
      let html = fs.readFileSync(filePath, 'utf8');

      // Rebuild clean dropdown options
      const options = languages.map(l => {
        const sel = l.code === langCode ? ' selected' : '';
        return `<option value="${l.url}"${sel}>${l.name}</option>`;
      }).join('\n');

      const selectHtml = `<select id="langSwitcher" aria-label="Language" onchange="if(this.value){window.location.href=this.value;}">\n${options}\n</select>`;

      // Replace langSwitcher cleanly without touching buttons or form elements
      html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, selectHtml);

      // Clean up any stray script tags appended previously
      html = html.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/gi, '');

      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  }
}

fixAllPages(publicDir, 'id');
