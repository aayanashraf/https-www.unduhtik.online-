// ---------- Analytics helper ----------
// window.track didefinisikan di <head> (index.html). Aman dipanggil walau GA4 belum termuat.
function trackEvent(name, params) {
  try {
    if (typeof window.track === "function") window.track(name, params || {});
  } catch {
    // ignore
  }
}

// ---------- Language ----------
const LANG_KEY = "unduhtik_lang";
const langSwitcher = document.getElementById("langSwitcher");

const MESSAGES = {
  id: {
    processing: "Memproses...",
    download: "Unduh",
    by: "Oleh: ",
    defaultTitle: "Video TikTok",
    empty: "Silakan tempel link video TikTok terlebih dahulu.",
    notUrl: "Teks yang Anda masukkan bukan link. Salin link video dari aplikasi TikTok.",
    notTiktok: (host) => `Link dari ${host} tidak didukung. Masukkan link video TikTok (contoh: https://vt.tiktok.com/xxxx).`,
    clipboard: "Tidak bisa mengakses clipboard. Tempel link secara manual.",
    network: "Tidak bisa terhubung ke server. Periksa koneksi internet Anda lalu coba lagi.",
    generic: "Terjadi kesalahan. Coba lagi nanti.",
    linkCopied: "Link berhasil disalin!",
    copyFailed: "Gagal menyalin link.",
    downloadAllZip: "⬇️ Unduh Semua (ZIP)",
    close: "Tutup",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
  },
  en: {
    processing: "Processing...",
    download: "Download",
    by: "By: ",
    defaultTitle: "TikTok Video",
    empty: "Please paste a TikTok video link first.",
    notUrl: "What you entered is not a link. Copy the video link from the TikTok app.",
    notTiktok: (host) => `Links from ${host} are not supported. Enter a TikTok video link (e.g. https://vt.tiktok.com/xxxx).`,
    clipboard: "Can't access the clipboard. Please paste the link manually.",
    network: "Can't reach the server. Check your internet connection and try again.",
    generic: "Something went wrong. Please try again later.",
    linkCopied: "Link copied!",
    copyFailed: "Couldn't copy the link.",
    downloadAllZip: "⬇️ Download All (ZIP)",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};

function getLang() {
  try {
    return localStorage.getItem(LANG_KEY) || "id";
  } catch {
    return "id";
  }
}

function t(key, arg) {
  const msg = (MESSAGES[getLang()] || MESSAGES.id)[key];
  return typeof msg === "function" ? msg(arg) : msg;
}

function applyLanguage(lang) {
  document.querySelectorAll("[data-id][data-en]").forEach((el) => {
    if (el.classList.contains("is-loading")) return;
    el.textContent = lang === "en" ? el.dataset.en : el.dataset.id;
  });
  document.querySelectorAll("[data-id-placeholder][data-en-placeholder]").forEach((el) => {
    el.placeholder = lang === "en" ? el.dataset.enPlaceholder : el.dataset.idPlaceholder;
  });
  document.documentElement.lang = lang;
  if (langSwitcher) langSwitcher.value = lang;
  const closeWarn = document.getElementById("closeInAppWarning");
  if (closeWarn) closeWarn.setAttribute("aria-label", t("close"));
  const zip = document.getElementById("downloadZipBtn");
  if (zip && !zip.disabled) zip.textContent = t("downloadAllZip");
  syncMenuLabel();
}

if (langSwitcher) {
  langSwitcher.addEventListener("change", () => {
    const lang = langSwitcher.value;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
    applyLanguage(lang);
  });
}

// ---------- Mobile nav ----------
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mainNav = document.getElementById("mainNav");

function syncMenuLabel() {
  if (!hamburgerBtn || !mainNav) return;
  const open = mainNav.classList.contains("open");
  hamburgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
  hamburgerBtn.setAttribute("aria-label", open ? t("closeMenu") : t("openMenu"));
}

if (hamburgerBtn && mainNav) {
  hamburgerBtn.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    syncMenuLabel();
  });
}

applyLanguage(getLang());

// ---------- In-app browser warning ----------
(function checkInAppBrowser() {
  const ua = navigator.userAgent || "";
  const isInApp = /Instagram|FBAN|FBAV|TikTok|Line\//i.test(ua);
  const banner = document.getElementById("inAppWarning");
  const closeBtn = document.getElementById("closeInAppWarning");

  if (!banner) return;

  const DISMISS_KEY = "unduhtik_inapp_dismissed";
  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    // ignore
  }

  if (isInApp && !dismissed) {
    banner.classList.remove("hidden");
    trackEvent("in_app_browser_warning");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      banner.classList.add("hidden");
      try {
        sessionStorage.setItem(DISMISS_KEY, "1");
      } catch {
        // ignore
      }
    });
  }
})();

