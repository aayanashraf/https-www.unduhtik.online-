const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Updated CSS matching the main dark/gradient theme
const themeCss = `
<style id="custom-lang-style">
  #langSwitcher {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 8px 14px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    transition: all 0.25s ease;
    backdrop-filter: blur(10px);
  }
  #langSwitcher option {
    background-color: #1a1a2e;
    color: #ffffff;
    padding: 10px;
  }
  #langSwitcher:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #00f2fe;
  }
  #langSwitcher:focus {
    border-color: #ff007f;
    box-shadow: 0 0 10px rgba(255, 0, 127, 0.3);
  }
</style>
`;

function updateTheme(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      updateTheme(fullPath);
    } else if (item.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');

      // Remove old style if exists
      html = html.replace(/<style id="custom-lang-style">[\s\S]*?<\/style>/i, '');

      // Insert new theme-matching style
      html = html.replace('</head>', `${themeCss}\n</head>`);

      fs.writeFileSync(fullPath, html, 'utf8');
    }
  }
  console.log('Dropdown theme updated across all pages!');
}

updateTheme(publicDir);
