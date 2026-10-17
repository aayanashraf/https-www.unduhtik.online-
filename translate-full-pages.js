const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Complete UI Translations for all page sections
const translations = {
  en: {
    heading: "Free TikTok Downloader Without Watermark",
    subheading: "Download TikTok Videos, MP3 Audio, Photo Slideshows, and Stories in HD quality for free.",
    placeholder: "Paste TikTok link here...",
    btn: "Download",
    howToTitle: "How to Download TikTok Content:",
    step1: "Open the TikTok app and find the video, story, or slideshow you want.",
    step2: "Tap the Share button and select Copy Link.",
    step3: "Paste the link in the box above and click Download."
  },
  es: {
    heading: "Descargar Videos de TikTok Sin Marca de Agua",
    subheading: "Descarga videos de TikTok, audio MP3, diapositivas de fotos y Historias gratis en calidad HD.",
    placeholder: "Pega el enlace de TikTok aquí...",
    btn: "Descargar",
    howToTitle: "Cómo descargar contenido de TikTok:",
    step1: "Abre la aplicación TikTok y busca el video, historia o fotos.",
    step2: "Toca el botón Compartir y selecciona Copiar enlace.",
    step3: "Pega el enlace en el cuadro de arriba y haz clic en Descargar."
  },
  fr: {
    heading: "Télécharger Vidéo TikTok Sans Filigrane",
    subheading: "Téléchargez des vidéos TikTok, audio MP3, diaporamas photo et Stories gratuitement en HD.",
    placeholder: "Collez le lien TikTok ici...",
    btn: "Télécharger",
    howToTitle: "Comment télécharger du contenu TikTok :",
    step1: "Ouvrez l'application TikTok et choisissez le contenu.",
    step2: "Appuyez sur Partager puis sélectionnez Copier le lien.",
    step3: "Collez le lien ci-dessus et cliquez sur Télécharger."
  },
  ms: {
    heading: "Muat Turun Video TikTok Tanpa Watermark",
    subheading: "Muat turun video TikTok, audio MP3, slaid foto, dan Story percuma dalam kualiti HD.",
    placeholder: "Tampal pautan TikTok di sini...",
    btn: "Muat Turun",
    howToTitle: "Cara Muat Turun Kandungan TikTok:",
    step1: "Buka aplikasi TikTok dan cari kandungan yang anda inginkan.",
    step2: "Ketik butang Kongsi dan pilih Salin Pautan.",
    step3: "Tampal pautan pada ruang di atas dan klik Muat Turun."
  },
  pt: {
    heading: "Baixar Vídeo do TikTok Sem Marca d'Água",
    subheading: "Baixe vídeos do TikTok, áudio MP3, fotos e Stories gratuitamente em alta qualidade HD.",
    placeholder: "Cole o link do TikTok aqui...",
    btn: "Baixar",
    howToTitle: "Como baixar conteúdo do TikTok:",
    step1: "Abra o aplicativo TikTok e selecione o vídeo ou Story.",
    step2: "Toque em Compartilhar e clique em Copiar Link.",
    step3: "Cole o link no campo acima e clique em Baixar."
  },
  tr: {
    heading: "Filigransız TikTok Video İndir",
    subheading: "TikTok videolarını, MP3 seslerini, fotoğraf slaytlarını ve Hikayeleri HD kalitede ücretsiz indirin.",
    placeholder: "TikTok bağlantısını buraya yapıştırın...",
    btn: "İndir",
    howToTitle: "TikTok İçeriği Nasıl İndirilir:",
    step1: "TikTok uygulamasını açın ve istediğiniz içeriği bulun.",
    step2: "Paylaş butonuna dokunun ve Bağlantıyı Kopyala seçeneğini seçin.",
    step3: "Bağlantıyı yukarıdaki kutuya yapıştırın ve İndir butonuna tıklayın."
  },
  vi: {
    heading: "Tải Video TikTok Không Logo Mờ",
    subheading: "Tải video TikTok, nhạc MP3, ảnh slideshow và TikTok Story miễn phí chất lượng HD.",
    placeholder: "Dán liên kết TikTok vào đây...",
    btn: "Tải Vé",
    howToTitle: "Cách tải nội dung TikTok:",
    step1: "Mở ứng dụng TikTok và chọn nội dung bạn muốn tải.",
    step2: "Nhấn vào nút Chia sẻ và chọn Sao chép liên kết.",
    step3: "Dán liên kết vào ô phía trên và nhấn Tải về."
  },
  th: {
    heading: "ดาวน์โหลดวิดีโอ TikTok ไม่มีลายน้ำ",
    subheading: "ดาวน์โหลดวิดีโอ TikTok, เสียง MP3, สไลด์โชว์ และ Story ได้ฟรีในความละเอียด HD",
    placeholder: "วางลิงก์ TikTok ที่นี่...",
    btn: "ดาวน์โหลด",
    howToTitle: "วิธีดาวน์โหลดคอนเทนต์ TikTok:",
    step1: "เปิดแอป TikTok และค้นหาวิดีโอหรือ Story ที่ต้องการ",
    step2: "กดปุ่ม แชร์ แล้วเลือก คัดลอกลิงก์",
    step3: "วางลิงก์ในช่องด้านบน แล้วกดปุ่ม ดาวน์โหลด"
  },
  hi: {
    heading: "बिना वॉटरमार्क TikTok वीडियो डाउनलोड करें",
    subheading: "TikTok वीडियो, MP3 ऑडियो, फोटो स्लाइडशो और स्टोरी मुफ्त में HD क्वालिटी में डाउनलोड करें।",
    placeholder: "यहाँ TikTok लिंक पेस्ट करें...",
    btn: "डाउनलोड",
    howToTitle: "TikTok सामग्री कैसे डाउनलोड करें:",
    step1: "TikTok ऐप खोलें और अपनी पसंदीदा वीडियो या स्टोरी ढूंढें।",
    step2: "शेयर बटन पर टैप करें और कॉपी लिंक चुनें।",
    step3: "ऊपर दिए गए बॉक्स में लिंक पेस्ट करें और डाउनलोड पर क्लिक करें।"
  },
  ar: {
    heading: "تحميل فيديوهات تيك توك بدون علامة مائية",
    subheading: "قم بتحميل فيديوهات تيك توك، صوت MP3، الصور، وستوري تيك توك مجانًا وبجودة HD.",
    placeholder: "الصق رابط تيك توك هنا...",
    btn: "تحميل",
    howToTitle: "كيفية تحميل محتوى تيك توك:",
    step1: "افتح تطبيق تيك توك واختر الفيديو أو الاستوري.",
    step2: "اضغط على زر المشاركة ثم اختر نسخ الرابط.",
    step3: "الصق الرابط في المربع أعلاه واضغط على تحميل."
  }
};

Object.keys(translations).forEach(lang => {
  const filePath = path.join(publicDir, lang, 'index.html');
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    const t = translations[lang];

    // Replace Main UI Headings and Text
    html = html.replace(/<h1.*?>.*?<\/h1>/s, `<h1 class="text-3xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500">${t.heading}<\/h1>`);
    html = html.replace(/placeholder=["'].*?["']/i, `placeholder="${t.placeholder}"`);
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Fully translated full page content for: /${lang}/index.html`);
  }
});
