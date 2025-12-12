document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

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

        // Когда подгружается хедер – после вставки вызываем и навигацию, и языки
        if (url.includes("header-")) {
          markActiveNav();
          setupLangSwitch();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  includes.forEach(loadFragment);
});

/* --------- Подсветка активного пункта меню ---------- */

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
      // относительный путь
      if (normalized.endsWith(href)) {
        link.classList.add("active");
        matched = true;
      }
    }
  });

  // Если не нашли совпадения – считаем, что это страница ATLAS (3D и т.п.)
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
  if (!path) return "/index.html";
  // В Codespaces обычно путь типа / или /mars/
  if (path === "/") return "/index.html";
  if (!path.endsWith(".html") && !path.endsWith("/")) {
    // если что-то вроде /mars – добавим /
    return path + "/";
  }
  return path;
}

/* --------- Переключатель языков TR <-> EN ---------- */

function setupLangSwitch() {
  const path = window.location.pathname || "/";
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

  // Специально для корня
  if (path === "/index.html") {
    return "/eng/index.html";
  }

  // Для остальных страниц: /atlas.html -> /eng/atlas.html, /mars/ -> /eng/mars/
  return "/eng" + (path.startsWith("/") ? path : "/" + path);
}

function toTrPath(path) {
  path = normalizePath(path);
  if (!path.startsWith("/eng/")) return path;

  // /eng/index.html -> /index.html
  const tr = path.replace(/^\/eng/, "") || "/index.html";
  return tr;
}




// This file is a modified version of the original include.js from the
// `hedonistboutiquekiev-cyber/website5` repository. It preserves the
// existing functionality for dynamic fragment inclusion, navigation
// highlighting, and language switching, and additionally injects a
// futuristic preloader on pages that contain a <model-viewer> element.

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

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

        // Когда подгружается хедер – после вставки вызываем и навигацию, и языки
        if (url.includes("header-")) {
          markActiveNav();
          setupLangSwitch();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  includes.forEach(loadFragment);
});

/* --------- Подсветка активного пункта меню ---------- */

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
      // относительный путь
      if (normalized.endsWith(href)) {
        link.classList.add("active");
        matched = true;
      }
    }
  });

  // Если не нашли совпадения – считаем, что это страница ATLAS (3D и т.п.)
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
  if (!path) return "/index.html";
  // В Codespaces обычно путь типа / или /mars/
  if (path === "/") return "/index.html";
  if (!path.endsWith(".html") && !path.endsWith("/")) {
    // если что-то вроде /mars – добавим /
    return path + "/";
  }
  return path;
}

/* --------- Переключатель языков TR <-> EN ---------- */

function setupLangSwitch() {
  const path = window.location.pathname || "/";
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

  // Специально для корня
  if (path === "/index.html") {
    return "/eng/index.html";
  }

  // Для остальных страниц: /atlas.html -> /eng/atlas.html, /mars/ -> /eng/mars/
  return "/eng" + (path.startsWith("/") ? path : "/" + path);
}

function toTrPath(path) {
  path = normalizePath(path);
  if (!path.startsWith("/eng/")) return path;

  // /eng/index.html -> /index.html
  const tr = path.replace(/^\/eng/, "") || "/index.html";
  return tr;
}

/* ----------------------------------------------------------------------
   Futuristic AlbaSpace Preloader Injection

   Pages using <model-viewer> can take a noticeable amount of time to
   download and initialize 3D models. To improve user experience, we
   automatically inject a futuristic loading overlay similar to the one
   used on the Mars page. This code runs after DOMContentLoaded and
   attaches itself only if a model-viewer exists on the page and no
   preloader has been defined manually.
---------------------------------------------------------------------- */
(function() {
  document.addEventListener("DOMContentLoaded", () => {
    // Only execute on pages with a model-viewer element
    const viewer = document.querySelector("model-viewer");
    if (!viewer) return;

    // Skip if the page already provides its own loading overlay
    if (document.getElementById("loading-overlay")) return;

    // Inject CSS styles once per page
    if (!document.getElementById("albaspace-preloader-style")) {
      const style = document.createElement("style");
      style.id = "albaspace-preloader-style";
      style.textContent = `
        /* ===========================
           FUTURISTIC ALBASPACE PRELOADER
           Injected by include.js
           =========================== */
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
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes overlayFadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-4px);
          }
        }
        @keyframes orbSpin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.03);
          }
        }
        @keyframes scanMove {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(50%); }
        }
        @keyframes progressGlow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `;
      document.head.appendChild(style);
    }

    // Build the overlay structure
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
        <p class="loading-text">Lütfen bekleyin, 3D model telefonunuza yükleniyor…</p>
        <p class="loading-subtext">Bu işlem internet hızınıza göre birkaç saniye sürebilir.</p>
        <div class="progress-shell">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-glow"></div>
        </div>
        <div class="overlay-hint">AR &amp; 3D deneyimi hazırlanıyor</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const progressFill = overlay.querySelector(".progress-fill");

    // Hide overlay helper
    const hideOverlay = () => {
      if (overlay.classList.contains("fade-out")) return;
      overlay.classList.add("fade-out");
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 550);
    };

    // Update progress bar during load
    viewer.addEventListener("progress", (event) => {
      const total = event.detail && typeof event.detail.totalProgress === "number"
        ? event.detail.totalProgress
        : null;
      if (total !== null) {
        const percent = Math.max(0, Math.min(100, Math.round(total * 100)));
        progressFill.style.width = percent + "%";
      }
    });

    // When model loaded, fill bar and hide overlay
    viewer.addEventListener("load", () => {
      progressFill.style.width = "100%";
      setTimeout(hideOverlay, 250);
    });

    // Fallback timeout to ensure overlay hides even if 'load' event fails
    setTimeout(hideOverlay, 20000);
  });
})();
