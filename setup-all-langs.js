const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

const langs = ['en', 'es', 'fr', 'ms', 'pt', 'tr', 'vi', 'th', 'hi', 'ar'];

langs.forEach(lang => {
    const langDir = path.join(publicDir, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }
    
    const langFilePath = path.join(langDir, 'index.html');
    
    // Copy main html and adjust lang / rtl if needed
    let langContent = mainHtml;
    if (lang === 'ar') {
        if (!langContent.includes('dir="rtl"')) {
            langContent = langContent.replace(/<html /, '<html dir="rtl" lang="ar" ');
        }
    } else {
        langContent = langContent.replace(/lang="[^"]*"/, `lang="${lang}"`);
    }

    fs.writeFileSync(langFilePath, langContent, 'utf8');
    console.log(`Created/Updated physical folder & index.html for: ${lang}`);
});

console.log('All language directories and files setup completed successfully!');