// ---------- Toast ----------
let toastTimer;

function showToast(message, type) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "alert");
    document.body.appendChild(toast);
  }

  toast.className = "toast" + (type === "success" ? " toast-success" : "");
  toast.innerHTML = "";

  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = type === "success" ? "✅" : "⚠️";

  const text = document.createElement("span");
  text.className = "toast-text";
  text.textContent = message;

  const close = document.createElement("button");
  close.className = "toast-close";
  close.type = "button";
  close.setAttribute("aria-label", t("close"));
  close.textContent = "×";
  close.addEventListener("click", hideToast);

  toast.append(icon, text, close);
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("show");
}

// ---------- Downloader ----------
const urlInput = document.getElementById("tiktokUrl");
const downloadBtn = document.getElementById("downloadBtn");
const pasteBtn = document.getElementById("pasteBtn");
const result = document.getElementById("result");
const slideshowResult = document.getElementById("slideshowResult");
const slideshowGrid = document.getElementById("slideshowGrid");
const statusEl = document.getElementById("status");

function extractUrl(text) {
  const match = text.match(/https?:\/\/[^\s]+/i);
  if (match) return match[0];
  if (/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(text)) return "https://" + text;
  return null;
}

// Perbaiki URL rusak seperti "https://www.tikwm.comhttps://v16m.tiktokcdn-us.com/..."
function cleanRemoteUrl(u) {
  if (!u) return u;
  return String(u).replace(/^https?:\/\/[^\/?#]*?(?=https?:\/\/)/i, "");
}

function buildProxyUrl(remoteUrl, filename, type) {
  if (!remoteUrl) return "#";
  remoteUrl = cleanRemoteUrl(remoteUrl);
  const params = new URLSearchParams({ url: remoteUrl, filename, type });
  return "/api/proxy-download?" + params.toString();
}

function validateInput(raw) {
  const text = raw.trim();

  if (!text) return { ok: false, reason: "empty", message: t("empty") };

  const candidate = extractUrl(text);
  if (!candidate) return { ok: false, reason: "not_url", message: t("notUrl") };

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, reason: "not_url", message: t("notUrl") };
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const isTikTok = host === "tiktok.com" || host.endsWith(".tiktok.com");

  if (!isTikTok) return { ok: false, reason: "not_tiktok", message: t("notTiktok", host) };

  return { ok: true, url: parsed.href };
}

function setLoading(isLoading) {
  downloadBtn.disabled = isLoading;
  pasteBtn.disabled = isLoading;
  downloadBtn.classList.toggle("is-loading", isLoading);
  downloadBtn.setAttribute("aria-busy", isLoading ? "true" : "false");
  if (statusEl) statusEl.textContent = isLoading ? t("processing") : "";

  if (isLoading) {
    downloadBtn.innerHTML = "";
    const spinner = document.createElement("span");
    spinner.className = "btn-spinner";
    const label = document.createElement("span");
    label.textContent = t("processing");
    downloadBtn.append(spinner, label);
  } else {
    downloadBtn.textContent = t("download");
  }
}

urlInput.addEventListener("input", () => {
  urlInput.classList.remove("input-error");
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text;
    urlInput.classList.remove("input-error");
  } catch {
    showToast(t("clipboard"));
  }
});

downloadBtn.addEventListener("click", handleDownload);
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!downloadBtn.disabled) {
      trackEvent("download_click", { method: "enter" });
      handleDownload();
    }
  }
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(t("linkCopied"), "success");
  } catch {
    showToast(t("copyFailed"));
  }
}

