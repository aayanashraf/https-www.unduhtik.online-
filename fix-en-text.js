const fs = require('fs');
const path = require('path');

const enFilePath = path.join(__dirname, 'public', 'en', 'index.html');

if (fs.existsSync(enFilePath)) {
  let html = fs.readFileSync(enFilePath, 'utf8');

  // Replace Indonesian instructions/headings with English in the /en/ folder
  html = html.replace(/Cara Mengunduh Video TikTok/g, "How to Download TikTok Videos");
  html = html.replace(/Salin tautan/g, "Copy Link");
  html = html.replace(/Bagikan/g, "Share");
  html = html.replace(/Tempel Tautan/g, "Paste Link");
  html = html.replace(/Tempelkan tautan ke dalam kotak di UnduhTik/g, "Paste the link into the box on UnduhTik");
  html = html.replace(/Tempel/g, "Paste");
  html = html.replace(/Unduh/g, "Download");
  html = html.replace(/Video Tanpa Watermark \(HD\)/g, "Video Without Watermark (HD)");
  html = html.replace(/Klik tombol Unduh dan pilih format tanpa watermark/g, "Click the Download button and select the format without watermark");
  html = html.replace(/Fitur Utama UnduhTik/g, "Key Features of UnduhTik");
  html = html.replace(/Gratis Selamanya/g, "Free Forever");
  html = html.replace(/Tidak perlu daftar atau bayar/g, "No registration or payment required.");
  html = html.replace(/Tanpa Watermark/g, "Without Watermark");
  html = html.replace(/Kualitas video bersih HD/g, "Clean HD video quality.");
  html = html.replace(/Mendukung Foto Slideshow/g, "Supports Photo Slideshows");
  html = html.replace(/Unduh postingan foto TikTok satu per satu atau sekaligus \(ZIP\)/g, "Download TikTok photo posts one by one or all at once (ZIP).");
  html = html.replace(/Kompatibel/g, "Compatible");
  html = html.replace(/Bisa digunakan di Android, iPhone, PC, dan Tablet/g, "Can be used on Android, iPhone, PC, and Tablet.");

  fs.writeFileSync(enFilePath, html, 'utf8');
  console.log("✅ Successfully translated /en/ page content to English!");
}
