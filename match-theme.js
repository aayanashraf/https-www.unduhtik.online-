const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Exact theme matching CSS using existing button/nav variables
const exactThemeCss = `
<style id="custom-lang-style">
  #langSwitcher {
    background: transparent;
    color: var(--text-color, #ffffff);
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 6px 12px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
    border-radius: 6px;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;
  }
  #langSwitcher:hover, #langSwitcher:focus {
    border-color: var(--accent-color, #ff007f);
    background: rgba(255, 255, 255, 0.05);
  }
  #langSwitcher option {
    background: #121212;
    color: #ffffff;
    padding: 10px;
  }
</style>
`;

function applyExactTheme(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      applyExactTheme(fullPath);
    } else if (item.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');

      // Remove previous custom styles
      html = html.replace(/<style id="custom-lang-style">[\s\S]*?<\/style>/i, '');
      
      // Inject matching style before </head>
      html = html.replace('</head>', `${exactThemeCss}\n</head>`);

      fs.writeFileSync(fullPath, html, 'utf8');
    }
  }
  console.log('Dropdown updated with exact theme matching style!');
}

applyExactTheme(publicDir);
