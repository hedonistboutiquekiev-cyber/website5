// Unified include.js for AlbaSpace website (Turkish)
//
// This script dynamically loads header and footer fragments, highlights the
// current navigation item, provides a language switcher, keeps model-viewer
// available with a fallback, and enhances the footer with neatly styled address
// buttons and a call shortcut.  The enhancements added in this version
// improve the footer presentation on both desktop and mobile devices.

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

  // We need the preloader script to run even when the header is injected via
  // include.js (since scripts inside innerHTML are not executed by default).
  // After the header fragment is placed into the DOM and the preloader element
  // exists, load the script once.
  const ensurePreloaderScript = createPreloaderLoader();

  // Ensure model-viewer is registered; some CDNs may fail to load in certain regions
  // (the symptom is that <model-viewer> stays an unknown element and renders nothing).
  const maybeViewer = document.querySelector("model-viewer");
  if (maybeViewer && !window.customElements.get("model-viewer")) {
    const fallbackSrc =
      "https://unpkg.com/@google/model-viewer@3.0.0/dist/model-viewer.min.js";
    const checkAndInject = () => {
      if (window.customElements.get("model-viewer")) return;
      const existing = document.querySelector(
        `script[src=\"${fallbackSrc}\"]`
      );
      if (existing) return;
      const script = document.createElement("script");
      script.type = "module";
      script.src = fallbackSrc;
      document.head.appendChild(script);
    };
    // Give the primary CDN a brief window to register before falling back
    setTimeout(checkAndInject, 1800);
  }

  // ---------------- Mobile nav override ----------------
  if (!document.getElementById("albaspace-nav-override-style")) {
    const navStyle = document.createElement("style");
    navStyle.id = "albaspace-nav-override-style";
    navStyle.textContent = `
      @media (max-width: 768px) {
        nav.main-nav {
          display: none !important;
          position: absolute;
          top: calc(100% + 10px);
          right: 12px;
          width: 33vw;
          max-width: 420px;
          min-width: 220px;
          background: #020617;
          border: 1px solid rgba(15, 23, 42, 0.8);
          border-radius: 10px;
          box-shadow: 0 18px 45px rgba(56,189,248,.25);
          flex-direction: column;
          padding: 8px 0;
          z-index: 1001;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        nav.main-nav.nav-open { display: flex !important; }
        nav.main-nav a {
          padding: 12px 18px;
          font-size: 14px;
          border-bottom: 1px solid rgba(15,23,42,.6);
          color: var(--text-main);
          display: block;
        }
        nav.main-nav a:last-child { border-bottom: none; }
      }
    `;
    document.head.appendChild(navStyle);
  }

  // ---------------- Load includes ----------------
  includes.forEach((el) => {
    const url = el.getAttribute("data-include");
    if (!url) return;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load " + url + " (" + res.status + ")");
        return res.text();
      })
      .then((html) => {
        el.innerHTML = html;

        if (url.includes("header-")) {
          markActiveNav();
          setupLangSwitch();
          ensurePreloaderScript();
        }

        if (url.includes("footer-")) {
          enhanceFooter(el);
        }
      })
      .catch(console.error);
  });
});

function createPreloaderLoader() {
  let loaded = false;

  return function ensurePreloaderScript() {
    if (loaded) return;

    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const existing = document.querySelector("script[data-preloader-loader]");
    if (existing) {
      loaded = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "/assets/js/preloader.js";
    script.defer = true;
    script.dataset.preloaderLoader = "true";
    document.head.appendChild(script);
    loaded = true;
  };
}

// ================= NAV =================
function markActiveNav() {
  const path = normalizePath(window.location.pathname || "/");
  const navLinks = document.querySelectorAll(".main-nav a");
  let matched = false;

  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    try {
      const linkPath = normalizePath(new URL(href, window.location.origin).pathname);
      if (linkPath === path) {
        a.classList.add("active");
        matched = true;
      }
    } catch {
      if (path.endsWith(href)) {
        a.classList.add("active");
        matched = true;
      }
    }
  });

  if (!matched) {
    navLinks.forEach((a) => {
      const text = (a.textContent || "").trim().toUpperCase();
      if (text.includes("ATLAS")) a.classList.add("active");
    });
  }
}

