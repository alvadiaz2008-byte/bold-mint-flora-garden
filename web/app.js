(function () {
  const STORE_KEY = "atlas-tactico-store-v1";
  const app = document.querySelector("#app");

  const style = document.createElement("style");
  style.textContent = `
.hero-bg {
  background: url("public/logo.png") center/contain no-repeat !important;
  background-color: #141611 !important;
  opacity: 0.22 !important;
}
.hero { min-height: 12rem; }
@media (min-width: 768px) { .hero { min-height: 16rem; } }
.cat-card {
  min-height: 3.25rem !important;
  justify-content: center !important;
  padding: 0.55rem 0.85rem !important;
  border-radius: 0.7rem !important;
}
.cat-card span { font-size: 1rem !important; }
.logo-img {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  border-radius: 6px;
  flex-shrink: 0;
}
.logo-name strong { letter-spacing: 0.12em; }
.logo-name span { letter-spacing: 0.14em; }
`;
  document.head.appendChild(style);

  function applyLogo() {
    document.querySelectorAll("a.logo").forEach((el) => {
      el.setAttribute("aria-label", "LEAD BAZAR MILITAR — inicio");
      if (!el.querySelector("img.logo-img")) {
        const svg = el.querySelector("svg");
        const img = document.createElement("img");
        img.src = "public/logo.png";
        img.alt = "LEAD BAZAR MILITAR";
        img.className = "logo-img";
        img.width = 36;
        img.height = 36;
        if (svg) svg.replaceWith(img);
        else el.insertBefore(img, el.firstChild);
      }
      const name = el.querySelector(".logo-name");
      if (name) {
        const strong = name.querySelector("strong");
        const span = name.querySelector("span");
        if (strong) strong.textContent = "LEAD";
        if (span) span.textContent = "BAZAR MILITAR";
      }
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
      '<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><p>LEAD BAZAR MILITAR</p><h1>Cargando catálogo…</h1></div>';
  }
  boot();
})();
