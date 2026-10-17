const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

let mainHtml = fs.readFileSync(mainPath, 'utf8');

if (!mainHtml.includes('href="/blog"')) {
    // Insert Blog right before Kontak
    mainHtml = mainHtml.replace(
        '<a href="/contact.html">Kontak</a>',
        '<a href="/blog">Blog</a>\n          <a href="/contact.html">Kontak</a>'
    );
    fs.writeFileSync(mainPath, mainHtml, 'utf8');
    console.log('Blog link successfully added to navigation!');
} else {
    console.log('Blog link already exists.');
}
