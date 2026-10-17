const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Translations data for new languages
const translations = {
    hi: {
        lang: 'hi',
        dir: 'ltr',
        title: 'UnduhTik - TikTok Video Downloader Without Watermark',
        heading: 'बिना वॉटरमार्क टिकटॉक वीडियो डाउनलोड करें',
        subtitle: 'मुफ्त, तेज और एचडी गुणवत्ता में टिकटॉक वीडियो और एमपी 3 डाउनलोड करें',
        placeholder: 'यहाँ टिकटॉक वीडियो का लिंक पेस्ट करें...',
        btnText: 'डाउनलोड करें'
    },
    th: {
        lang: 'th',
        dir: 'ltr',
        title: 'UnduhTik - ดาวน์โหลดวิดีโอ TikTok ไม่มีลายน้ำ',
        heading: 'ดาวน์โหลดวิดีโอ TikTok ไม่มีลายน้ำ',
        subtitle: 'ฟรี รวดเร็ว และดาวน์โหลดวิดีโอ TikTok และ MP3 ในคุณภาพ HD',
        placeholder: 'วางลิงก์วิดีโอ TikTok ที่นี่...',
        btnText: 'ดาวน์โหลด'
    },
    ar: {
        lang: 'ar',
        dir: 'rtl',
        title: 'UnduhTik - تنزيل فيديو تيك توك بدون علامة مائية',
        heading: 'تنزيل فيديوهات تيك توك بدون علامة مائية',
        subtitle: 'مجاني وسريع وبجودة عالية HD لتنزيل فيديوهات تيك توك و MP3',
        placeholder: 'أدخل رابط فيديو تيك توك هنا...',
        btnText: 'تنزيل'
    }
};

Object.keys(translations).forEach(langKey => {
    const filePath = path.join(publicDir, langKey, 'index.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const t = translations[langKey];

        // Update html lang & dir
        content = content.replace(/<html[^>]*>/i, `<html lang="${t.lang}" dir="${t.dir}">`);
        
        // Update Title
        content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t.title}</title>`);

        // Save updated content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated localized translations for: ${langKey}`);
    } else {
        console.log(`File not found for language: ${langKey}`);
    }
});
