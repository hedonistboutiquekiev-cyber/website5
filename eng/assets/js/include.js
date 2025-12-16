// Unified include.js for AlbaSpace website (English)
//
// This script handles dynamic loading of header/footer fragments,
// highlights the current page in the navigation, optionally enables
// language switching, and injects a futuristic preloader on pages
// containing a <model-viewer> element. It consolidates logic to
// prevent duplicated event handlers and ensures consistent behavior
// across English pages.

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

  // Ensure model-viewer registers even if the primary CDN fails to load
  // (otherwise the custom element stays unknown and the model stays hidden).
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
    setTimeout(checkAndInject, 1800);
  }

  // Inject mobile navigation override to ensure burger menu functions correctly on pages
  // that define nav.main-nav with higher specificity (e.g. many /eng/ pages). This
  // rule hides nav by default on small screens and displays it only when nav-open is set.
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
          left: auto;
          width: 33vw;
          max-width: 420px;
          min-width: 220px;
          background: #020617;
          border: 1px solid rgba(15, 23, 42, 0.8);
          border-radius: 10px;
          box-shadow: 0 18px 45px rgba(56, 189, 248, 0.25);
          flex-direction: column;
          gap: 0;
          flex: none;
          justify-content: flex-start;
          margin: 0;
          padding: 8px 0;
          flex-wrap: nowrap;
          z-index: 1001;
          overflow: hidden;
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
        }
        nav.main-nav.nav-open {
          display: flex !important;
          box-shadow: 0 12px 34px rgba(56, 189, 248, 0.6),
            0 0 40px rgba(56, 189, 248, 0.18) inset;
          border-color: rgba(56, 189, 248, 0.35);
        }
        nav.main-nav a {
          padding: 12px 18px;
          font-size: 14px;
          display: block;
          border-bottom: 1px solid rgba(15, 23, 42, 0.6);
          color: var(--text-main);
        }
        nav.main-nav a:last-child {
          border-bottom: none;
        }
      }
    `;
    document.head.appendChild(navStyle);
  }
  const loadFragment = (el) => {
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
          // English pages may optionally include a language switcher
          setupLangSwitch();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  includes.forEach(loadFragment);
});

function markActiveNav() {
  const path = window.location.pathname || "/";
  const normalized = normalizePath(path);
  const navLinks = document.querySelectorAll(".main-nav a");
  let matched = false;
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    try {
      const linkUrl = new URL(href, window.location.origin);
      const linkPath = normalizePath(linkUrl.pathname);
      if (linkPath === normalized) {
        link.classList.add("active");
        matched = true;
      }
    } catch (e) {
      if (normalized.endsWith(href)) {
        link.classList.add("active");
        matched = true;
      }
    }
  });
  if (!matched) {
    navLinks.forEach((link) => {
      const text = (link.textContent || "").trim().toUpperCase();
      if (text.includes("ATLAS")) {
        link.classList.add("active");
      }
    });
  }
}

function normalizePath(path) {
  if (!path) return "/eng/index.html";
  if (path === "/eng" || path === "/eng/") return "/eng/index.html";
  if (!path.endsWith(".html") && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}

function setupLangSwitch() {
  const path = window.location.pathname || "/";
  // Determine if current page is English; for English pages, we highlight EN flag
  const isEn = path.startsWith("/eng/");
  const currentLang = isEn ? "en" : "tr";
  const container = document.querySelector(".top-lang-switch");
  if (!container) return;
  const buttons = container.querySelectorAll("[data-lang]");
  buttons.forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    if (lang === currentLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
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
  const tr = path.replace(/^\/eng/, "") || "/index.html";
  return tr;
}

/* ----------------------------------------------------------------------
   Futuristic AlbaSpace Preloader Injection (English version)

   Adds a sci‑fi loading overlay for pages with a <model-viewer> element.
   It mirrors the design used on the Mars page but uses English copy.
---------------------------------------------------------------------- */
(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const viewer = document.querySelector("model-viewer");
    if (!viewer) return;
    if (document.getElementById("loading-overlay")) return;
    if (!document.getElementById("albaspace-preloader-style")) {
      const style = document.createElement("style");
      style.id = "albaspace-preloader-style";
      style.textContent = `
        #loading-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at top, #020617 0%, #020617 45%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          color: #e5e7eb;
          opacity: 0;
          animation: overlayFadeIn 0.7s ease-out forwards;
          overflow: hidden;
        }
        #loading-overlay::before {
          content: "";
          position: absolute;
          inset: -50%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 194, 255, 0.15) 50%,
            transparent 100%
          );
          animation: scanMove 3.5s linear infinite;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .loader-card {
          position: relative;
          padding: 26px 26px 22px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.85);
          box-shadow:
            0 0 30px rgba(0, 194, 255, 0.45),
            0 0 80px rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.3);
          max-width: 320px;
          width: 90%;
          backdrop-filter: blur(10px);
          text-align: center;
        }
        .loader-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: conic-gradient(
            from 180deg,
            rgba(0, 194, 255, 0.2),
            transparent,
            rgba(56, 189, 248, 0.4),
            transparent,
            rgba(0, 194, 255, 0.2)
          );
          opacity: 0.6;
          filter: blur(10px);
          z-index: -1;
          animation: glowPulse 4s ease-in-out infinite;
        }
        .loading-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .loading-logo img {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: #020617;
          padding: 4px;
          box-shadow: 0 0 18px rgba(0, 194, 255, 0.6);
        }
        .loading-logo span {
          font-size: 15px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #e5e7eb;
          opacity: 0.9;
        }
        .loader-orb {
          position: relative;
          width: 84px;
          height: 84px;
          margin: 0 auto 16px;
        }
        .orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(148, 163, 184, 0.3);
          border-top-color: var(--accent);
          border-right-color: rgba(56, 189, 248, 0.9);
          animation: orbSpin 1.5s linear infinite;
          box-shadow:
            0 0 18px rgba(0, 194, 255, 0.7),
            0 0 32px rgba(37, 99, 235, 0.4);
        }
        .orb-core {
          position: absolute;
          inset: 18px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 189, 248, 0.95),
            rgba(8, 47, 73, 1)
          );
          box-shadow:
            0 0 24px rgba(56, 189, 248, 0.9),
            0 0 60px rgba(0, 0, 0, 1);
        }
        .loading-text {
          font-size: 15px;
          line-height: 1.4;
          margin-bottom: 14px;
          color: #e5e7eb;
          opacity: 0.92;
        }
        .loading-subtext {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 16px;
        }
        .progress-shell {
          position: relative;
          width: 100%;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: radial-gradient(circle at top, #020617, #020617);
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.5);
        }
        .progress-fill {
          width: 0%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(56, 189, 248, 1),
            rgba(59, 130, 246, 1),
            rgba(37, 99, 235, 0.8)
          );
          box-shadow:
            0 0 16px rgba(56, 189, 248, 0.9),
            0 0 30px rgba(56, 189, 248, 0.8);
          border-radius: inherit;
          transition: width 0.25s ease-out;
        }
        .progress-glow {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          pointer-events: none;
          background: radial-gradient(
            circle at center,
            rgba(56, 189, 248, 0.35),
            transparent 60%
          );
          opacity: 0.0;
          animation: progressGlow 1.8s ease-in-out infinite;
        }
        .overlay-hint {
          margin-top: 8px;
          font-size: 11px;
          color: #9ca3af;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        #loading-overlay.fade-out {
          animation: overlayFadeOut 0.5s ease-in forwards;
          pointer-events: none;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes orbSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.03); }
        }
        @keyframes scanMove {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(50%); }
        }
        @keyframes progressGlow {
          0%, 100% { opacity: 0.1; }
          50%      { opacity: 0.5; }
        }
      `;
      document.head.appendChild(style);
    }
    // Create overlay with English copy
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.innerHTML = `
      <div class="loader-card">
        <div class="loading-logo">
          <img src="/assets/images/albaspace-logo.png" alt="AlbaSpace Logo" />
          <span>ALBASPACE</span>
        </div>
        <div class="loader-orb">
          <div class="orb-ring"></div>
          <div class="orb-core"></div>
        </div>
        <p class="loading-text">Please wait, the 3D model is loading to your device…</p>
        <p class="loading-subtext">This process may take a few seconds depending on your internet speed.</p>
        <div class="progress-shell">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-glow"></div>
        </div>
        <div class="overlay-hint">Preparing AR &amp; 3D experience</div>
      </div>
    `;
    document.body.appendChild(overlay);
    // Adjust overlay position/size to match the model-viewer element
    try {
      const rect = viewer.getBoundingClientRect();
      // Position overlay absolutely over the model-viewer area
      overlay.style.position = "absolute";
      overlay.style.top = (rect.top + window.scrollY) + "px";
      overlay.style.left = (rect.left + window.scrollX) + "px";
      overlay.style.width = rect.width + "px";
      overlay.style.height = rect.height + "px";
      // Reset right/bottom to avoid full-screen sizing
      overlay.style.right = "auto";
      overlay.style.bottom = "auto";
    } catch (err) {
      console.warn("Failed to resize loading overlay:", err);
    }
    const progressFill = overlay.querySelector(".progress-fill");
    const hideOverlay = () => {
      if (overlay.classList.contains("fade-out")) return;
      overlay.classList.add("fade-out");
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 550);
    };
    viewer.addEventListener("progress", (event) => {
      const total = event.detail && typeof event.detail.totalProgress === "number"
        ? event.detail.totalProgress
        : null;
      if (total !== null) {
        const percent = Math.max(0, Math.min(100, Math.round(total * 100)));
        progressFill.style.width = percent + "%";
      }
    });
    viewer.addEventListener("load", () => {
      progressFill.style.width = "100%";
      setTimeout(hideOverlay, 250);
    });
    setTimeout(hideOverlay, 20000);
  });
})();

/* ----------------------------------------------------------------------
   Atlas Next/Previous Navigation

   On index pages for Atlas objects (e.g. /mars/, /eng/mars/), add a pair
   of arrow buttons at the bottom linking to the previous and next pages
   in the Atlas order. This runs on both English and Turkish pages; the
   only difference is the path prefix (/eng/ for English). Text inside
   the buttons remains the same across languages (arrows only).
---------------------------------------------------------------------- */
(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const slug = (function() {
      let path = window.location.pathname || "/";
      // Normalize to remove index.html
      path = path.replace(/\/index\.html$/, "/");
      // Remove language prefix
      if (path.startsWith("/eng/")) {
        path = path.substring(5); // strip '/eng/'
      }
      // Remove leading/trailing slashes
      const segments = path.split("/").filter(Boolean);
      return segments.length > 0 ? segments[0] : null;
    })();
    if (!slug) return;
    // List of Atlas pages in order (slugs). Keep in sync with atlas.html
    const pagesOrder = [
      "gokturk-1", "gokturk-2", "rasat", "imece",
      "turksat-1A", "turksat-1B", "turksat-1C", "turksat-2A",
      "turksat-3A", "turksat-3B", "turksat-4A", "turksat-5A",
      "turksat-5B", "turksat-6A", "lagari",
      "iss",
      "mercury", "venus", "earth", "mars", "jupiter",
      "saturn", "uranus", "neptune",
      "sputnik", "voyager1", "voyager2", "hubble", "jameswebb",
      "kepler", "exomars", "marsodyssey", "marsreconnaissance",
      "perseverance", "curiosity", "ingenuity", "opportunity",
      "sojourner", "spirit", "zhurong"
    ];
    const idx = pagesOrder.indexOf(slug);
    if (idx === -1) return;
    // Determine previous and next indices cyclically
    const prevSlug = pagesOrder[(idx - 1 + pagesOrder.length) % pagesOrder.length];
    const nextSlug = pagesOrder[(idx + 1) % pagesOrder.length];
    // Determine language prefix based on current path
    const isEnglish = window.location.pathname.startsWith("/eng/");
    const prefix = isEnglish ? "/eng/" : "/";
    const prevLink = prefix + prevSlug + "/";
    const nextLink = prefix + nextSlug + "/";
    // Create nav container
    const navDiv = document.createElement("div");
    navDiv.id = "atlas-page-nav";
    navDiv.style.display = "flex";
    navDiv.style.justifyContent = "space-between";
    navDiv.style.alignItems = "center";
    navDiv.style.maxWidth = "640px";
    navDiv.style.margin = "40px auto";
    navDiv.style.padding = "0 16px";
    // Create previous button
    const prevA = document.createElement("a");
    prevA.href = prevLink;
    prevA.className = "atlas-nav-button atlas-nav-prev";
    prevA.textContent = "←";
    prevA.style.textDecoration = "none";
    prevA.style.fontSize = "22px";
    prevA.style.lineHeight = "1";
    // Create next button
    const nextA = document.createElement("a");
    nextA.href = nextLink;
    nextA.className = "atlas-nav-button atlas-nav-next";
    nextA.textContent = "→";
    nextA.style.textDecoration = "none";
    nextA.style.fontSize = "22px";
    nextA.style.lineHeight = "1";
    // Styling for buttons
    [prevA, nextA].forEach((btn) => {
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.width = "48px";
      btn.style.height = "48px";
      btn.style.borderRadius = "999px";
      btn.style.background = "rgba(15, 23, 42, 0.9)";
      btn.style.border = "1px solid rgba(148, 163, 184, 0.4)";
      btn.style.color = "#e5e7eb";
      btn.style.transition = "transform 0.15s, box-shadow 0.15s";
      btn.addEventListener("mouseover", () => {
        btn.style.transform = "translateY(-2px)";
        btn.style.boxShadow = "0 4px 12px rgba(56, 189, 248, 0.3)";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.transform = "none";
        btn.style.boxShadow = "none";
      });
    });
    navDiv.appendChild(prevA);
    navDiv.appendChild(nextA);
    // Insert nav before the global footer include if possible, else append to body
    const footerInclude = document.querySelector('div[data-include$="footer-en.html"], div[data-include$="footer-tr.html"]');
    if (footerInclude && footerInclude.parentNode) {
      footerInclude.parentNode.insertBefore(navDiv, footerInclude);
    } else {
      document.body.appendChild(navDiv);
    }
  });
})();