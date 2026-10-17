const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const mainPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(mainPath)) {
    console.error('index.html not found!');
    process.exit(1);
}

let mainHtml = fs.readFileSync(mainPath, 'utf8');

// Complete 11 language options matching exact path structure
const exactOptions = `<select id="langSwitcher" class="lang-switcher" aria-label="Pilih bahasa / Select language">
            <option value="/">Bahasa Indonesia</option>
            <option value="/en/">English</option>

            <option value="/es/">Español</option>
            <option value="/fr/">Français</option>
            <option value="/ms/">Bahasa Melayu</option>
            <option value="/pt/">Português</option>
            <option value="/tr/">Türkçe</option>
            <option value="/vi/">Tiếng Việt</option>
            <option value="/th/">ไทย</option>

            <option value="/hi/">हिन्दी</option>

            <option value="/ar/">العربية</option>

          </select>`;

// Replace existing select cleanly
mainHtml = mainHtml.replace(/<select id="langSwitcher"[\s\S]*?<\/select>/i, exactOptions);

fs.writeFileSync(mainPath, mainHtml, 'utf8');
console.log('Successfully updated langSwitcher with all 11 languages!');
