/**
 * Transición tipo app: la página entra con zoom desde el punto tocado.
 * Solo usa transform + opacity.
 * Para desactivar: window.LEAD_ZOOM = false; o borra este script de index.html.
 */
(function () {
  if (window.LEAD_ZOOM === false) return;

  var enabled = true;
  var origin = null;
  var lastRoute = "";

  function reducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_) {
      return false;
    }
  }

  function currentRoute() {
    var h = (location.hash || "#/").replace(/^#\/?/, "");
    return (h.split("?")[0] || "").toLowerCase();
  }

  function captureOrigin(el) {
    if (!enabled || reducedMotion() || !el || !el.getBoundingClientRect) return;
    try {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var vw = window.innerWidth || 1;
      var vh = window.innerHeight || 1;
      origin = {
        ox: Math.max(0, Math.min(100, (cx / vw) * 100)),
        oy: Math.max(0, Math.min(100, (cy / vh) * 100)),
      };
      el.classList.add("lead-tap-pulse");
      setTimeout(function () {
        try {
          el.classList.remove("lead-tap-pulse");
        } catch (_) {}
      }, 140);
    } catch (_) {}
  }

  function applyZoom() {
    if (!enabled || reducedMotion()) return;
    var page = document.querySelector(".page");
    if (!page || !origin) return;
    var route = currentRoute();
    if (route === lastRoute) return;
    lastRoute = route;
    page.style.setProperty("--lead-ox", origin.ox.toFixed(2) + "%");
    page.style.setProperty("--lead-oy", origin.oy.toFixed(2) + "%");
    page.classList.remove("lead-zoom-in");
    void page.offsetWidth;
    page.classList.add("lead-zoom-in");
    origin = null;
    function clear() {
      page.classList.remove("lead-zoom-in");
      page.style.removeProperty("--lead-ox");
      page.style.removeProperty("--lead-oy");
      page.removeEventListener("animationend", clear);
    }
    page.addEventListener("animationend", clear);
  }

  document.addEventListener(
    "click",
    function (e) {
      if (!enabled || reducedMotion()) return;
      var a = e.target.closest && e.target.closest('a[href^="#/"]');
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (!href || href.indexOf("#/") !== 0) return;
      var cur = (location.hash || "#/").split("?")[0];
      var next = href.split("?")[0];
      if (cur === next) return;
      var pulse =
        e.target.closest(
          ".card, .cat-card, .chip, .btn, .nav-links a, .mobile-menu a, .admin-row, [data-view], [data-edit]",
        ) || a;
      captureOrigin(pulse);
    },
    true,
  );

  window.addEventListener("hashchange", function () {
    setTimeout(applyZoom, 30);
    setTimeout(applyZoom, 120);
  });

  var root = document.querySelector("#app");
  if (root) {
    new MutationObserver(function () {
      applyZoom();
    }).observe(root, { childList: true, subtree: true });
  }

  window.LeadZoom = {
    disable: function () {
      enabled = false;
    },
    enable: function () {
      enabled = true;
    },
  };
})();
