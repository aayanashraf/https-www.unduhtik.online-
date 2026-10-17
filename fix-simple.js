const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

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

const simpleCss = `
<style id="custom-lang-style">
  #langSwitcher {
    background: #1e1e2f;
    color: #ffffff;
    font-size: 0.9rem;
    padding: 6px 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    cursor: pointer;
  }
  #langSwitcher option {
    background: #1e1e2f;
    color: #ffffff;
  }
</style>
`;

function fixDir(dir, currentLang) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      const match = languages.find(l => l.code === item);
      fixDir(fullPath, match ? match.code : currentLang);
    } else if (item.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');

      // Clean old styles
      html = html.replace(/<style id="custom-lang-style">[\s\S]*?<\/style>/i, '');
      html = html.replace('</head>', `${simpleCss}\n</head>`);

      // Generate options
      const options = languages.map(l => {
        const sel = l.code === currentLang ? ' selected' : '';
        return `<option value="${l.url}"${sel}>${l.name}</option>`;
      }).join('\n        ');

      const selectTag = `<select id="langSwitcher" aria-label="Language" onchange="if(this.value){window.location.href=this.value;}">\n        ${options}\n      </select>`;

      html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, selectTag);

      fs.writeFileSync(fullPath, html, 'utf8');
    }
  }
}

fixDir(publicDir, 'id');