function normalizePath(p) {
  if (!p || p === "/") return "/index.html";
  if (!p.endsWith(".html") && !p.endsWith("/")) return p + "/";
  return p;
}

// ================= LANG =================
function setupLangSwitch() {
  const path = window.location.pathname || "/";
  const isEn = path.startsWith("/eng/");
  const currentLang = isEn ? "en" : "tr";

  const container = document.querySelector(".top-lang-switch");
  if (!container) return;

  container.querySelectorAll("[data-lang]").forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    btn.classList.toggle("active", lang === currentLang);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (lang === currentLang) return;

      const targetPath = lang === "en" ? toEnPath(path) : toTrPath(path);
      window.location.href = targetPath;
    });
  });
}

function toEnPath(path) {
  path = normalizePath(path);
  if (path.startsWith("/eng/")) return path;
  if (path === "/index.html") return "/eng/index.html";
  return "/eng" + (path.startsWith("/") ? path : "/" + path);
}

function toTrPath(path) {
  path = normalizePath(path);
  if (!path.startsWith("/eng/")) return path;
  return path.replace(/^\/eng/, "") || "/index.html";
}

// ================= FOOTER ENHANCER (addresses + call square near logo) =================
function enhanceFooter(root) {
  injectFooterStyles();

  const footer = root.querySelector("footer");
  if (!footer || footer.classList.contains("alba-footer-v5")) return;
  footer.classList.add("alba-footer-v5");

  // Remove the large call square on all navigation pages except hizmetler
  const allowCallSquare = /\/hizmetler(\.html)?\/?$/i.test(
    window.location.pathname || ""
  );
  if (!allowCallSquare) {
    footer.querySelectorAll(".alba-call-square").forEach((el) => el.remove());
  }

  // Optional: style socials if present
  const socials =
    footer.querySelector(".social-icons") ||
    footer.querySelector(".footer-socials") ||
    footer.querySelector("[data-socials]");
  if (socials) socials.classList.add("alba-footer-socials");

  // IMPORTANT: we only touch the RIGHT address container (not whole footer)
  const addressContainer =
    footer.querySelector(".footer-right") ||
    footer.querySelector(".footer-address") ||
    footer.querySelector(".footer-contact") ||
    footer.querySelector("[data-footer-address]");

  if (!addressContainer) return;

  const rawAddrText = (addressContainer.innerText || "").trim();
  if (!rawAddrText) return;

  // Extract sections reliably
  const merkezBlock = extractSection(rawAddrText, /Merkez Ofis/i, /Adana Şube/i);
  const adanaBlock = extractSection(rawAddrText, /Adana Şube/i, null);

  // Find phone in addressContainer OR anywhere in footer
  const phoneRaw = findPhone(rawAddrText) || findPhone(footer.innerText || "");
  const phoneTel = phoneRaw ? phoneRaw.replace(/[^\d+]/g, "") : "";

  // Build address buttons (1) and (2)
  // Remove any existing mailto links in the footer to avoid duplication
  const mailAnchors = footer.querySelectorAll('a[href^="mailto:"]');
  mailAnchors.forEach((el) => el.remove());

  // Build contact panel with phone and email buttons, followed by address cards.
  const contactPanel = document.createElement('div');
  contactPanel.className = 'alba-footer-contact-panel';

  // Phone action button
  const phoneBtn = document.createElement('a');
  phoneBtn.className = 'alba-footer-action';
  phoneBtn.href = 'tel:+9053877818';
  phoneBtn.innerHTML = `
    <div class="action-row">
      <span class="action-icon">☎</span>
      <span class="action-text">+90 538 778 18</span>
    </div>
    <div class="action-hint alba-blink">Aramak için dokunun</div>
  `;
  contactPanel.appendChild(phoneBtn);

  // Email action button
  const emailBtn = document.createElement('a');
  emailBtn.className = 'alba-footer-action';
  emailBtn.href = 'mailto:hello@albaspace.com.tr';
  emailBtn.innerHTML = `
    <div class="action-row">
      <span class="action-icon">✉</span>
      <span class="action-text">hello@albaspace.com.tr</span>
    </div>
    <div class="action-hint alba-blink">Bize yazın</div>
  `;
  contactPanel.appendChild(emailBtn);

  // Address map buttons
  // Build two map buttons (Merkez Ofis and Adana Şube)
  const map1 = buildMapButton(merkezBlock);
  const map2 = buildMapButton(adanaBlock);
  if (map1) contactPanel.appendChild(map1);
  if (map2) contactPanel.appendChild(map2);

  // Clear existing addressContainer and insert the new contact panel
  addressContainer.innerHTML = '';
  // Center the address container and contact panel within the footer
  // This ensures the panel appears in the middle rather than aligned to the right
  addressContainer.style.display = 'flex';
  addressContainer.style.flexDirection = 'column';
  addressContainer.style.alignItems = 'center';
  addressContainer.style.justifyContent = 'center';
  addressContainer.style.width = '100%';
  addressContainer.style.margin = '0 auto';
  addressContainer.appendChild(contactPanel);
}

