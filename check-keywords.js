const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function checkKeywords(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      checkKeywords(fullPath);
    } else if (item.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf8');
      
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      
      const title = titleMatch ? titleMatch[1] : 'No Title Found';
      const desc = descMatch ? descMatch[1] : 'No Description Found';

      const relativePath = path.relative(publicDir, fullPath);
      console.log(`\n📄 Page: /${relativePath}`);
      console.log(`📌 Title (Main Keywords): ${title}`);
      console.log(`📝 Meta Description: ${desc}`);
      console.log('-'.repeat(50));
    }
  }
}

console.log('=== WEBSITE KEYWORDS & META INFO ===');
checkKeywords(publicDir);
