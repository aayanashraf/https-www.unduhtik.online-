const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// Convert relative href and src attributes to absolute root-relative paths (starting with /)
// Skipping external links (http, https, //, mailto, #, data:)
mainHtml = mainHtml.replace(/(href|src)=["'](?!http:\/\/|https:\/\/|\/\/|#|data:|\/)([^"']+)["']/gi, (match, attr, val) => {
    return `${attr}="/${val}"`;
});

fs.writeFileSync(mainPath, mainHtml, 'utf8');
console.log('Asset paths fixed to absolute root paths in main index.html!');
