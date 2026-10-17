const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// Function that handles seamless language switching based on root vs subfolder
const correctSelectScript = `
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

// Replace <select> and update onchange attribute
mainHtml = mainHtml.replace(/<select[\s\S]*?>[\s\S]*?<\/select>/i, (match) => {
    return `<select onchange="window.location.href = this.value === 'id' ? '/' : '/' + this.value + '/'" class="bg-gray-800 text-white px-3 py-1 rounded-md text-sm border border-gray-700 focus:outline-none">\n${correctSelectScript}\n</select>`;
});

fs.writeFileSync(mainPath, mainHtml, 'utf8');
console.log('Language select redirect logic updated successfully!');
