const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');
const mainHtml = fs.readFileSync(mainPath, 'utf8');

// Missing languages that need physical folders
const newLangs = ['th', 'hi', 'ar'];

newLangs.forEach(lang => {
    const langDir = path.join(publicDir, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }
    
    const langFilePath = path.join(langDir, 'index.html');
    
    // Create a copy of index.html for this language, updating the lang attribute if needed
    let langContent = mainHtml.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
    
    // If arabic, add dir="rtl" to html tag
    if (lang === 'ar') {
        langContent = langContent.replace(/<html /, '<html dir="rtl" ');
    }

    fs.writeFileSync(langFilePath, langContent, 'utf8');
    console.log(`Created directory and index.html for: ${lang}`);
});
