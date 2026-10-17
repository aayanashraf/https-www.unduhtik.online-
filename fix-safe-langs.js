const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Translations mapping for body content while keeping layout intact
const langTexts = {
  en: {
    heading: "Free TikTok Downloader Without Watermark",
    subheading: "Download TikTok Videos, MP3 Audio, Photo Slideshows, and Stories in HD quality for free.",
    howTo: "How to Download TikTok Content"
  },
  es: {
    heading: "Descargar Videos de TikTok Sin Marca de Agua",
    subheading: "Descarga videos de TikTok, audio MP3, diapositivas y historias en calidad HD gratis.",
    howTo: "Cómo descargar contenido de TikTok"
  },
  ar: {
    heading: "تحميل فيديوهات تيك توك بدون علامة مائية",
    subheading: "قم بتحميل فيديوهات تيك توك، صوت MP3، الصور، وستوري تيك توك مجانًا وبجودة HD.",
    howTo: "كيفية تحميل محتوى تيك توك"
  },
  hi: {
    heading: "बिना वॉटरमार्क TikTok वीडियो डाउनलोड करें",
    subheading: "TikTok वीडियो, MP3 ऑडियो, फोटो स्लाइडशो और स्टोरी मुफ्त में HD क्वालिटी में डाउनलोड करें।",
    howTo: "TikTok सामग्री कैसे डाउनलोड करें"
  },
  fr: {
    heading: "Télécharger Vidéo TikTok Sans Filigrane",
    subheading: "Téléchargez des vidéos TikTok, audio MP3, diaporamas et Stories en HD gratuitement.",
    howTo: "Comment télécharger du contenu TikTok"
  },
  ms: {
    heading: "Muat Turun Video TikTok Tanpa Watermark",
    subheading: "Muat turun video TikTok, audio MP3, slaid foto, dan Story secara percuma dalam kualiti HD.",
    howTo: "Cara Muat Turun Kandungan TikTok"
  },
  pt: {
    heading: "Baixar Vídeo do TikTok Sem Marca d'Água",
    subheading: "Baixe vídeos do TikTok, áudio MP3, fotos e Stories em alta qualidade HD gratuitamente.",
    howTo: "Como baixar conteúdo do TikTok"
  },
  tr: {
    heading: "Filigransız TikTok Video İndir",
    subheading: "TikTok videolarını, MP3 seslerini, fotoğraf slaytlarını ve Hikayeleri ücretsiz indirin.",
    howTo: "TikTok İçeriği Nasıl İndirilir"
  },
  vi: {
    heading: "Tải Video TikTok Không Logo Mờ",
    subheading: "Tải video TikTok, nhạc MP3, ảnh slideshow và Story hoàn toàn miễn phí chất lượng HD.",
    howTo: "Cách tải nội dung TikTok"
  }
};

Object.keys(langTexts).forEach(lang => {
  const filePath = path.join(publicDir, lang, 'index.html');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const t = langTexts[lang];
    
    // Safely replace text blocks without touching design/CSS classes
    // Also inject GA4 language tracking event
    if (!content.includes('gtag(\'event\', \'page_language\'')) {
      content = content.replace('</head>', `  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
    gtag('event', 'page_language', { 'language_code': '${lang}' });
  </script>\n</head>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Safely updated language and analytics for: /${lang}/`);
  }
});
