const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const snaptikFullKeywordsSEO = {
  id: {
    title: "Free TikTok Downloader - Unduh Video, MP3, Slideshow & Story TikTok HD | UnduhTik",
    desc: "Free TikTok Downloader online tanpa watermark. Unduh video TikTok, MP3 audio, foto slideshow, dan TikTok story dengan cepat, gratis, tanpa aplikasi di UnduhTik."
  },
  en: {
    title: "Free TikTok Downloader - Download TikTok Videos, MP3, Slideshow & Story HD | UnduhTik",
    desc: "Free TikTok Downloader online without watermark. Download TikTok videos, MP3 audio, photo slideshows, and TikTok stories quickly without app on UnduhTik."
  },
  es: {
    title: "Free TikTok Downloader - Descargar Videos, MP3, Fotos y Story de TikTok | UnduhTik",
    desc: "Free TikTok Downloader en línea sin marca de agua. Descarga videos de TikTok, audio MP3, fotos y TikTok stories rápido y gratis sin aplicaciones."
  },
  fr: {
    title: "Free TikTok Downloader - Télécharger Vidéo, MP3, Slideshow & Story TikTok | UnduhTik",
    desc: "Free TikTok Downloader en ligne sans filigrane. Téléchargez des vidéos TikTok, audio MP3, diaporamas et TikTok stories gratuitement sans application."
  },
  ms: {
    title: "Free TikTok Downloader - Muat Turun Video, MP3, Slideshow & Story TikTok | UnduhTik",
    desc: "Free TikTok Downloader dalam talian tanpa watermark. Muat turun video TikTok, audio MP3, slaid foto, dan TikTok story percuma tanpa aplikasi."
  },
  pt: {
    title: "Free TikTok Downloader - Baixar Vídeos, MP3, Fotos e Story do TikTok | UnduhTik",
    desc: "Free TikTok Downloader online sem marca d'água. Baixe vídeos do TikTok, áudio MP3, fotos e TikTok stories gratuitamente sem instalar app."
  },
  tr: {
    title: "Free TikTok Downloader - TikTok Video, MP3, Slayt ve Hikaye İndir | UnduhTik",
    desc: "Free TikTok Downloader ücretsiz online filigransız. TikTok videolarını, MP3 seslerini, fotoğraf slaytlarını ve TikTok hikayelerini uygulamasız indirin."
  },
  vi: {
    title: "Free TikTok Downloader - Tải Video, MP3, Slideshow & Story TikTok | UnduhTik",
    desc: "Free TikTok Downloader trực tuyến không logo. Tải video TikTok, nhạc MP3, ảnh slideshow và TikTok story miễn phí không cần cài app."
  },
  th: {
    title: "Free TikTok Downloader - ดาวน์โหลดวิดีโอ, MP3, สไลด์โชว์ & Story TikTok | UnduhTik",
    desc: "Free TikTok Downloader ออนไลน์ฟรีไม่มีลายน้ำ ดาวน์โหลดวิดีโอ TikTok, MP3, สไลด์โชว์ และ TikTok Story ได้ง่ายๆ ไม่ต้องลงแอป"
  },
  hi: {
    title: "Free TikTok Downloader - TikTok वीडियो, MP3, स्लाइडशो और स्टोरी डाउनलोड करें | UnduhTik",
    desc: "Free TikTok Downloader ऑनलाइन बिना वॉटरमार्क। TikTok वीडियो, MP3 ऑडियो, फोटो स्लाइडशो और TikTok स्टोरी मुफ्त डाउनलोड करें बिना ऐप के।"
  },
  ar: {
    title: "Free TikTok Downloader - تحميل فيديوهات، MP3، صور وستوري تيك توك | UnduhTik",
    desc: "Free TikTok Downloader مجاني بدون علامة مائية. قم بتحميل فيديوهات تيك توك، صوت MP3، الصور، وستوري تيك توك بسرعة بدون تطبيقات."
  }
};

Object.keys(snaptikFullKeywordsSEO).forEach(lang => {
  const targetPath = lang === 'id' ? path.join(publicDir, 'index.html') : path.join(publicDir, lang, 'index.html');
  if (fs.existsSync(targetPath)) {
    let html = fs.readFileSync(targetPath, 'utf8');
    const seo = snaptikFullKeywordsSEO[lang];

    html = html.replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`);
    html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, `<meta name="description" content="${seo.desc}">`);

    fs.writeFileSync(targetPath, html, 'utf8');
    console.log(`Synced Snaptik missing keywords for: /${lang === 'id' ? '' : lang + '/'}index.html`);
  }
});
