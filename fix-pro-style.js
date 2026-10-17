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

// Modern UI matching the dark mode toggle button
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

function fixAllHtmlPages(dir, langCode) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      const matched = languages.find(l => l.code === item);
      fixAllHtmlPages(fullPath, matched ? matched.code : langCode);
    } else if (item.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');

      // Inject / Replace clean CSS
      html = html.replace(/<style id="custom-lang-style">[\s\S]*?<\/style>/i, '');
      html = html.replace('</head>', `${proThemeCss}\n</head>`);

      // Rebuild options
      const optionsHtml = languages.map(l => {
        const sel = l.code === langCode ? ' selected' : '';
        return `<option value="${l.url}"${sel}>${l.name}</option>`;
      }).join('\n        ');

      const cleanSelect = `<select id="langSwitcher" aria-label="Pilih Bahasa" onchange="if(this.value){window.location.href=this.value;}">\n        ${optionsHtml}\n      </select>`;

      html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, cleanSelect);

      fs.writeFileSync(fullPath, html, 'utf8');
      console.log(`Styling updated in: ${fullPath}`);
    }
  }
}

fixAllHtmlPages(publicDir, 'id');
