const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// Insert Blog link right before Kontak or at the end of main nav list
if (!mainHtml.includes('href="/blog"') && !mainHtml.includes('href="blog"')) {
    // Look for Kontak link to place Blog before/after it
    if (mainHtml.includes('Kontak')) {
        mainHtml = mainHtml.replace(/(<a[^>]*href="[^"]*#kontak"[^>]*>[\s\S]*?<\/a>)/i, '$1\n        <a href="/blog" class="nav-link">Blog</a>');
    } else if (mainHtml.includes('href="#faq"')) {
        mainHtml = mainHtml.replace(/(<a[^>]*href="[^"]*#faq"[^>]*>[\s\S]*?<\/a>)/i, '$1\n        <a href="/blog" class="nav-link">Blog</a>');
    }
    
    fs.writeFileSync(mainPath, mainHtml, 'utf8');
    console.log('Blog option successfully added to main index.html header navigation!');
} else {
    console.log('Blog option already exists in main index.html');
}
