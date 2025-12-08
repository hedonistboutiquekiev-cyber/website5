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
