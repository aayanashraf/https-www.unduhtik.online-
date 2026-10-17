const express = require('express');
const path = require('path');
const dns = require('dns').promises;
const net = require('net');
const { Readable } = require('stream');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 3000;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Fixes broken URLs like "https://www.tikwm.comhttps://v16m...." and relative paths
function cleanRemoteUrl(u) {
  if (!u) return '';
  u = String(u).replace(/^https?:\/\/[^\/?#]*?(?=https?:\/\/)/i, '');
  if (u.startsWith('//')) u = 'https:' + u;
  else if (u.startsWith('/')) u = 'https://www.tikwm.com' + u;
  return u;
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    return l === '::1' || l === '::' || l.startsWith('fc') || l.startsWith('fd') ||
      l.startsWith('fe80') || l.startsWith('::ffff:');
  }
  return true;
}

// Security: never let the proxy reach internal/private addresses
async function assertPublicUrl(u) {
  const p = new URL(u);
  if (p.protocol !== 'https:' && p.protocol !== 'http:') throw new Error('bad protocol');
  const addrs = await dns.lookup(p.hostname, { all: true });
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new Error('blocked host');
}

async function safeFetch(url) {
  let current = cleanRemoteUrl(url);
  for (let i = 0; i < 4; i++) {
    await assertPublicUrl(current);
    const r = await fetch(current, {
      redirect: 'manual',
      headers: { 'User-Agent': UA, Referer: 'https://www.tikwm.com/' },
    });
    const loc = r.headers.get('location');
    if (r.status >= 300 && r.status < 400 && loc) {
      current = new URL(loc, current).href;
      continue;
    }
    return r;
  }
  throw new Error('too many redirects');
}

function safeBaseName(name) {
  const base = String(name || 'unduhtik')
    .replace(/[\\/:*?"<>|\r\n]+/g, '')
    .trim()
    .slice(0, 60);
  return base || 'unduhtik';
}

function attachmentHeader(base, ext) {
  const ascii = base.replace(/[^\x20-\x7e]/g, '_');
  return `attachment; filename="${ascii}.${ext}"; filename*=UTF-8''${encodeURIComponent(base)}.${ext}`;
}

// Very small in-memory rate limit: 20 lookups / minute / IP
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const rec = (hits.get(req.ip) || []).filter((t) => now - t < 60000);
  if (rec.length >= 20) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait a minute and try again.' });
  }
  rec.push(now);
  hits.set(req.ip, rec);
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, arr] of hits) if (!arr.some((t) => now - t < 60000)) hits.delete(ip);
}, 5 * 60 * 1000).unref();

