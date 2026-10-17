/* UnduhTik language switcher
   One master list + one look for every page. It replaces the old
   <select id="langSwitcher"> (and any per-page copy of it) when the page loads.
   To add a language later, add ONE line to LANGS below. */
(function () {
  "use strict";

  var LANGS = [
    { c: "id", u: "/",    n: "Bahasa Indonesia" },
    { c: "en", u: "/en/", n: "English" },
    { c: "ms", u: "/ms/", n: "Bahasa Melayu" },
    { c: "vi", u: "/vi/", n: "Tiếng Việt" },
    { c: "es", u: "/es/", n: "Español" },
    { c: "pt", u: "/pt/", n: "Português" },
    { c: "tr", u: "/tr/", n: "Türkçe" },
    { c: "fr", u: "/fr/", n: "Français" },
    { c: "th", u: "/th/", n: "ไทย" },
    { c: "hi", u: "/hi/", n: "हिन्दी" },
    { c: "ar", u: "/ar/", n: "العربية" }
  ];

  if (document.querySelector(".ut-lang")) return; // already built

  var pageLang = ((document.documentElement.getAttribute("lang") || "id") + "").slice(0, 2).toLowerCase();
  var cur = LANGS[0];
  LANGS.forEach(function (l) { if (l.c === pageLang) cur = l; });

  /* ---------- styles (uses the site's theme variables, so light/dark just work) ---------- */
  var css = [
    ".ut-lang{position:relative;display:inline-block;flex:0 0 auto}",
    ".ut-lang-btn{display:inline-flex;align-items:center;gap:6px;height:44px;min-height:44px;padding:0 12px!important;",
    "border:1px solid var(--line-strong,#aec6e0);border-radius:8px;background:var(--surface,#f3f8fe);color:var(--text,#0f172a);",
    "font-family:inherit;font-size:14px!important;font-weight:600;line-height:1;cursor:pointer;white-space:nowrap;",
    "transition:background .2s,border-color .2s}",
    ".ut-lang-btn:hover,.ut-lang-btn[aria-expanded=true]{background:var(--surface-2,#e6eff9);border-color:var(--accent,#0b6580)}",
    ".ut-lang-btn svg{width:16px;height:16px;flex:none}",
    ".ut-lang-caret{transition:transform .2s}",
    ".ut-lang-btn[aria-expanded=true] .ut-lang-caret{transform:rotate(180deg)}",
    ".ut-lang-code{display:none;letter-spacing:.03em}",
    ".ut-lang-menu{position:absolute;top:calc(100% + 6px);inset-inline-end:0;z-index:300;margin:0;padding:6px;list-style:none;",
    "min-width:220px;max-width:calc(100vw - 24px);max-height:min(70vh,460px);overflow-y:auto;",
    "background:var(--surface,#f3f8fe);border:1px solid var(--line-strong,#aec6e0);border-radius:12px;",
    "box-shadow:var(--shadow,0 12px 36px rgba(15,23,42,.2))}",
    ".ut-lang-menu[hidden]{display:none!important}",
    ".ut-lang-menu li{margin:0;padding:0}",
    ".ut-lang-menu a{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:44px;padding:0 12px;",
    "border-radius:8px;color:var(--text,#0f172a);text-decoration:none;font-size:15px;font-weight:500}",
    ".ut-lang-menu a:hover,.ut-lang-menu a:focus-visible{background:var(--surface-2,#e6eff9);color:var(--accent-dark,#0a4f66)}",
    ".ut-lang-menu a[aria-current=true]{color:var(--accent,#0b6580);font-weight:700}",
    ".ut-lang-menu .ut-lang-c{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--text-soft,#53647d)}",
    ".ut-lang-menu a[aria-current=true] .ut-lang-c{color:var(--accent,#0b6580)}",
    "@media (max-width:720px){",
    ".ut-lang-btn{padding:0 10px!important;gap:4px;font-size:13px!important}",
    ".ut-lang-name,.ut-lang-globe{display:none}",
    ".ut-lang-code{display:inline}",
    /* on phones the list is a full-width sheet under the header: never goes off-screen, big tap targets */
    ".ut-lang-menu{position:fixed;left:12px;right:12px;min-width:0;max-width:none;width:auto;max-height:calc(100vh - 96px)}",
    "}"
  ].join("");
  var st = document.createElement("style");
  st.id = "ut-lang-css";
  st.appendChild(document.createTextNode(css));
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  function svg(path, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + path + "</svg>";
  }
  var globe = svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', "ut-lang-globe");
  var caret = svg('<path d="m6 9 6 6 6-6"/>', "ut-lang-caret");

  var root = document.createElement("div");
  root.className = "ut-lang";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ut-lang-btn";
  btn.setAttribute("aria-haspopup", "true");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "utLangMenu");
  btn.setAttribute("aria-label", "Language: " + cur.n);
  btn.setAttribute("data-track", "language_menu_open");
  btn.innerHTML = globe + '<span class="ut-lang-name"></span><span class="ut-lang-code"></span>' + caret;
  btn.querySelector(".ut-lang-name").textContent = cur.n;
  btn.querySelector(".ut-lang-code").textContent = cur.c.toUpperCase();
  root.appendChild(btn);

  var menu = document.createElement("ul");
  menu.id = "utLangMenu";
  menu.className = "ut-lang-menu";
  menu.hidden = true;
  LANGS.forEach(function (l) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = l.u;
    a.setAttribute("lang", l.c);
    a.setAttribute("hreflang", l.c);
    if (l.c === cur.c) a.setAttribute("aria-current", "true");
    var n = document.createElement("span");
    n.className = "ut-lang-n";
    n.setAttribute("dir", "auto");
    n.textContent = l.n;
    var c = document.createElement("span");
    c.className = "ut-lang-c";
    c.textContent = l.c.toUpperCase();
    a.appendChild(n);
    a.appendChild(c);
    a.addEventListener("click", function () {
      try { if (typeof window.track === "function") window.track("language_change", { language: l.c }); } catch (e) {}
    });
    li.appendChild(a);
    menu.appendChild(li);
  });
  root.appendChild(menu);

  /* ---------- put it where the old dropdown was ---------- */
  var old = document.getElementById("langSwitcher");
  if (old && old.parentNode) {
    old.parentNode.replaceChild(root, old);
  } else {
    var hr = document.querySelector(".header-right");
    if (!hr) return;
    hr.insertBefore(root, hr.firstChild);
  }
  root.id = "utLang";

  /* ---------- behaviour ---------- */
  function isOpen() { return !menu.hidden; }
  function open() {
    var phone = window.matchMedia && window.matchMedia("(max-width:720px)").matches;
    menu.style.top = phone ? Math.round(btn.getBoundingClientRect().bottom + 6) + "px" : "";
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
  function close(refocus) {
    if (!isOpen()) return;
    menu.hidden = true;
    menu.style.top = "";
    btn.setAttribute("aria-expanded", "false");
    if (refocus) btn.focus();
  }
  function items() { return Array.prototype.slice.call(menu.querySelectorAll("a")); }
  function focusItem(i) {
    var list = items();
    if (!list.length) return;
    list[(i + list.length) % list.length].focus();
  }

  btn.addEventListener("click", function () { if (isOpen()) close(false); else open(); });

  btn.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      open();
      var idx = items().map(function (a) { return a.getAttribute("aria-current") === "true"; }).indexOf(true);
      focusItem(idx < 0 ? 0 : idx);
    }
  });

  menu.addEventListener("keydown", function (e) {
    var list = items();
    var i = list.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); focusItem(i + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusItem(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); focusItem(0); }
    else if (e.key === "End") { e.preventDefault(); focusItem(list.length - 1); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) { e.preventDefault(); close(true); }
  });
  document.addEventListener("click", function (e) { if (isOpen() && !root.contains(e.target)) close(false); });
  document.addEventListener("focusin", function (e) { if (isOpen() && !root.contains(e.target)) close(false); });

  // closing the page-menu (hamburger) or scrolling a lot should not leave the list hanging open
  window.addEventListener("resize", function () { close(false); });
})();
