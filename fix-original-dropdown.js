const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// The 11 standard language options to inject into the existing select dropdown
const allOptionsHTML = `
    <option value="id">Bahasa Indonesia</option>
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
    <option value="ms">Bahasa Melayu</option>
    <option value="pt">Português</option>
    <option value="tr">Türkçe</option>
    <option value="vi">Tiếng Việt</option>
    <option value="th">ไทย</option>
    <option value="hi">हिन्दी</option>
    <option value="ar">العربية</option>
`;

// Find the existing select tag (whatever ID or class it has) and update its options cleanly
if (mainHtml.includes('<select')) {
    // Replace everything inside the existing <select> ... </select> with our complete 11 languages
    mainHtml = mainHtml.replace(/<select[\s\S]*?>[\s\S]*?<\/select>/i, (match) => {
        // Extract the opening <select ...> tag attributes
        const openingTagMatch = match.match(/<select[\s\S]*?>/i);
        const openingTag = openingTagMatch ? openingTagMatch[0] : '<select>';
        return `${openingTag}\n${allOptionsHTML}\n</select>`;
    });
    
    fs.writeFileSync(mainPath, mainHtml, 'utf8');
    console.log('Successfully updated existing dropdown options in main index.html!');
} else {
    console.log('No <select> tag found in main index.html');
}
