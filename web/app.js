(function () {
  const WHATSAPP = "51955802712";
  const ADMIN_PASSWORD = "589";
  const STORE_KEY = "atlas-tactico-store-v1";
  const CART_KEY = "atlas-tactico-cart-v1";
  const SESSION_KEY = "atlas-tactico-admin";

  const CATEGORIES = [
    { slug: "uniformes", label: "Uniformes" },
    { slug: "calzado", label: "Calzado" },
    { slug: "chalecos", label: "Chalecos" },
    { slug: "mochilas", label: "Mochilas" },
    { slug: "abrigos", label: "Abrigos" },
    { slug: "gorras", label: "Gorras" },
    { slug: "accesorios", label: "Accesorios" },
  ];
  const LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label]));
  const SHIP_CITY = "Iquitos";
  const SHIP_REGION = "Loreto, Perú";

  let drawerOpen = false;

  const $ = (sel) => document.querySelector(sel);
  const app = $("#app");

  function money(n) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(n) || 0);
  }

  function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
  }

  function normalizePhone(s) {
    let d = onlyDigits(s);
    if (d.startsWith("51") && d.length >= 11) d = d.slice(2);
    return d;
  }

  function validateOrder(data) {
    if (!String(data.name || "").trim()) return "Escribe tu nombre.";
    const phone = normalizePhone(data.phone);
    if (!/^9\d{8}$/.test(phone)) {
      return "El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 955802712";
    }
    const dni = onlyDigits(data.dni);
    if (String(data.dni || "").trim() && !/^\d{8}$/.test(dni)) {
      return "El DNI debe tener 8 dígitos, o déjalo vacío.";
    }
    if (!String(data.address || "").trim()) return "Escribe la dirección en Iquitos.";
    return "";
  }

  function loadProducts() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          const need = parsed.some((p) => !Array.isArray(p.variants));
          const next = parsed.map(ensureVariants);
          if (need) saveProducts(next);
          return next;
        }
      }
    } catch (_) {}
    const seed = (window.SEED_PRODUCTS || []).map((p) => ensureVariants({ ...p }));
    saveProducts(seed);
    return seed;
  }

  function saveProducts(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }

  function ensureVariants(p) {
    if (Array.isArray(p.variants) && p.variants.length) {
      const stock = p.variants.reduce((n, v) => n + Math.max(0, Number(v.stock) || 0), 0);
      return { ...p, stock };
    }
    const sizes = p.sizes?.length ? p.sizes : ["Única"];
    const colors = p.colors?.length ? p.colors : [{ name: "Olivo", hex: "#4B5320" }];
    const total = Math.max(0, Math.floor(Number(p.stock) || 0));
    const combos = sizes.length * colors.length || 1;
    const base = Math.floor(total / combos);
    let rest = total - base * combos;
    const variants = [];
    for (const size of sizes) {
      for (const c of colors) {
        const extra = rest > 0 ? 1 : 0;
        rest -= extra;
        variants.push({
          size,
          color: c.name,
          hex: c.hex || "#4B5320",
          stock: base + extra,
        });
      }
    }
    return { ...p, variants, stock: total };
  }

  // RESTORED_STUB - will fix with second push of products loader
  function products() { return loadProducts(); }
  function byId(id) { return products().find((p) => String(p.id) === String(id)); }
  function parseHash() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [path, query = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = Object.fromEntries(new URLSearchParams(query));
    return { parts, params, path: "/" + parts.join("/") };
  }
  function render() {
    if (!app) return;
    app.innerHTML = '<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><h1>ATLAS TÁCTICO</h1><p>Actualizando catálogo… Recarga en unos segundos.</p></div>';
  }
  window.addEventListener("hashchange", render);
  (async function boot() {
    try {
      const res = await fetch("web/catalog.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          localStorage.setItem(STORE_KEY, JSON.stringify(data));
        }
      }
    } catch (_) {}
    // force reload of full app from cache-busted path after restore
    location.reload();
  })();
})();
