const fs = require('fs');
const path = require('path');

let serverCode = fs.readFileSync('server.js', 'utf8');

// Dynamic route handling all 11 languages with or without trailing slash
const dynamicLangRoute = `
// Dynamic Multilingual Route Handler
const supportedLangs = ['en', 'es', 'fr', 'ms', 'pt', 'tr', 'vi', 'th', 'hi', 'ar'];
app.get('/:lang(' + supportedLangs.join('|') + ')/?', (req, res) => {
    const lang = req.params.lang;
    const filePath = path.join(__dirname, 'public', lang, 'index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});
`;

if (!serverCode.includes('supportedLangs.join')) {
    // Remove old loop if any, and add new dynamic route before app.listen
    serverCode = serverCode.replace(/\/\/ Multilingual Subdirectory Routes[\s\S]*?\}\);\s*\}\);\s*/g, '');
    serverCode = serverCode.replace('app.listen(', dynamicLangRoute + '\napp.listen(');
    fs.writeFileSync('server.js', serverCode, 'utf8');
    console.log('Updated server.js with dynamic language route!');
} else {
    console.log('Dynamic route already exists in server.js');
}
