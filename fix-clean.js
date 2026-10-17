const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// The exact list of all 11 languages with clean redirect paths
const allOptions = `
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

// Safely update only the options inside the existing select element without altering its design or classes
if (mainHtml.includes('<select')) {
    mainHtml = mainHtml.replace(/<select[\s\S]*?>[\s\S]*?<\/select>/i, (match) => {
        // Keep the original opening <select ...> tag exactly as it was designed
        const openTagMatch = match.match(/<select[\s\S]*?>/i);
        const openTag = openTagMatch ? openTagMatch[0] : '<select>';
        return `${openTag}\n${allOptions}\n</select>`;
    });
    
    fs.writeFileSync(mainPath, mainHtml, 'utf8');
    console.log('Original dropdown options successfully updated!');
} else {
    console.log('Error: <select> not found.');
}
