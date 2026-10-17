const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const languages = [
  { code: 'id', name: '🌐 Bahasa Indonesia', url: '/' },
  { code: 'en', name: '🌐 English', url: '/en/' },
  { code: 'es', name: '🌐 Español', url: '/es/' },
  { code: 'fr', name: '🌐 Français', url: '/fr/' },
  { code: 'ms', name: '🌐 Bahasa Melayu', url: '/ms/' },
  { code: 'pt', name: '🌐 Português', url: '/pt/' },
  { code: 'tr', name: '🌐 Türkçe', url: '/tr/' },
  { code: 'vi', name: '🌐 Tiếng Việt', url: '/vi/' },
  { code: 'th', name: '🌐 ไทย', url: '/th/' },
  { code: 'hi', name: '🌐 हिन्दी', url: '/hi/' },
  { code: 'ar', name: '🌐 العربية', url: '/ar/' }
];

const customCss = `
<style id="custom-lang-style">
  #langSwitcher {
    background-color: #ffffff;
    color: #333333;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    transition: all 0.25s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    appearance: auto;
  }
  #langSwitcher:hover {
    border-color: #ff007f;
    box-shadow: 0 4px 10px rgba(255, 0, 127, 0.15);
  }
  #langSwitcher:focus {
    border-color: #00f2fe;
    box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.25);
  }
</style>
`;

function processDir(dir, currentLangCode) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const matched = languages.find(l => l.code === item);
      processDir(fullPath, matched ? matched.code : currentLangCode);
    } else if (item.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');

      // Add CSS if not present
      if (!html.includes('id="custom-lang-style"')) {
        html = html.replace('</head>', `${customCss}\n</head>`);
      }

      // Rebuild options with clean labels
      const optionsHtml = languages.map(l => {
        const sel = l.code === currentLangCode ? ' selected' : '';
        return `<option value="${l.url}"${sel}>${l.name}</option>`;
      }).join('\n        ');

      const professionalSelect = `<select id="langSwitcher" aria-label="Select Language" onchange="if(this.value){window.location.href=this.value;}">\n        ${optionsHtml}\n      </select>`;

      html = html.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, professionalSelect);

      fs.writeFileSync(fullPath, html, 'utf8');
      console.log(`Updated professional styling in: ${fullPath}`);
    }
  }
}

processDir(publicDir, 'id');
