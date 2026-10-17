const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Translations for UI texts per language
const translations = {
  id: {
    beranda: "Beranda", cara: "Cara Unduh", faq: "FAQ", blog: "Blog", kontak: "Kontak",
    heading: "Unduh Video TikTok Tanpa Watermark",
    placeholder: "Tempel tautan TikTok di sini...",
    downloadBtn: "Unduh"
  },
  en: {
    beranda: "Home", cara: "How to Download", faq: "FAQ", blog: "Blog", kontak: "Contact",
    heading: "Download TikTok Videos Without Watermark",
    placeholder: "Paste TikTok link here...",
    downloadBtn: "Download"
  },
  es: {
    beranda: "Inicio", cara: "Cómo Descargar", faq: "FAQ", blog: "Blog", kontak: "Contacto",
    heading: "Descargar Videos de TikTok Sin Marca de Agua",
    placeholder: "Pega el enlace de TikTok aquí...",
    downloadBtn: "Descargar"
  },
  fr: {
    beranda: "Accueil", cara: "Comment Télécharger", faq: "FAQ", blog: "Blog", kontak: "Contact",
    heading: "Télécharger des vidéos TikTok sans filigrane",
    placeholder: "Collez le lien TikTok ici...",
    downloadBtn: "Télécharger"
  },
  ms: {
    beranda: "Laman Utama", cara: "Cara Muat Turun", faq: "FAQ", blog: "Blog", kontak: "Hubungi",
    heading: "Muat Turun Video TikTok Tanpa Watermark",
    placeholder: "Tampal pautan TikTok di sini...",
    downloadBtn: "Muat Turun"
  },
  pt: {
    beranda: "Início", cara: "Como Baixar", faq: "FAQ", blog: "Blog", kontak: "Contato",
    heading: "Baixar Vídeos do TikTok Sem Marca d'Água",
    placeholder: "Cole o link do TikTok aqui...",
    downloadBtn: "Baixar"
  },
  tr: {
    beranda: "Ana Sayfa", cara: "Nasıl İndirilir", faq: "SSS", blog: "Blog", kontak: "İletişim",
    heading: "Filigransız TikTok Videosu İndir",
    placeholder: "TikTok bağlantısını buraya yapıştırın...",
    downloadBtn: "İndir"
  },
  vi: {
    beranda: "Trang chủ", cara: "Cách Tải", faq: "FAQ", blog: "Blog", kontak: "Liên hệ",
    heading: "Tải Video TikTok Không Có Logo",
    placeholder: "Dán liên kết TikTok vào đây...",
    downloadBtn: "Tải xuống"
  },
  th: {
    beranda: "หน้าแรก", cara: "วิธีดาวน์โหลด", faq: "FAQ", blog: "บล็อก", kontak: "ติดต่อ",
    heading: "ดาวน์โหลดวิดีโอ TikTok โดยไม่มีลายน้ำ",
    placeholder: "วางลิงก์ TikTok ที่นี่...",
    downloadBtn: "ดาวน์โหลด"
  },
  hi: {
    beranda: "होम", cara: "कैसे डाउनलोड करें", faq: "FAQ", blog: "ब्लॉग", kontak: "संपर्क",
    heading: "बिना वॉटरमार्क के TikTok वीडियो डाउनलोड करें",
    placeholder: "यहाँ TikTok लिंक पेस्ट करें...",
    downloadBtn: "डाउनलोड"
  },
  ar: {
    beranda: "الرئيسية", cara: "طريقة التحميل", faq: "الأسئلة الشائعة", blog: "المدونة", kontak: "اتصل بنا",
    heading: "تحميل فيديوهات تيك توك بدون علامة مائية",
    placeholder: "الصبط رابط تيك توك هنا...",
    downloadBtn: "تحميل"
  }
};

const languages = [
  { code: 'id', name: '🌐 ID - Bahasa Indonesia', url: '/' },
  { code: 'en', name: '🌐 EN - English', url: '/en/' },
  { code: 'es', name: '🌐 ES - Español', url: '/es/' },
  { code: 'fr', name: '🌐 FR - Français', url: '/fr/' },
  { code: 'ms', name: '🌐 MS - Bahasa Melayu', url: '/ms/' },
  { code: 'pt', name: '🌐 PT - Português', url: '/pt/' },
  { code: 'tr', name: '🌐 TR - Türkçe', url: '/tr/' },
  { code: 'vi', name: '🌐 VI - Tiếng Việt', url: '/vi/' },
  { code: 'th', name: '🌐 TH - ไทย', url: '/th/' },
  { code: 'hi', name: '🌐 HI - हिन्दी', url: '/hi/' },
  { code: 'ar', name: '🌐 AR - العربية', url: '/ar/' }
];

const rootIndexPath = path.join(publicDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  const baseHtml = fs.readFileSync(rootIndexPath, 'utf8');

  languages.forEach(lang => {
    const langDir = path.join(publicDir, lang.code);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    let translatedHtml = baseHtml;
    const t = translations[lang.code] || translations['en'];

    // Replace text elements safely for each language version
    // Navbar links
    translatedHtml = translatedHtml.replace(/>Beranda<\/a>/g, `>${t.beranda}</a>`);
    translatedHtml = translatedHtml.replace(/>Cara Unduh<\/a>/g, `>${t.cara}</a>`);
    translatedHtml = translatedHtml.replace(/>FAQ<\/a>/g, `>${t.faq}</a>`);
    translatedHtml = translatedHtml.replace(/>Blog<\/a>/g, `>${t.blog}</a>`);
    translatedHtml = translatedHtml.replace(/>Kontak<\/a>/g, `>${t.kontak}</a>`);

    // Main Heading & Input placeholders if matched
    translatedHtml = translatedHtml.replace(/<h1>.*?<\/h1>/i, `<h1>${t.heading}</h1>`);
    translatedHtml = translatedHtml.replace(/placeholder="[^"]*"/g, `placeholder="${t.placeholder}"`);

    // Rebuild options with correct selected attribute for this folder
    const optionsHtml = languages.map(l => {
      const sel = l.code === lang.code ? ' selected' : '';
      return `<option value="${l.url}"${sel}>${l.name}</option>`;
    }).join('\n        ');

    const cleanSelect = `<select id="langSwitcher" aria-label="Select Language" onchange="if(this.value){window.location.href = window.location.origin + this.value;}">\n        ${optionsHtml}\n      </select>`;

    translatedHtml = translatedHtml.replace(/<select[^>]*id=["']langSwitcher["'][^>]*>[\s\S]*?<\/select>/i, cleanSelect);

    fs.writeFileSync(path.join(langDir, 'index.html'), translatedHtml, 'utf8');
    console.log(`Generated translated page for: ${lang.code}`);
  });
}
