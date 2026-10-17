const fs = require('fs');
const path = require('path');

let serverCode = fs.readFileSync('server.js', 'utf8');

// The language routes block to insert before app.listen
const langRoutesCode = `
// Multilingual Subdirectory Routes
const supportedLangs = ['en', 'es', 'fr', 'ms', 'pt', 'tr', 'vi', 'th', 'hi', 'ar'];
supportedLangs.forEach(lang => {
    app.get('/' + lang + '/', (req, res) => {
        const filePath = path.join(__dirname, 'public', lang, 'index.html');
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('Page not found');
        }
    });
});
`;

if (!serverCode.includes('supportedLangs')) {
    // Insert before app.listen
    serverCode = serverCode.replace('app.listen(', langRoutesCode + '\napp.listen(');
    fs.writeFileSync('server.js', serverCode, 'utf8');
    console.log('server.js updated with multilingual subdirectory routes!');
} else {
    console.log('Multilingual routes already exist in server.js');
}
