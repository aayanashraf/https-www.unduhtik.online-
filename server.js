// UnduhTik - Backend Server
// Node.js + Express

const express = require("express");
const path = require("path");
const archiver = require("archiver");
const app = express();

const PORT = process.env.PORT || 3000;
const CACHE_TTL_MS = 10 * 60 * 1000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- Cache ----------
const cache = new Map();

function getFromCache(url) {
  const entry = cache.get(url);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    cache.delete(url);
    return null;
  }
  return entry.data;
}

function saveToCache(url, data) {
  cache.set(url, { data, time: Date.now() });
  if (cache.size > 200) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

function isValidTikTokUrl(url) {
  return /tiktok\.com/i.test(url);
}

function friendlyError(apiMsg) {
  const msg = (apiMsg || "").toLowerCase();
  if (msg.includes("private") || msg.includes("privat")) {
    return "Video ini bersifat privat. Hanya video publik yang bisa diunduh.";
  }
  if (msg.includes("not exist") || msg.includes("not found") || msg.includes("removed")) {
    return "Video tidak ditemukan. Mungkin sudah dihapus atau tautan salah.";
  }
  if (msg.includes("region") || msg.includes("country")) {
    return "Video ini tidak tersedia di wilayah server kami.";
  }
  return "Video tidak dapat diproses. Pastikan video bersifat publik dan tautannya benar.";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callTikwm(url) {
  const body = new URLSearchParams();
  body.append("url", url);
  body.append("hd", "1");

  const response = await fetch("https://www.tikwm.com/api/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
    body: body.toString(),
  });

  const rawText = await response.text();

  try {
    return JSON.parse(rawText);
  } catch {
    console.error("[tikwm] Parse fail. Status:", response.status, "| Raw:", rawText.slice(0, 200));
    throw new Error("PARSE_FAILED");
  }
}

// Retry logic: agar pehli koshish fail ho, 2 aur try karta hai
async function callTikwmWithRetry(url, maxRetries = 2) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const data = await callTikwm(url);
      if (data.code !== 0 && attempt < maxRetries) {
        console.warn(`[tikwm] Attempt ${attempt + 1} failed (code ${data.code}), retrying...`);
        await delay(700 * (attempt + 1));
        continue;
      }
      return data;
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries) {
        console.warn(`[tikwm] Attempt ${attempt + 1} threw error, retrying...`, err.message);
        await delay(700 * (attempt + 1));
      }
    }
  }
  throw lastErr || new Error("ALL_RETRIES_FAILED");
}

async function fetchTikTokVideo(url) {
  if (!url || !isValidTikTokUrl(url)) {
    return { url, success: false, error: "Link TikTok tidak valid." };
  }

  const cached = getFromCache(url);
  if (cached) return { ...cached, cached: true };

  let data;
  try {
    data = await callTikwmWithRetry(url);
  } catch (err) {
    console.error("[tikwm] Request failed after retries:", err.message);
    return {
      url,
      success: false,
      error: "Layanan pengunduh sedang bermasalah. Coba lagi dalam beberapa menit.",
    };
  }

  console.log("[tikwm] code:", data.code, "| msg:", data.msg);

  if (data.code !== 0 || !data.data) {
    return { url, success: false, error: friendlyError(data.msg) };
  }

  const video = data.data;
  const isSlideshow = Array.isArray(video.images) && video.images.length > 0;

  const result = {
    url,
    success: true,
    type: isSlideshow ? "slideshow" : "video",
    title: video.title,
    cover: video.cover,
    author: video.author?.nickname || "Unknown",
    duration: video.duration,
    noWatermarkUrl: video.play ? `https://www.tikwm.com${video.play}` : null,
    watermarkUrl: video.wmplay ? `https://www.tikwm.com${video.wmplay}` : null,
    hdUrl: video.hdplay ? `https://www.tikwm.com${video.hdplay}` : null,
    musicUrl: video.music ? `https://www.tikwm.com${video.music}` : null,
    images: isSlideshow ? video.images : [],
  };

  saveToCache(url, result);
  return result;
}

app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({ error: "Silakan masukkan link TikTok." });
    }
    if (!isValidTikTokUrl(url)) {
      return res.status(400).json({ error: "Ini bukan link TikTok yang valid." });
    }

    const result = await fetchTikTokVideo(url.trim());

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    console.error("[/api/download] Unexpected error:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server. Coba lagi nanti." });
  }
});

// ---------- Proxy download ----------
const ALLOWED_PROXY_HOST = "tikwm.com";

app.get("/api/proxy-download", async (req, res) => {
  try {
    const { url, filename, type } = req.query;

    if (!url) return res.status(400).send("Missing url");

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).send("Invalid url");
    }

    if (!parsed.hostname.endsWith(ALLOWED_PROXY_HOST)) {
      return res.status(403).send("Host not allowed");
    }

    const upstream = await fetch(url);
    if (!upstream.ok || !upstream.body) {
      return res.status(502).send("Upstream fetch failed");
    }

    const contentTypes = {
      video: "video/mp4",
      audio: "audio/mpeg",
      image: "image/jpeg",
    };
    const extensions = {
      video: "mp4",
      audio: "mp3",
      image: "jpg",
    };

    const safeType = contentTypes[type] ? type : "video";
    const safeName = (filename || "unduhtik-file").replace(/[^\w\-]+/g, "_");

    res.setHeader("Content-Type", contentTypes[safeType]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}.${extensions[safeType]}"`
    );

    upstream.body.pipe(res);
  } catch (err) {
    console.error("[proxy-download] error:", err);
    res.status(500).send("Proxy error");
  }
});

// ---------- ZIP download (slideshow) ----------
app.post("/api/download-zip", async (req, res) => {
  try {
    const { images, title } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Tidak ada gambar untuk diunduh." });
    }

    const safeTitle = (title || "unduhtik-slideshow").replace(/[^\w\-]+/g, "_").slice(0, 60);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      console.error("[zip] archive error:", err);
      res.status(500).end();
    });
    archive.pipe(res);

    for (let i = 0; i < images.length; i++) {
      try {
        const imgRes = await fetch(images[i]);
        if (!imgRes.ok) continue;
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        archive.append(buffer, { name: `foto-${i + 1}.jpg` });
      } catch (err) {
        console.warn(`[zip] gagal ambil gambar ${i + 1}:`, err.message);
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error("[download-zip] error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Gagal membuat file ZIP." });
    }
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", cacheSize: cache.size, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
