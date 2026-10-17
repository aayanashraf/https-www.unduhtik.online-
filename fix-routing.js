const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const languages = [
  { code: 'id', name: '🌐 ID - Bahasa Indonesia', url: '/' },
  { code: 'en', name: '🌐 EN - English', url: '/en/' },
  { code: 'es', name: '🌐 ES - Español', url: '/es/' },
  { code: 'fr', name: '🌐 FR - Français', url: '/fr/' },
  { code: 'ms', name: '🌐 MS - Bahasa Melayu', url: '/ms/' },
  { code: 'pt', name: '🌐 PT - Português', url: '/pt/' },
  { code: 'tr', name: '🌐 TR - Türkçe', url: '/tr/' },
  { code: 'vi', name: '🌐 VI - Tiếng Việt', url: '/vi/' },
  { code: 'th', name: '🌐 TH - ไทย', url: '/th/' },
  { code: 'hi', name: '🌐 HI - हिन्दी', url: '/hi/' },
  { code: 'ar', name: '🌐 AR - العربية', url: '/ar/' }
];

// 1. Ensure all language directories and index.html exist
const mainIndexPath = path.join(publicDir, 'index.html');
if (fs.existsSync(mainIndexPath)) {
  const rootIndexContent = fs.readFileSync(mainIndexPath, 'utf8');

  languages.forEach(lang => {
    const langDir = path.join(publicDir, lang.code);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    const langIndexPath = path.join(langDir, 'index.html');
    if (!fs.existsSync(langIndexPath)) {
      fs.writeFileSync(langIndexPath, rootIndexContent, 'utf8');
      console.log(`Created directory and index.html for: ${lang.code}`);
    }
  });
}

// 2. Update all HTML files with absolute navigation and correct styling
const proThemeCss = `
<style id="custom-lang-style">
  #langSwitcher {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: rgba(255, 255, 255, 0.6);
    color: #1e293b;
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 8px 36px 8px 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 14px;
    margin-right: 10px;
  }
  #langSwitcher:hover {
    background-color: #ffffff;
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  #langSwitcher:focus {
    border-color: #00f2fe;
    box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.2);
  }
  #langSwitcher option {
    background-color: #ffffff;
    color: #0f172a;
    padding: 10px;
    font-weight: 500;
  }
  body.dark #langSwitcher {
    background-color: rgba(30, 41, 59, 0.7);
    color: #f8fafc;
    border-color: rgba(255, 255, 255, 0.1);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f8fafc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
  }
  body.dark #langSwitcher:hover {
    background-color: rgba(30, 41, 59, 0.95);
    border-color: rgba(255, 255, 255, 0.25);
  }
  body.dark #langSwitcher option {
    background-color: #0f172a;
    color: #f8fafc;
  }
</style>
`;

function processHtmlFiles(dir, currentLangCode) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      const matched = languages.find(l => l.code === item);
      processHtmlFiles(fullPath, matched ? matched.code : currentLangCode);
    } else if (item.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');

      html = html.replace(/<style id="custom-lang-style">[\s\S]*?<\/style>/i, '');
      html = html.replace('</head>', `${proThemeCss}\n</head>`);

      const optionsHtml = languages.map(l => {
        const sel = l.code === currentLangCode ? ' selected' : '';
        return `<option value="${l.url}"${sel}>${l.name}</option>`;
      }).join('\n        ');

      // Absolute path redirection to guarantee navigation works
      const cleanSelect = `<select id="langSwitcher" aria-label="Select Language" onchange="if(this.value){window.location.href = window.location.origin + this.value;}">\n        ${optionsHtml}\n      </select>`;

      html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, cleanSelect);

      fs.writeFileSync(fullPath, html, 'utf8');
    }
  }
}

processHtmlFiles(publicDir, 'id');
console.log('All HTML files updated with absolute navigation!');
