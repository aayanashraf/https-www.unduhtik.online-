# UnduhTik

Website TikTok downloader — Bahasa Indonesia, multi-language (ID/EN), cache system, 
slideshow/ZIP support, proxy downloads, legal pages, SEO + schema markup.

## Cara menjalankan (lokal)

1. Install Node.js 18+ dari nodejs.org
2. Buka folder ini di VS Code
3. Terminal: `npm install`
4. Terminal: `npm start`
5. Buka browser: http://localhost:3000

## Yang baru di versi ini

- **Cache system**: link yang sama tidak diproses ulang selama 10 menit
- **Retry logic**: jika tikwm gagal sekali, otomatis coba lagi 2x sebelum menyerah
- **Slideshow + ZIP**: postingan foto TikTok bisa diunduh satu-satu atau sekaligus (ZIP)
- **Proxy download**: video/audio/foto diunduh lewat server sendiri, bukan link eksternal
  langsung — ini memperbaiki masalah "download jadi video padahal pilih MP3"
- **In-app browser warning**: peringatan muncul kalau situs dibuka dari dalam app TikTok/Instagram
- **Error toast + loading spinner**: sudah ada dari update sebelumnya
- **robots.txt** dan favicon/OG image sudah termasuk di folder public/

## Sebelum publish

1. Ganti URL `https://www.unduhtik.online/` di `public/index.html` (meta tags + 
   JSON-LD) dengan domain asli Anda jika sudah beli domain
2. Ganti email placeholder di `public/contact.html`
3. Isi slot iklan (`class="ad-slot"` di index.html) dengan kode iklan asli
4. Test ZIP download dan proxy download sebelum deploy ke Railway

## Deploy ke Railway

1. Push semua file ke GitHub repo Anda
2. Railway otomatis build & deploy (Build: `npm install`, Start: `npm start`)
3. Cek tab "Logs" di Railway kalau ada error setelah deploy
