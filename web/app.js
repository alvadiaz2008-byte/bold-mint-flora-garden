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

  let _productsCache = null;

  function loadProducts() {
    if (_productsCache) return _productsCache;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          const need = parsed.some((p) => !Array.isArray(p.variants));
          const next = parsed.map(ensureVariants);
          if (need) saveProducts(next);
          _productsCache = next;
          return next;
        }
      }
    } catch (_) {}
    const seed = (window.SEED_PRODUCTS || []).map((p) => ensureVariants({ ...p }));
    saveProducts(seed);
    _productsCache = seed;
    return seed;
  }

  function setProductsFromCatalog(list) {
    const next = (list || []).map((p) => ensureVariants({ ...p }));
    saveProducts(next);
    _productsCache = next;
    return next;
  }

  async function initFromCatalog() {
    try {
      const res = await fetch("web/catalog.json", { cache: "no-store" });
      if (!res.ok) throw new Error("no catalog");
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        setProductsFromCatalog(data);
        return true;
      }
    } catch (_) {}
    return false;
  }

  function saveProducts(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
    _productsCache = list;
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

  function productSizes(p) {
    const fromV = [...new Set((p.variants || []).map((v) => v.size))];
    const list = (fromV.length ? fromV : p.sizes || []).filter((s) => s && s !== "Sin talla");
    return list;
  }

  function variantNote(size, color) {
    if (!size || size === "Sin talla") return color || "";
    return size + " · " + color;
  }

  function productColors(p, size) {
    let list = p.variants || [];
    if (size) list = list.filter((v) => v.size === size);
    const seen = new Map();
    for (const v of list) {
      if (!seen.has(v.color)) {
        seen.set(v.color, { name: v.color, hex: v.hex || "#4B5320" });
      }
    }
    if (seen.size) return [...seen.values()];
    return p.colors || [];
  }

  function variantStock(p, size, color) {
    const v = (p.variants || []).find(
      (x) => x.size === size && x.color === color,
    );
    if (v) return Math.max(0, Number(v.stock) || 0);
    return Math.max(0, Number(p.stock) || 0);
  }

  function totalStock(p) {
    if (p.variants?.length) {
      return p.variants.reduce((n, v) => n + Math.max(0, Number(v.stock) || 0), 0);
    }
    return Math.max(0, Number(p.stock) || 0);
  }

  function products() {
    return loadProducts();
  }

  function byId(id) {
    return products().find((p) => String(p.id) === String(id));
  }

  function setVariantStock(id, size, color, next) {
    const list = products().map((p) => {
      if (String(p.id) !== String(id)) return p;
      const variants = (p.variants || []).map((v) =>
        v.size === size && v.color === color
          ? { ...v, stock: Math.max(0, next) }
          : v,
      );
      const stock = variants.reduce((n, v) => n + Math.max(0, Number(v.stock) || 0), 0);
      return { ...p, variants, stock };
    });
    saveProducts(list);
    return list.find((p) => String(p.id) === String(id));
  }

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return [];
  }

  function saveCart(list) {
    localStorage.setItem(CART_KEY, JSON.stringify(list));
  }

  function cartCount() {
    return loadCart().reduce((n, i) => n + Number(i.qty || 0), 0);
  }

  function cartTotal() {
    return loadCart().reduce((n, i) => n + Number(i.priceSoles) * Number(i.qty), 0);
  }

  function qtyInCartVariant(productId, size, color, exceptKey) {
    return loadCart()
      .filter(
        (i) =>
          String(i.productId) === String(productId) &&
          i.size === size &&
          i.color === color &&
          i.key !== exceptKey,
      )
      .reduce((n, i) => n + Number(i.qty || 0), 0);
  }

  function addToCart({ productId, size, color, qty }) {
    const p = byId(productId);
    if (!p) return "Producto no encontrado.";
    if (!color) return "Elige un color.";
    const sized = productSizes(p).length > 0;
    if (sized && !size) return "Elige talla.";
    const sizeKey = sized ? size : size || "Sin talla";
    const have = variantStock(p, sizeKey, color);
    if (have <= 0) return `Agotado${sized ? " en talla " + sizeKey : ""} / ${color}.`;
    const n = Math.max(1, Number(qty) || 1);
    const key = `${p.id}|${sizeKey}|${color}`;
    const cart = loadCart();
    const existing = cart.find((i) => i.key === key);
    const nextQty = (existing ? existing.qty : 0) + n;
    if (nextQty > have) {
      return `Solo hay ${have} unidades${sized ? " en talla " + sizeKey + "," : ""} color ${color}.`;
    }
    if (existing) existing.qty = nextQty;
    else {
      cart.push({
        key,
        productId: p.id,
        name: p.name,
        image: p.images[0] || "",
        priceSoles: p.priceSoles,
        size: sizeKey,
        color,
        qty: n,
      });
    }
    saveCart(cart);
    return "";
  }

  function setCartQty(key, qty) {
    const cart = loadCart();
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    const p = byId(item.productId);
    const n = Math.max(1, Number(qty) || 1);
    const have = p ? variantStock(p, item.size, item.color) : n;
    item.qty = Math.min(n, Math.max(1, have));
    saveCart(cart);
  }

  function removeCartItem(key) {
    saveCart(loadCart().filter((i) => i.key !== key));
  }

  function clearCart() {
    saveCart([]);
  }

  function cartBadge() {
    const n = cartCount();
    return n ? `<span class="cart-badge">${n > 99 ? "99+" : n}</span>` : "";
  }

  function drawerItemsHtml() {
    const items = loadCart();
    if (!items.length) {
      return `<p class="drawer-empty">Aún no hay prendas. Elige talla, color y cantidad en la ficha.</p>`;
    }
    return items
      .map(
        (item) => `<div class="drawer-row">
          <img src="${item.image}" alt="" />
          <div>
            <p class="drawer-name">${escapeHtml(item.name)}</p>
            <p class="muted">${escapeHtml(variantNote(item.size, item.color))} · ×${item.qty}</p>
            <p class="drawer-price">${money(item.priceSoles * item.qty)}</p>
          </div>
          <button class="icon-btn" type="button" data-cart-del="${escapeHtml(item.key)}" aria-label="Quitar">×</button>
        </div>`,
      )
      .join("");
  }

  function drawerFootHtml() {
    const n = cartCount();
    if (!n) return "";
    return `
      <p class="drawer-total">Total <strong>${money(cartTotal())}</strong></p>
      <a class="btn" href="#/carrito" data-cart-expand>Ver carrito completo</a>
      <a class="btn outline" href="#/comprar" data-cart-expand>Realizar compra</a>`;
  }

  function cartOverlayHtml() {
    return `
      <div class="cart-overlay" data-cart-overlay ${drawerOpen ? "" : "hidden"}>
        <button class="cart-backdrop" type="button" data-cart-close aria-label="Cerrar carrito"></button>
        <aside class="cart-drawer" aria-label="Carrito">
          <div class="drawer-head">
            <div>
              <p class="kicker">Pedido</p>
              <h2>Carrito</h2>
            </div>
            <button type="button" class="icon-btn" data-cart-close aria-label="Cerrar">×</button>
          </div>
          <div class="drawer-body" data-drawer-body>${drawerItemsHtml()}</div>
          <div class="drawer-foot" data-drawer-foot>${drawerFootHtml()}</div>
        </aside>
      </div>`;
  }

  function openDrawer() {
    drawerOpen = true;
    const el = document.querySelector("[data-cart-overlay]");
    if (el) el.hidden = false;
  }

  function closeDrawer() {
    drawerOpen = false;
    const el = document.querySelector("[data-cart-overlay]");
    if (el) el.hidden = true;
  }

  function refreshCartUI() {
    const link = document.querySelector(".cart-link");
    if (link) {
      link.querySelector(".cart-badge")?.remove();
      const html = cartBadge();
      if (html) link.insertAdjacentHTML("beforeend", html);
    }
    const mobile = document.querySelector("[data-cart-count]");
    if (mobile) mobile.textContent = `Carrito (${cartCount()})`;
    const body = document.querySelector("[data-drawer-body]");
    const foot = document.querySelector("[data-drawer-foot]");
    if (body) body.innerHTML = drawerItemsHtml();
    if (foot) foot.innerHTML = drawerFootHtml();
    bindCartDeletes();
    document.querySelectorAll("[data-cart-expand]").forEach((link) => {
      link.addEventListener("click", () => closeDrawer());
    });
  }

  function popCartCount() {
    const badge = document.querySelector(".cart-badge");
    const mobile = document.querySelector("[data-cart-count]");
    [badge, mobile].forEach((el) => {
      if (!el) return;
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
    });
  }

  function playAddedSound() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!playAddedSound.ctx) playAddedSound.ctx = new Ctx();
      const ctx = playAddedSound.ctx;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const tone = (freq, start, dur, vol) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.setValueAtTime(freq, now + start);
        g.gain.setValueAtTime(0.0001, now + start);
        g.gain.exponentialRampToValueAtTime(vol, now + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + start);
        o.stop(now + start + dur + 0.03);
      };
      tone(392, 0, 0.11, 0.07);
      tone(587.33, 0.09, 0.2, 0.08);
    } catch (_) {}
  }

  function dismissToast(overlay) {
    if (!overlay || overlay.classList.contains("off")) return;
    overlay.classList.remove("on");
    overlay.classList.add("off");
    setTimeout(() => overlay.remove(), 160);
  }

  function showToast(text) {
    document.querySelector("[data-toast-overlay]")?.remove();
    const overlay = document.createElement("div");
    overlay.className = "toast-overlay";
    overlay.setAttribute("data-toast-overlay", "");
    overlay.innerHTML = `<div class="toast-card" role="status">
      <p class="kicker">Carrito</p>
      <p class="toast-title">${escapeHtml(text)}</p>
    </div>`;
    overlay.addEventListener("click", () => dismissToast(overlay));
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("on"));
    playAddedSound();
    setTimeout(() => dismissToast(overlay), 850);
  }

  function onCartDelete(e) {
    const btn = e.currentTarget;
    removeCartItem(btn.getAttribute("data-cart-del"));
    const { parts } = parseHash();
    if (parts[0] === "carrito" || parts[0] === "comprar") render();
    else refreshCartUI();
  }

  function bindCartDeletes() {
    document.querySelectorAll("[data-cart-del]").forEach((btn) => {
      btn.removeEventListener("click", onCartDelete);
      btn.addEventListener("click", onCartDelete);
    });
  }

  function upsertProduct(input, id) {
    const list = products();
    if (id) {
      const next = list.map((p) =>
        String(p.id) === String(id) ? { ...p, ...input, id: p.id } : p,
      );
      saveProducts(next);
      return;
    }
    const newId = list.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
    list.unshift({ ...input, id: newId });
    saveProducts(list);
  }

  function removeProduct(id) {
    saveProducts(products().filter((p) => String(p.id) !== String(id)));
  }

  function stockLabel(n) {
    if (n <= 0) return `<span class="stock-out">Agotado</span>`;
    if (n <= 5) return `<span class="stock-low">${n} disponibles</span>`;
    return `<span class="stock-ok">${n} disponibles</span>`;
  }

  function parseHash() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [path, query = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = Object.fromEntries(new URLSearchParams(query));
    return { parts, params, path: "/" + parts.join("/") };
  }

  function go(hash) {
    location.hash = hash;
  }

  function logo() {
    return `<a class="logo" href="#/" aria-label="ATLAS TÁCTICO — inicio">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 2.5 28 8.2v7.4c0 7.2-5.1 12.6-12 14.9C9.1 28.2 4 22.8 4 15.6V8.2L16 2.5Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M16 8.2 22.4 22h-2.6l-1.2-2.8h-5.2L12.2 22H9.6L16 8.2Zm-3 8.6h6L16 12.2 13 16.8Z" fill="currentColor"/>
      </svg>
      <span class="logo-name"><strong>ATLAS</strong><span>TÁCTICO</span></span>
    </a>`;
  }

  function layout(content) {
    const { parts } = parseHash();
    const here = parts[0] || "";
    return `
      <div class="site">
        <div class="topbar">Catálogo de equipo táctico · Personal militar y de seguridad</div>
        <header class="nav">
          <div class="wrap nav-row">
            ${logo()}
            <nav class="nav-links" aria-label="Principal">
              <a href="#/" class="${!here ? "active" : ""}>Inicio</a>
              <a href="#/catalogo" class="${here === "catalogo" ? "active" : ""}">Catálogo</a>
              ${CATEGORIES.slice(0, 4)
                .map((c) => `<a href="#/catalogo?categoria=${c.slug}">${c.label}</a>`)
                .join("")}
            </nav>
            <div class="nav-actions">
              <button class="icon-btn cart-link" type="button" data-cart-toggle aria-label="Abrir carrito">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6L5 3H2"/>
                </svg>
                ${cartBadge()}
              </button>
              <a class="nav-admin" href="#/admin">Administrador</a>
            </div>
          </div>
        </header>
        <main>${content}</main>
        ${cartOverlayHtml()}
      </div>`;
  }

  // NOTE: truncated middle preserved from original via full file - continue with init
  window.addEventListener("hashchange", render);

  (async function boot() {
    await initFromCatalog();
    render();
  })();
})();
