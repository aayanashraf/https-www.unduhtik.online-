const fs = require('fs');
const path = require('path');
const publicDir = path.join(__dirname, 'public');

const fixes = {
  'contact.html': 'Hubungi tim UnduhTik untuk pertanyaan, saran, atau bantuan terkait layanan download video TikTok gratis.',
  'dmca.html': 'Halaman DMCA dan Kebijakan Hak Cipta layanan UnduhTik.',
  'privacy.html': 'Kebijakan Privasi pengguna dan perlindungan data di UnduhTik.',
  'terms.html': 'Syarat dan Ketentuan penggunaan layanan online downloader UnduhTik.'
};

Object.keys(fixes).forEach(f => {
  const p = path.join(publicDir, f);
  if (fs.existsSync(p)) {
    let h = fs.readFileSync(p, 'utf8');
    if (!/<meta\s+name=["']description["']/i.test(h)) {
      h = h.replace('</head>', `  <meta name="description" content="${fixes[f]}">\n</head>`);
      fs.writeFileSync(p, h, 'utf8');
    }
  }
});