function buildAddressButton(blockText) {
  if (!blockText) return null;

  const lines = blockText.split("\n").map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return null;

  const title = lines[0];
  const address = lines.slice(1).join(", ").replace(/\s+/g, " ").trim();
  if (!address) return null;

  const a = document.createElement("a");
  a.className = "alba-footer-btn";
  a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
  a.target = "_blank";
  a.rel = "noopener";
  a.title = "Open in Google Maps";
  a.setAttribute("aria-label", "Open in Google Maps: " + title);

  // Add a small Turkish hint below the address prompting the user to open the map.
  // The alba-blink class animates the text to gently blink, improving visibility on both mobile and desktop.
  const mapHintTr = "Haritayı açmak için dokunun";
  a.innerHTML = `
    <div class="btn-title">${escapeHtml(title)}</div>
    <div class="btn-text">${escapeHtml(address)}</div>
    <div class="btn-tip alba-blink">${mapHintTr}</div>
  `;

  return a;
}

// Build a map button styled like other contact actions. Each map button contains
// an icon, the office name (title), the full address, and a blinking hint in Turkish.
function buildMapButton(blockText) {
  if (!blockText) return null;
  const lines = blockText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!lines.length) return null;
  const title = lines[0];
  // Remove any phone numbers from the rest of the lines
  const addressLines = lines.slice(1).filter((l) => !/(\+?\s*\d[\d\s()\-]{7,}\d)/.test(l));
  const address = addressLines.join(', ').replace(/\s+/g, ' ').trim();
  if (!address) return null;
  const a = document.createElement('a');
  a.className = 'alba-footer-action';
  a.href =
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
  a.target = '_blank';
  a.rel = 'noopener';
  const hintTr = 'Haritayı açmak için dokunun';
  a.innerHTML = `
    <div class="action-row">
      <span class="action-icon">📍</span>
      <span class="action-text">${escapeHtml(title)}</span>
    </div>
    <div class="map-address">${escapeHtml(address)}</div>
    <div class="action-hint alba-blink">${hintTr}</div>
  `;
  return a;
}

// Takes section from startRegex to beforeRegex (optional)
function extractSection(text, startRegex, beforeRegex) {
  if (!text) return "";
  const start = text.search(startRegex);
  if (start === -1) return "";

  const sliced = text.slice(start);
  if (!beforeRegex) return sliced.trim();

  const end = sliced.search(beforeRegex);
  if (end === -1) return sliced.trim();

  return sliced.slice(0, end).trim();
}

