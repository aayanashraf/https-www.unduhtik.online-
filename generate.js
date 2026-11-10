const fs = require("fs");
const path = require("path");
const pages = [
  { path: "app/page.js", title: "Download Video TikTok Tanpa Watermark Online Gratis | UnduhTik", h1: "Download Video TikTok Tanpa Watermark Kualitas Terbaik", desc: "Download video TikTok tanpa watermark secara online, cepat, dan gratis." },
  { path: "app/antrean/page.js", title: "Download Banyak Video TikTok Sekaligus Tanpa Batas | UnduhTik", h1: "Tool Download Banyak Video TikTok Sekaligus", desc: "Gunakan tool batch downloader untuk download banyak video TikTok sekaligus." },
  { path: "app/mp3/page.js", title: "Download MP3 TikTok & Ubah Video Jadi Audio MP3 Gratis", h1: "Download MP3 TikTok & Ekstrak Audio Musik", desc: "Download MP3 TikTok dengan mudah dan cepat ke format audio." },
  { path: "app/cek-tanggal/page.js", title: "Cek Tanggal Upload TikTok & Metadata Video Lengkap", h1: "Cek Tanggal Upload TikTok Secara Instan", desc: "Gunakan alat cek tanggal upload TikTok secara online dan akurat." },
  { path: "app/slideshow/page.js", title: "Download Foto Slideshow TikTok Kualitas HD Terbaru", h1: "Download Foto Slideshow TikTok Tanpa Watermark", desc: "Simpan kumpulan foto carousel atau slideshow dari TikTok dengan mudah." },
  { path: "app/story/page.js", title: "Download TikTok Story Online Tanpa Ketahuan | UnduhTik", h1: "Download TikTok Story Secara Anonim & Cepat", desc: "Simpan video story TikTok milik teman atau kreator favorit Anda." },
  { path: "app/vt-link/page.js", title: "Download Video dari Link vt.tiktok.com Tanpa Ribet", h1: "Download Video dari Link vt.tiktok.com Otomatis", desc: "Paste link pendek vt.tiktok.com untuk langsung download video." },
  { path: "app/tutorial/android-pc/page.js", title: "Cara Download TikTok di Android dan PC dengan Mudah", h1: "Panduan Lengkap Cara Download TikTok di Android dan PC", desc: "Ikuti panduan langkah demi langkah cara download video TikTok di HP dan PC." },
  { path: "app/tutorial/iphone/page.js", title: "Panduan Praktis Cara Download TikTok di iPhone (iOS)", h1: "Cara Download TikTok di iPhone Menggunakan Safari", desc: "Simak tutorial lengkap cara download TikTok di iPhone via browser." },
  { path: "app/blog/laptop/page.js", title: "Cara Download Video TikTok di Laptop Tanpa Ribet", h1: "Artikel & Tips: Cara Download Video TikTok di Laptop", desc: "Pelajari cara paling gampang download video TikTok di laptop." },
  { path: "app/blog/tanpa-watermark/page.js", title: "Cara Download Video TikTok Tanpa Watermark (Panduan)", h1: "Panduan Lengkap: Cara Download Video TikTok Tanpa Watermark", desc: "Temukan trik dan cara terbaik mendownload video TikTok bersih tanpa logo." },
  { path: "app/blog/iphone-watermark/page.js", title: "Cara Download Video TikTok di iPhone Tanpa Watermark", h1: "Tips Khusus Pengguna iOS: Download TikTok Tanpa Watermark", desc: "Panduan khusus pengguna Apple untuk menyimpan video tanpa tanda air." },
  { path: "app/blog/jadi-mp3/page.js", title: "Cara Mengubah Video TikTok Menjadi MP3 dengan Mudah", h1: "Tutorial: Cara Mengubah Video TikTok Menjadi MP3", desc: "Ikuti panduan cara mengubah video TikTok menjadi MP3 audio berkualitas." },
  { path: "app/blog/slideshow/page.js", title: "Tips & Cara Menyimpan Foto Slideshow TikTok Sekaligus", h1: "Cara Menyimpan Foto Slideshow TikTok Sekaligus", desc: "Pelajari cara mendownload seluruh foto dari slideshow TikTok." },
  { path: "app/blog/gagal-diunduh/page.js", "title": "Kenapa Video TikTok Gagal Diunduh? Ini Solusinya", "h1": "Analisis Masalah: Kenapa Video TikTok Gagal Diunduh?", desc: "Ketahui berbagai penyebab utama kenapa video TikTok gagal diunduh." },
  { path: "app/blog/tidak-muncul-di-galeri/page.js", title: "Video TikTok Tidak Muncul di Galeri? Begini Solusinya", "h1": "Solusi: Video TikTok Tidak Muncul di Galeri HP", desc: "Temukan penyebab dan solusi video TikTok tidak muncul di galeri." },
  { path: "app/troubleshooting/page.js", title: "Video TikTok Tidak Bisa Diunduh? Cek Solusi Di Sini", "h1": "Pusat Bantuan: Mengatasi Video TikTok yang Tidak Bisa Diunduh", desc: "Pusat bantuan utama mengatasi video TikTok yang dibatasi atau privat." },
  { path: "app/blog/page.js", title: "Artikel dan Panduan TikTok Terbaru | Tips & Trik UnduhTik", "h1": "Blog Artikel dan Panduan TikTok Terlengkap", desc: "Jelajahi kumpulan artikel, tips, dan trik seputar platform TikTok." },
  { path: "app/panduan/page.js", title: "Panduan Download TikTok Paling Mudah dan Cepat", "h1": "Panduan Lengkap Cara Download TikTok untuk Pemula", desc: "Halaman panduan resmi tata cara mendownload video maupun audio." },
  { path: "app/fitur/page.js", title: "Fitur UnduhTik: Tool Download TikTok Terbaik & Gratis", "h1": "Kenali Berbagai Fitur Unggulan UnduhTik", desc: "Pelajari fitur-fitur canggih yang ditawarkan oleh UnduhTik." }
];
pages.forEach(p => {
  const dir = path.dirname(p.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(p.path)) {
    const content = `// Generated SEO Page\nexport const metadata = {\n  title: "${p.title}",\n  description: "${p.desc}",\n};\n\nexport default function Page() {\n  return (\n    <main className="p-6">\n      <h1 className="text-3xl font-bold">${p.h1}</h1>\n      <p className="mt-4">${p.desc}</p>\n    </main>\n  );\n}\n`;
    fs.writeFileSync(p.path, content, "utf-8");
  }
});
console.log("All 20 SEO pages successfully initialized safely!");

