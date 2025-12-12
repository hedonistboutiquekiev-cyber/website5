
document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

  const loadFragment = (el) => {
    const url = el.getAttribute("data-include");
    if (!url) return;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load " + url);
        return res.text();
      })
      .then((html) => {
        el.innerHTML = html;
        if (url.includes("header-")) {
          markActiveNav();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const markActiveNav = () => {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll(".main-nav a");
    let matched = false;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      // handle absolute URLs by comparing pathname part
      try {
        const linkUrl = new URL(href, window.location.origin);
        if (linkUrl.pathname === path) {
          link.classList.add("active");
          matched = true;
        }
      } catch (e) {
        // relative URL
        if (path.endsWith(href)) {
          link.classList.add("active");
          matched = true;
        }
      }
    });

    if (!matched) {
      // default: highlight ATLAS if present
      navLinks.forEach((link) => {
        const text = (link.textContent || "").trim().toUpperCase();
        if (text.includes("ATLAS")) {
          link.classList.add("active");
          matched = true;
        }
      });
    }
  };

  includes.forEach(loadFragment);
});
