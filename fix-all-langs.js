const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const langs = ['en', 'es', 'ar', 'hi', 'fr', 'ms', 'pt', 'tr', 'vi', 'th'];

const translations = {
  en: {
    howTo: "How to Download TikTok Videos",
    copyLink: "Copy Link",
    pasteLink: "Paste Link",
    download: "Download",
    features: "Key Features of UnduhTik"
  },
  es: {
    howTo: "Cómo descargar videos de TikTok",
    copyLink: "Copiar enlace",
    pasteLink: "Pegar enlace",
    download: "Descargar",
    features: "Características principales de UnduhTik"
  },
  ar: {
    howTo: "كيفية تحميل فيديوهات تيك توك",
    copyLink: "نسخ الرابط",
    pasteLink: "لصق الرابط",
    download: "تحميل",
    features: "المميزات الرئيسية لـ UnduhTik"
  },
  hi: {
    howTo: "TikTok वीडियो कैसे डाउनलोड करें",
    copyLink: "लिंक कॉपी करें",
    pasteLink: "लिंक पेस्ट करें",
    download: "डाउनलोड",
    features: "UnduhTik की मुख्य विशेषताएं"
  },
  fr: {
    howTo: "Comment télécharger des vidéos TikTok",
    copyLink: "Copier le lien",
    pasteLink: "Coller le lien",
    download: "Télécharger",
    features: "Principales fonctionnalités d'UnduhTik"
  },
  ms: {
    howTo: "Cara Muat Turun Video TikTok",
    copyLink: "Salin Pautan",
    pasteLink: "Tampal Pautan",
    download: "Muat Turun",
    features: "Ciri-ciri Utama UnduhTik"
  },
  pt: {
    howTo: "Como baixar vídeos do TikTok",
    copyLink: "Copiar Link",
    pasteLink: "Colar Link",
    download: "Baixar",
    features: "Principais recursos do UnduhTik"
  },
  tr: {
    howTo: "TikTok Videoları Nasıl İndirilir",
    copyLink: "Bağlantıyı Kopyala",
    pasteLink: "Bağlantıyı Yapıştır",
    download: "İndir",
    features: "UnduhTik'in Temel Özellikleri"
  },
  vi: {
    howTo: "Cách tải video TikTok",
    copyLink: "Sao chép liên kết",
    pasteLink: "Dán liên kết",
    download: "Tải về",
    features: "Tính năng chính của UnduhTik"
  },
  th: {
    howTo: "วิธีดาวน์โหลดวิดีโอ TikTok",
    copyLink: "คัดลอกลิงก์",
    pasteLink: "วางลิงก์",
    download: "ดาวน์โหลด",
    features: "ฟีเจอร์หลักของ UnduhTik"
  }
};

langs.forEach(lang => {
  const filePath = path.join(publicDir, lang, 'index.html');
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    const t = translations[lang];

    if (t) {
      html = html.replace(/Cara Mengunduh Video TikTok/g, t.howTo);
      html = html.replace(/Salin tautan/g, t.copyLink);
      html = html.replace(/Tempel Tautan/g, t.pasteLink);
      html = html.replace(/Unduh/g, t.download);
      html = html.replace(/Fitur Utama UnduhTik/g, t.features);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Fixed text for: /${lang}/`);
  }
});
