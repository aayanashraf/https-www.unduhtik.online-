// UnduhTik - Backend Server
// Node.js (v18+) + Express

const express = require("express");
const path = require("path");
const { Readable } = require("stream");
const archiver = require("archiver");
const app = express();

const PORT = process.env.PORT || 3000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

app.disable("x-powered-by");
app.use(express.json({ limit: "200kb" }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

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

// ---------- Helpers ----------
function isValidTikTokUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "tiktok.com" || host.endsWith(".tiktok.com");
  } catch {
    return false;
  }
}

// FIX: tikwm kabhi path deta hai ("/video/media/play/x.mp4"), kabhi poora URL ("https://v16m...").
// Pehle hamesha "https://www.tikwm.com" lagaya jata tha, jis se URL toot jata tha.
function absUrl(u) {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return "https:" + u;
  return "https://www.tikwm.com" + (u.startsWith("/") ? "" : "/") + u;
}

// Purane toote hue URL ("https://www.tikwm.comhttps://...") ko bhi theek kar deta hai
function cleanUrl(u) {
  return String(u || "").replace(/^https?:\/\/[^\/?#]*?(?=https?:\/\/)/i, "");
}

// Sirf in domains se download allow hai (proxy aur ZIP dono ke liye)
const ALLOWED_HOST_SUFFIXES = [
  "tikwm.com",
  "tiktok.com",
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokcdn-eu.com",
  "tiktokv.com",
  "tiktokv.us",
  "ibytedtos.com",
  "byteoversea.com",
  "muscdn.com",
];

function isAllowedHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some((s) => h === s || h.endsWith("." + s));
}

function isAllowedUrl(u) {
  try {
    const p = new URL(u);
    return (p.protocol === "https:" || p.protocol === "http:") && isAllowedHost(p.hostname);
  } catch {
    return false;
  }
}

function refererFor(u) {
  try {
    return new URL(u).hostname.endsWith("tikwm.com")
      ? "https://www.tikwm.com/"
      : "https://www.tiktok.com/";
  } catch {
    return "https://www.tiktok.com/";
  }
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
      "User-Agent": UA,
    },
    body: body.toString(),
    signal: AbortSignal.timeout(20000),
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
    cover: absUrl(video.cover),
    author: video.author?.nickname || "Unknown",
    duration: video.duration,
    noWatermarkUrl: absUrl(video.play),
    watermarkUrl: absUrl(video.wmplay),
    hdUrl: absUrl(video.hdplay),
    musicUrl: absUrl(video.music),
    images: isSlideshow ? video.images.map(absUrl) : [],
  };

  saveToCache(url, result);
  return result;
}

app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body || {};

    if (!url || !String(url).trim()) {
      return res.status(400).json({ error: "Silakan masukkan link TikTok." });
    }
    if (!isValidTikTokUrl(String(url).trim())) {
      return res.status(400).json({ error: "Ini bukan link TikTok yang valid." });
    }

    const result = await fetchTikTokVideo(String(url).trim());

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
app.get("/api/proxy-download", async (req, res) => {
  try {
    const { filename, type } = req.query;
    const target = cleanUrl(req.query.url);

    if (!target) return res.status(400).type("text/plain").send("Missing url");

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      return res.status(400).type("text/plain").send("Invalid url");
    }

    if (!isAllowedUrl(target)) {
      console.warn("[proxy-download] Host not allowed:", parsed.hostname);
      return res.status(403).type("text/plain").send("Host not allowed: " + parsed.hostname);
    }

    const upstream = await fetch(target, {
      headers: { "User-Agent": UA, Referer: refererFor(target), Accept: "*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(60000),
    });

    if (!upstream.ok || !upstream.body) {
      console.warn("[proxy-download] Upstream status:", upstream.status, "| host:", parsed.hostname);
      return res.status(502).type("text/plain").send("Upstream fetch failed (" + upstream.status + ")");
    }

    // Redirect ke host allow-list ke bahar na ja sake
    if (upstream.url && !isAllowedUrl(upstream.url)) {
      return res.status(403).type("text/plain").send("Redirect not allowed");
    }

    // Agar upstream ne HTML/JSON error page diya to usay file ki tarah na bhejein
    const upstreamType = upstream.headers.get("content-type") || "";
    if (/text\/html|application\/json/i.test(upstreamType)) {
      console.warn("[proxy-download] Non-media response:", upstreamType, "| host:", parsed.hostname);
      return res.status(502).type("text/plain").send("Upstream returned a non-media response");
    }

    const contentTypes = { video: "video/mp4", audio: "audio/mpeg", image: "image/jpeg" };
    const extensions = { video: "mp4", audio: "mp3", image: "jpg" };

    const safeType = contentTypes[type] ? type : "video";
    const safeName =
      String(filename || "unduhtik-file").replace(/[^\w\-]+/g, "_").slice(0, 60) || "unduhtik-file";

    res.setHeader("Content-Type", contentTypes[safeType]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}.${extensions[safeType]}"`
    );
    res.setHeader("Cache-Control", "no-store");

    const len = upstream.headers.get("content-length");
    if (len && !upstream.headers.get("content-encoding")) {
      res.setHeader("Content-Length", len);
    }

    // fetch() ka body web-stream hota hai, is liye Node stream mein badalna zaroori hai
    const stream =
      typeof upstream.body.pipe === "function" ? upstream.body : Readable.fromWeb(upstream.body);

    stream.on("error", (err) => {
      console.error("[proxy-download] stream error:", err.message);
      res.destroy(err);
    });
    res.on("close", () => {
      if (typeof stream.destroy === "function") stream.destroy();
    });

    stream.pipe(res);
  } catch (err) {
    console.error("[proxy-download] error:", err);
    if (!res.headersSent) res.status(500).type("text/plain").send("Proxy error");
    else res.end();
  }
});

// ---------- ZIP download (slideshow) ----------
app.post("/api/download-zip", async (req, res) => {
  try {
    const { images, title } = req.body || {};

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "Tidak ada gambar untuk diunduh." });
    }

    const list = images.slice(0, 60).map(cleanUrl).filter(isAllowedUrl);
    if (list.length === 0) {
      return res.status(400).json({ error: "Tidak ada gambar yang valid." });
    }

    const safeTitle = String(title || "unduhtik-slideshow").replace(/[^\w\-]+/g, "_").slice(0, 60);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      console.error("[zip] archive error:", err);
      res.destroy(err);
    });
    archive.pipe(res);

    for (let i = 0; i < list.length; i++) {
      try {
        const imgRes = await fetch(list[i], {
          headers: { "User-Agent": UA, Referer: refererFor(list[i]) },
          signal: AbortSignal.timeout(20000),
        });
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