// Unified include.js for AlbaSpace website (Turkish)
//
// Handles:
// - header/footer includes
// - active nav
// - language switch
// - futuristic preloader
// - GLOBAL footer enhancement (address buttons + phone button)

document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

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
        }
        nav.main-nav.nav-open { display: flex !important; }
        nav.main-nav a {
          padding: 12px 18px;
          font-size: 14px;
          border-bottom: 1px solid rgba(15,23,42,.6);
        }
      }
    `;
    document.head.appendChild(navStyle);
  }

  // ---------------- Load includes ----------------
  includes.forEach((el) => {
    const url = el.getAttribute("data-include");
    if (!url) return;

    fetch(url)
      .then((r) => r.text())
      .then((html) => {
        el.innerHTML = html;

        if (url.includes("header-")) {
          markActiveNav();
          setupLangSwitch();
        }

        if (url.includes("footer-")) {
          enhanceFooter(el);
        }
      })
      .catch(console.error);
  });
});

// ================= NAV =================
function markActiveNav() {
  const path = normalizePath(location.pathname || "/");
  document.querySelectorAll(".main-nav a").forEach((a) => {
    try {
      const linkPath = normalizePath(new URL(a.href).pathname);
      if (linkPath === path) a.classList.add("active");
    } catch {}
  });
}
function normalizePath(p) {
  if (!p || p === "/") return "/index.html";
  if (!p.endsWith(".html") && !p.endsWith("/")) return p + "/";
  return p;
}

// ================= LANG =================
function setupLangSwitch() {
  const path = location.pathname;
  const isEn = path.startsWith("/eng/");
  document.querySelectorAll(".top-lang-switch [data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === (isEn ? "en" : "tr"));
    btn.onclick = (e) => {
      e.preventDefault();
      if (btn.dataset.lang === "en") location.href = "/eng/index.html";
      else location.href = "/index.html";
    };
  });
}

// ================= FOOTER ENHANCER =================
function enhanceFooter(root) {
  injectFooterStyles();

  const footer = root.querySelector("footer");
  if (!footer || footer.classList.contains("alba-footer-v3")) return;
  footer.classList.add("alba-footer-v3");

  const container =
    footer.querySelector(".footer-right") ||
    footer.querySelector(".footer-address") ||
    footer;

  const raw = container.innerText || "";
  const phoneMatch = raw.match(/(\+?\d[\d\s()-]{8,})/);
  const phoneRaw = phoneMatch ? phoneMatch[1] : "";
  const phoneTel = phoneRaw.replace(/[^\d+]/g, "");

  const blocks = raw
    .replace(phoneRaw, "")
    .split(/(?=Merkez Ofis|Adana Şube)/g)
    .map((b) => b.trim())
    .filter(Boolean);

  const panel = document.createElement("div");
  panel.className = "alba-footer-panel";

  blocks.slice(0, 2).forEach((b) => {
    const lines = b.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;

    const title = lines[0];
    const address = lines.slice(1).join(", ");

    const a = document.createElement("a");
    a.className = "alba-footer-btn";
    a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
    a.target = "_blank";
    a.innerHTML = `
      <div class="btn-title">${title}</div>
      <div class="btn-text">${address}</div>
    `;
    panel.appendChild(a);
  });

  if (phoneTel) {
    const p = document.createElement("a");
    p.className = "alba-footer-btn phone";
    p.href = "tel:" + phoneTel;
    p.innerHTML = `
      <div class="btn-title">Call</div>
      <div class="btn-text">${phoneRaw}</div>
      <div class="btn-sub">Tap to call</div>
    `;
    panel.appendChild(p);
  }

  container.innerHTML = "";
  container.appendChild(panel);
}

// ================= FOOTER STYLES =================
function injectFooterStyles() {
  if (document.getElementById("alba-footer-style-v3")) return;

  const s = document.createElement("style");
  s.id = "alba-footer-style-v3";
  s.textContent = `
    .alba-footer-panel {
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-left: auto;
    }
    .alba-footer-btn {
      padding: 14px 16px;
      border-radius: 16px;
      background: rgba(15,23,42,.55);
      border: 1px solid rgba(148,163,184,.28);
      text-decoration: none;
      text-align: center;
      transition: .25s;
    }
    .alba-footer-btn:hover {
      transform: translateY(-2px);
      border-color: rgba(56,189,248,.7);
      box-shadow: 0 18px 50px rgba(56,189,248,.15);
    }
    .btn-title {
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 6px;
    }
    .btn-text {
      color: #cbd5f5;
      font-size: 13px;
    }
    .btn-sub {
      margin-top: 4px;
      font-size: 11px;
      opacity: .65;
    }
    .alba-footer-btn.phone .btn-title {
      color: #a7f3d0;
    }
    @media (max-width:768px) {
      .alba-footer-panel {
        margin: 0 auto;
      }
    }
  `;
  document.head.appendChild(s);
}
