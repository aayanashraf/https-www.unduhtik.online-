const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Script to add to all pages before </body>
const langScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const switcher = document.getElementById('langSwitcher');
  if (switcher) {
    switcher.addEventListener('change', function() {
      const targetPath = this.value;
      if (targetPath) {
        window.location.href = targetPath;
      }
    });
  }
});
</script>
`;

function fixLangSwitcherInDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixLangSwitcherInDir(fullPath);
    } else if (item === 'index.html') {
      let html = fs.readFileSync(fullPath, 'utf8');
      if (!html.includes('langSwitcher.addEventListener')) {
        html = html.replace('</body>', `${langScript}\n</body>`);
        fs.writeFileSync(fullPath, html, 'utf8');
        console.log(`Updated switcher script in: ${fullPath}`);
      }
    }
  }
}

fixLangSwitcherInDir(publicDir);
