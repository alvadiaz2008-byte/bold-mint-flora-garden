(function () {
  const STORE_KEY = "atlas-tactico-store-v1";
  const app = document.querySelector("#app");

  function applyLogo() {
    document.querySelectorAll("a.logo").forEach((el) => {
      if (el.querySelector("img.logo-img")) return;
      const svg = el.querySelector("svg");
      const img = document.createElement("img");
      img.src = "public/logo.png";
      img.alt = "ATLAS TÁCTICO";
      img.className = "logo-img";
      img.width = 36;
      img.height = 36;
      if (svg) svg.replaceWith(img);
      else el.insertBefore(img, el.firstChild);
    });
  }

  async function boot() {
    try {
      const res = await fetch("web/catalog.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          localStorage.setItem(STORE_KEY, JSON.stringify(data));
        }
      }
    } catch (_) {}

    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/gh/alvadiaz2008-byte/bold-mint-flora-garden@fe6d9b176af50f8546c6597d913a090ddcbebb69/web/app.js";
    s.onload = function () {
      applyLogo();
      const root = document.querySelector("#app");
      if (root) {
        new MutationObserver(applyLogo).observe(root, {
          childList: true,
          subtree: true,
        });
      }
    };
    document.body.appendChild(s);
  }

  if (app) {
    app.innerHTML =
      '<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><p>ATLAS TÁCTICO</p><h1>Cargando catálogo…</h1></div>';
  }
  boot();
})();