async function fetchTikwm(videoUrl) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`,
      { headers: { 'User-Agent': UA } }
    );
    const j = await r.json();
    if (j.code === 0 && j.data) return j.data;
    // tikwm free tier allows ~1 request/second: wait and retry
    if (/limit/i.test(j.msg || '') && attempt < 2) {
      await sleep(1300);
      continue;
    }
    const err = new Error(j.msg || 'not found');
    err.userFacing = true;
    throw err;
  }
}

// ---------------------------------------------------------------
// POST /api/download  -> video / slideshow info
// ---------------------------------------------------------------
app.post('/api/download', rateLimit, async (req, res) => {
  try {
    const raw = req.body && req.body.url;
    if (!raw || typeof raw !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a TikTok URL.' });
    }

    let host;
    try {
      host = new URL(raw).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid link.' });
    }
    if (!(host === 'tiktok.com' || host.endsWith('.tiktok.com'))) {
      return res.status(400).json({ success: false, error: 'Only TikTok links are supported.' });
    }

    const d = await fetchTikwm(raw);

    const images = Array.isArray(d.images) ? d.images.map(cleanRemoteUrl).filter(Boolean) : [];

    return res.json({
      success: true,
      type: images.length ? 'slideshow' : 'video',
      title: d.title || '',
      author: (d.author && (d.author.nickname || d.author.unique_id)) || 'TikTok User',
      cover: cleanRemoteUrl(d.cover || d.origin_cover),
      noWatermarkUrl: cleanRemoteUrl(d.hdplay || d.play),
      hdUrl: cleanRemoteUrl(d.hdplay),
      watermarkUrl: cleanRemoteUrl(d.wmplay),
      musicUrl: cleanRemoteUrl(d.music || (d.music_info && d.music_info.play)),
      images,
    });
  } catch (err) {
    console.error('Download error:', err.message);
    if (err.userFacing) {
      return res.status(400).json({
        success: false,
        error: 'Video not found. Make sure the video is public and the link is complete.',
      });
    }
    return res.status(500).json({ success: false, error: 'Server error. Please try again later.' });
  }
});

// ---------------------------------------------------------------
// GET /api/proxy-download?url=&filename=&type=video|audio|image
// Forces a real file download (browser "download" attr doesn't work cross-origin)
// ---------------------------------------------------------------
const TYPES = {
  video: ['video/mp4', 'mp4'],
  audio: ['audio/mpeg', 'mp3'],
  image: ['image/jpeg', 'jpg'],
};

app.get('/api/proxy-download', async (req, res) => {
  try {
    const { url, filename, type } = req.query;
    if (!url) return res.status(400).send('Missing url');
    const [mime, ext] = TYPES[type] || TYPES.video;

    const r = await safeFetch(String(url));
    if (!r.ok || !r.body) return res.status(502).send('Source unavailable');

    res.setHeader('Content-Type', r.headers.get('content-type') || mime);
    res.setHeader('Content-Disposition', attachmentHeader(safeBaseName(filename), ext));
    const len = r.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);
    res.setHeader('Cache-Control', 'no-store');

    const stream = Readable.fromWeb(r.body);
    stream.on('error', () => res.destroy());
    req.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch (err) {
    console.error('proxy-download error:', err.message);
    if (!res.headersSent) res.status(502).send('Download failed');
  }
});

// ---------------------------------------------------------------
// GET /api/proxy-image?url=   (thumbnail)
// ---------------------------------------------------------------
app.get('/api/proxy-image', async (req, res) => {
  try {
    if (!req.query.url) return res.status(400).send('Missing url');
    const r = await safeFetch(String(req.query.url));
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !r.body || !ct.startsWith('image/')) return res.status(502).send('Image unavailable');

    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const stream = Readable.fromWeb(r.body);
    stream.on('error', () => res.destroy());
    req.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch (err) {
    console.error('proxy-image error:', err.message);
    if (!res.headersSent) res.status(502).send('Image failed');
  }
});

// ---------------------------------------------------------------
// POST /api/download-zip  { images: [...], title }
// ---------------------------------------------------------------
app.post('/api/download-zip', rateLimit, async (req, res) => {
  try {
    const { images, title } = req.body || {};
    if (!Array.isArray(images) || !images.length || images.length > 40) {
      return res.status(400).json({ success: false, error: 'Invalid image list.' });
    }
    const base = safeBaseName(title);

    const files = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const r = await safeFetch(String(images[i]));
        if (!r.ok) continue;
        files.push({ name: `${base}-${i + 1}.jpg`, data: Buffer.from(await r.arrayBuffer()) });
      } catch {
        // skip a broken image, keep the rest
      }
    }
    if (!files.length) return res.status(502).json({ success: false, error: 'Could not fetch images.' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', attachmentHeader(base, 'zip'));

    const archive = archiver('zip', { store: true });
    archive.on('error', () => res.destroy());
    archive.pipe(res);
    files.forEach((f) => archive.append(f.data, { name: f.name }));
    await archive.finalize();
  } catch (err) {
    console.error('zip error:', err.message);
    if (!res.headersSent) res.status(500).json({ success: false, error: 'ZIP failed.' });
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Dynamic Multilingual Route Handler
const supportedLangs = ['en', 'es', 'fr', 'ms', 'pt', 'tr', 'vi', 'th', 'hi', 'ar'];
app.get('/:lang(' + supportedLangs.join('|') + ')/?', (req, res) => {
    const lang = req.params.lang;
    const filePath = path.join(__dirname, 'public', lang, 'index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});