function findPhone(text) {
  if (!text) return "";
  const m = text.match(/(\+?\s*\d[\d\s()-]{7,}\d)/);
  return m ? m[1].trim() : "";
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Builds a rectangular address card from the provided text block. Each card displays
// the title (first line) and the rest of the address inside a stylised box.
function buildAddressCard(blockText) {
  if (!blockText) return null;
  const lines = blockText.split("\n").map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return null;
  const title = lines[0];
  const address = lines.slice(1).join(", ").replace(/\s+/g, " ").trim();
  if (!address) return null;
  const card = document.createElement('div');
  card.className = 'alba-footer-card';
  card.innerHTML = `
    <div class="card-title">${escapeHtml(title)}</div>
    <div class="card-body">${escapeHtml(address)}</div>
  `;
  return card;
}

// ================= FOOTER STYLES =================
function injectFooterStyles() {
  if (document.getElementById("alba-footer-style-v5")) return;

  const s = document.createElement("style");
  s.id = "alba-footer-style-v5";
  s.textContent = `
    /* Right block: two address buttons */
    .alba-footer-address-panel {
      max-width: 520px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-left: auto;
      align-items: stretch;
    }

    .alba-footer-btn {
      position: relative;
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(15,23,42,.55);
      border: 1px solid rgba(148,163,184,.28);
      text-decoration: none;
      text-align: center;
      transition: transform .2s ease, box-shadow .25s ease, border-color .25s ease;
      box-shadow: 0 14px 38px rgba(0,0,0,.35);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      display: block;
    }

    .alba-footer-btn:hover {
      transform: translateY(-2px);
      border-color: rgba(56,189,248,.7);
      box-shadow: 0 18px 52px rgba(56,189,248,.12), 0 14px 38px rgba(0,0,0,.45);
    }

    .btn-title {
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 6px;
      letter-spacing: .04em;
      font-size: 14px;
    }

    .btn-text {
      color: #cbd5f5;
      font-size: 13px;
      line-height: 1.45;
      opacity: .95;
    }

    /* Tooltip bubble via title attr */
    .alba-footer-btn::after {
      content: attr(title);
      position: absolute;
      left: 50%;
      bottom: calc(100% + 10px);
      transform: translateX(-50%);
      background: rgba(2, 6, 23, 0.95);
      border: 1px solid rgba(148, 163, 184, 0.28);
      color: #e5e7eb;
      padding: 8px 10px;
      border-radius: 10px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity .18s ease, transform .18s ease;
      box-shadow: 0 14px 38px rgba(0,0,0,.45);
    }

    .alba-footer-btn:hover::after {
      opacity: 1;
      transform: translateX(-50%) translateY(-2px);
    }

    /* Square CALL button (next to logo) */
    .alba-call-square {
      width: 74px;
      height: 74px;
      border-radius: 16px;
      background: rgba(15,23,42,.55);
      border: 1px solid rgba(148,163,184,.28);
      box-shadow: 0 14px 38px rgba(0,0,0,.35);
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      margin-left: 12px;
      vertical-align: middle;
      transition: transform .2s ease, box-shadow .25s ease, border-color .25s ease;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }

    .alba-call-square:hover {
      transform: translateY(-2px);
      border-color: rgba(167,243,208,.75);
      box-shadow: 0 18px 52px rgba(167,243,208,.10), 0 14px 38px rgba(0,0,0,.45);
    }

    .alba-call-square__label {
      font-weight: 900;
      color: #a7f3d0;
      font-size: 14px;
      letter-spacing: .04em;
      line-height: 1;
      margin-bottom: 6px;
    }

    .alba-call-square__sub {
      font-size: 11px;
      color: #cbd5f5;
      opacity: .75;
      line-height: 1;
    }

    /* Optional socials: stack icons vertically under tagline */
    .alba-footer-socials {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      margin-top: 12px;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .alba-footer-address-panel {
        margin: 12px auto 0;
        max-width: 520px;
      }
    }

    /* Contact panel and action buttons */
    .alba-footer-contact-panel {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
    }
    .alba-footer-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px 20px;
      border-radius: 16px;
      background: rgba(15,23,42,.55);
      border: 1px solid rgba(148,163,184,.28);
      box-shadow: 0 14px 38px rgba(0,0,0,.35);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      text-decoration: none;
      width: 220px;
      transition: transform .2s ease, box-shadow .25s ease, border-color .25s ease;
    }
    .alba-footer-action:hover {
      transform: translateY(-2px);
      border-color: rgba(56,189,248,.7);
      box-shadow: 0 18px 52px rgba(56,189,248,.12), 0 14px 38px rgba(0,0,0,.45);
    }
    .alba-footer-action .action-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .alba-footer-action .action-icon {
      font-size: 18px;
      color: #38bdf8;
    }
    .alba-footer-action .action-text {
      font-weight: 900;
      color: #a7f3d0;
      font-size: 14px;
      letter-spacing: .04em;
    }
    .alba-footer-action .action-hint {
      font-size: 11px;
      color: #cbd5f5;
      opacity: .75;
      line-height: 1;
    }

    /* Additional styling for map address lines */
    .alba-footer-action .map-address {
      color: #cbd5f5;
      font-size: 12px;
      line-height: 1.4;
      opacity: 0.9;
      text-align: center;
      margin-bottom: 6px;
    }

    /* Address cards */
    .alba-footer-card {
      width: 100%;
      max-width: 520px;
      background: rgba(15,23,42,.55);
      border: 1px solid rgba(148,163,184,.28);
      border-radius: 16px;
      box-shadow: 0 14px 38px rgba(0,0,0,.35);
      padding: 14px 16px;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
    .alba-footer-card .card-title {
      font-weight: 800;
      color: #38bdf8;
      font-size: 14px;
      margin-bottom: 6px;
      letter-spacing: .04em;
    }
    .alba-footer-card .card-body {
      color: #cbd5f5;
      font-size: 13px;
      line-height: 1.45;
      opacity: .95;
    }

    /* Added subtle blinking animation used for call and map hints */
    .btn-tip {
      font-size: 11px;
      color: #94a3b8;
      opacity: 0.8;
      margin-top: 4px;
    }
    .alba-blink {
      animation: alba-blink 1.5s ease-in-out infinite;
    }
    @keyframes alba-blink {
      0%, 100% { opacity: 0.8; }
      50%      { opacity: 0.3; }
    }
  `;
  document.head.appendChild(s);
}

/* ----------------------------------------------------------------------
   Atlas Next/Previous Navigation
---------------------------------------------------------------------- */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const slug = (() => {
      let path = window.location.pathname || "/";
      path = path.replace(/\/index\.html$/, "/");
      if (path.startsWith("/eng/")) path = path.substring(5);
      const segments = path.split("/").filter(Boolean);
      return segments.length > 0 ? segments[0] : null;
    })();
    if (!slug) return;

    const pagesOrder = [
      "gokturk-1","gokturk-2","rasat","imece",
      "turksat-1A","turksat-1B","turksat-1C","turksat-2A",
      "turksat-3A","turksat-3B","turksat-4A","turksat-5A",
      "turksat-5B","turksat-6A","lagari",
      "iss",
      "mercury","venus","earth","mars","jupiter",
      "saturn","uranus","neptune",
      "sputnik","voyager1","voyager2","hubble","jameswebb",
      "kepler","exomars","marsodyssey","marsreconnaissance",
      "perseverance","curiosity","ingenuity","opportunity",
      "sojourner","spirit","zhurong"
    ];

    const idx = pagesOrder.indexOf(slug);
    if (idx === -1) return;

    const prevSlug = pagesOrder[(idx - 1 + pagesOrder.length) % pagesOrder.length];
    const nextSlug = pagesOrder[(idx + 1) % pagesOrder.length];

    const isEnglish = window.location.pathname.startsWith("/eng/");
    const prefix = isEnglish ? "/eng/" : "/";
    const prevLink = prefix + prevSlug + "/";
    const nextLink = prefix + nextSlug + "/";

    const navDiv = document.createElement("div");
    navDiv.id = "atlas-page-nav";
    navDiv.style.display = "flex";
    navDiv.style.justifyContent = "space-between";
    navDiv.style.alignItems = "center";
    navDiv.style.maxWidth = "640px";
    navDiv.style.margin = "40px auto";
    navDiv.style.padding = "0 16px";

    const prevA = document.createElement("a");
    prevA.href = prevLink;
    prevA.textContent = "←";
    prevA.style.cssText = baseAtlasBtnCss();

    const nextA = document.createElement("a");
    nextA.href = nextLink;
    nextA.textContent = "→";
    nextA.style.cssText = baseAtlasBtnCss();

    navDiv.appendChild(prevA);
    navDiv.appendChild(nextA);

    const footerInclude = document.querySelector(
      'div[data-include$="footer-en.html"], div[data-include$="footer-tr.html"]'
    );
    if (footerInclude?.parentNode) footerInclude.parentNode.insertBefore(navDiv, footerInclude);
    else document.body.appendChild(navDiv);

    function baseAtlasBtnCss() {
      return `
        text-decoration:none;
        display:flex;
        align-items:center;
        justify-content:center;
        width:48px;
        height:48px;
        border-radius:999px;
        background:rgba(15,23,42,.9);
        border:1px solid rgba(148,163,184,.4);
        color:#e5e7eb;
        font-size:22px;
        transition:transform .15s, box-shadow .15s;
      `;
    }
  });
})();