function renderVideo(data) {
  slideshowResult.classList.add("hidden");

  const safeTitle = (data.title || "unduhtik-video").slice(0, 40);

  const cover = document.getElementById("cover");
  cover.onerror = () => cover.removeAttribute("src");
  if (data.cover) cover.src = "/api/proxy-image?url=" + encodeURIComponent(data.cover);
  else cover.removeAttribute("src");
  document.getElementById("videoTitle").textContent = data.title || t("defaultTitle");
  document.getElementById("videoAuthor").textContent = t("by") + (data.author || "");

  const noWmBtn = document.getElementById("downloadNoWm");
  noWmBtn.href = buildProxyUrl(data.noWatermarkUrl, safeTitle, "video");

  const wmBtn = document.getElementById("downloadWm");
  if (data.watermarkUrl) {
    wmBtn.href = buildProxyUrl(data.watermarkUrl, safeTitle + "-wm", "video");
    wmBtn.classList.remove("hidden");
  } else {
    wmBtn.classList.add("hidden");
  }

  const musicBtn = document.getElementById("downloadMusic");
  if (data.musicUrl) {
    musicBtn.href = buildProxyUrl(data.musicUrl, safeTitle + "-audio", "audio");
    musicBtn.classList.remove("hidden");
  } else {
    musicBtn.classList.add("hidden");
  }

  const copyBtn = document.getElementById("copyLinkBtn");
  copyBtn.onclick = () => copyToClipboard(cleanRemoteUrl(data.noWatermarkUrl || data.hdUrl || ""));

  result.classList.remove("hidden");
}

function renderSlideshow(data) {
  result.classList.add("hidden");
  slideshowGrid.innerHTML = "";

  const safeTitle = (data.title || "unduhtik-slideshow").slice(0, 40);

  document.getElementById("slideshowTitle").textContent = data.title || t("defaultTitle");
  document.getElementById("slideshowAuthor").textContent = t("by") + (data.author || "");

  data.images.forEach((imgUrl, i) => {
    const card = document.createElement("div");
    card.className = "slide-card";

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `Slide ${i + 1}`;
    img.loading = "lazy";
    img.decoding = "async";

    const btn = document.createElement("a");
    btn.href = buildProxyUrl(imgUrl, `${safeTitle}-${i + 1}`, "image");
    btn.className = "slide-download";
    btn.setAttribute("download", "");
    btn.setAttribute("data-track", "slideshow_download_image");
    btn.setAttribute("aria-label", `Download slide ${i + 1}`);
    btn.textContent = `⬇️ ${i + 1}`;

    card.append(img, btn);
    slideshowGrid.appendChild(card);
  });

  const musicBtn = document.getElementById("downloadSlideshowMusic");
  if (data.musicUrl) {
    musicBtn.href = buildProxyUrl(data.musicUrl, safeTitle + "-audio", "audio");
    musicBtn.classList.remove("hidden");
  } else {
    musicBtn.classList.add("hidden");
  }

  let zipBtn = document.getElementById("downloadZipBtn");
  if (!zipBtn) {
    zipBtn = document.createElement("button");
    zipBtn.id = "downloadZipBtn";
    zipBtn.type = "button";
    zipBtn.className = "btn-result primary zip-btn";
    zipBtn.setAttribute("data-track", "slideshow_download_zip");
    slideshowGrid.insertAdjacentElement("afterend", zipBtn);
  }
  zipBtn.textContent = t("downloadAllZip");
  zipBtn.onclick = async () => {
    zipBtn.disabled = true;
    const originalText = zipBtn.textContent;
    zipBtn.textContent = t("processing");
    try {
      const res = await fetch("/api/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: data.images, title: safeTitle }),
      });
      if (!res.ok) throw new Error("zip failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${safeTitle}.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      trackEvent("zip_success");
    } catch {
      trackEvent("zip_error");
      showToast(t("generic"));
    } finally {
      zipBtn.disabled = false;
      zipBtn.textContent = originalText;
    }
  };

  slideshowResult.classList.remove("hidden");
}

async function handleDownload() {
  if (downloadBtn.disabled) return;

  result.classList.add("hidden");
  slideshowResult.classList.add("hidden");
  hideToast();

  const check = validateInput(urlInput.value);

  if (!check.ok) {
    urlInput.classList.add("input-error");
    showToast(check.message);
    trackEvent("download_invalid_input", { reason: check.reason });
    return;
  }

  urlInput.classList.remove("input-error");
  setLoading(true);
  trackEvent("download_request");

  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: check.url }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showToast(data.error || t("generic"));
      trackEvent("download_error", { reason: "api", status: res.status });
      return;
    }

    if (data.type === "slideshow" && data.images && data.images.length > 0) {
      renderSlideshow(data);
      trackEvent("download_success", { content_type: "slideshow" });
    } else {
      renderVideo(data);
      trackEvent("download_success", { content_type: "video" });
    }
  } catch {
    showToast(t("network"));
    trackEvent("download_error", { reason: "network" });
  } finally {
    setLoading(false);
  }
}