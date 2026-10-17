const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// 1. Extract the exact langSwitcher select block from main index.html
const switcherMatch = mainHtml.match(/<select id="langSwitcher"[\s\S]*?<\/select>/i);
if (!switcherMatch) {
    console.error('Error: #langSwitcher not found in main index.html!');
    process.exit(1);
}
const mainSwitcherHtml = switcherMatch[0];

// 2. List of all localized subdirectories
const langs = ['en', 'es', 'fr', 'ms', 'pt', 'tr', 'vi', 'th', 'hi', 'ar'];

langs.forEach(lang => {
    const langFilePath = path.join(publicDir, lang, 'index.html');
    if (fs.existsSync(langFilePath)) {
        let langHtml = fs.readFileSync(langFilePath, 'utf8');
        
        // Replace existing langSwitcher in the language file with the main one
        if (langHtml.includes('id="langSwitcher"')) {
            langHtml = langHtml.replace(/<select id="langSwitcher"[\s\S]*?<\/select>/i, mainSwitcherHtml);
            fs.writeFileSync(langFilePath, langHtml, 'utf8');
            console.log(`Synced langSwitcher for: ${lang}`);
        } else {
            console.log(`Warning: #langSwitcher not found in ${lang}/index.html`);
        }
    } else {
        console.log(`Directory or index.html missing for: ${lang}`);
    }
});

console.log('All dropdowns synchronized successfully!');
