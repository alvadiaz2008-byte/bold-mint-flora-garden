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
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) {}
    const seed = (window.SEED_PRODUCTS || []).map((p) => ({ ...p }));
    saveProducts(seed);
    return seed;
  }

  function saveProducts(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }

  function products() {
    return loadProducts();
  }

  function byId(id) {
    return products().find((p) => String(p.id) === String(id));
  }

  function setStock(id, next) {
    const list = products().map((p) =>
      String(p.id) === String(id) ? { ...p, stock: Math.max(0, next) } : p,
    );
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

  function qtyInCart(productId, exceptKey) {
    return loadCart()
      .filter((i) => String(i.productId) === String(productId) && i.key !== exceptKey)
      .reduce((n, i) => n + Number(i.qty || 0), 0);
  }

  function addToCart({ productId, size, color, qty }) {
    const p = byId(productId);
    if (!p) return "Producto no encontrado.";
    if (p.stock <= 0) return "Esta prenda está agotada.";
    const n = Math.max(1, Number(qty) || 1);
    const key = `${p.id}|${size}|${color}`;
    const cart = loadCart();
    const existing = cart.find((i) => i.key === key);
    const nextQty = (existing ? existing.qty : 0) + n;
    if (qtyInCart(p.id, key) + nextQty > p.stock) {
      return `Solo hay ${p.stock} unidades de esta prenda.`;
    }
    if (existing) existing.qty = nextQty;
    else {
      cart.push({
        key,
        productId: p.id,
        name: p.name,
        image: p.images[0] || "",
        priceSoles: p.priceSoles,
        size,
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
    if (p && qtyInCart(p.id, key) + n > p.stock) {
      item.qty = Math.max(1, p.stock - qtyInCart(p.id, key));
    } else item.qty = n;
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
      return `<p class="muted" style="padding:0.75rem 0">Aún no hay prendas. Elige talla, color y cantidad en la ficha.</p>`;
    }
    return items
      .map(
        (item) => `<div class="drawer-row">
          <img src="${item.image}" alt="" />
          <div>
            <p class="drawer-name">${escapeHtml(item.name)}</p>
            <p class="muted">${escapeHtml(item.size)} · ${escapeHtml(item.color)} · ×${item.qty}</p>
            <p>${money(item.priceSoles * item.qty)}</p>
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
      <p>Total <strong>${money(cartTotal())}</strong></p>
      <a class="btn" href="#/carrito" data-cart-expand>Ver carrito completo</a>
      <a class="btn outline" href="#/comprar" data-cart-expand>Realizar compra</a>`;
  }

  function cartOverlayHtml() {
    return `
      <div class="cart-overlay" data-cart-overlay ${drawerOpen ? "" : "hidden"}>
        <button class="cart-backdrop" type="button" data-cart-close aria-label="Cerrar carrito"></button>
        <aside class="cart-drawer" aria-label="Carrito">
          <div class="drawer-head">
            <h2>Carrito</h2>
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
    const body = document.querySelector("[data-drawer-body]");
    const foot = document.querySelector("[data-drawer-foot]");
    if (body) body.innerHTML = drawerItemsHtml();
    if (foot) foot.innerHTML = drawerFootHtml();
    bindCartDeletes();
    document.querySelectorAll("[data-cart-expand]").forEach((link) => {
      link.addEventListener("click", () => closeDrawer());
    });
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
              <a href="#/" class="${!here ? "active" : ""}">Inicio</a>
              <a href="#/catalogo" class="${here === "catalogo" ? "active" : ""}">Catálogo</a>
              ${CATEGORIES.slice(0, 4)
                .map((c) => `<a href="#/catalogo?categoria=${c.slug}">${c.label}</a>`)
                .join("")}
            </nav>
            <div class="nav-actions">
              <button class="icon-btn cart-link" type="button" data-cart-toggle aria-label="Abrir carrito">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M6 6h15l-1.5 9h-12z"/>
                  <path d="M6 6 5 3H2"/>
                  <circle cx="9" cy="20" r="1.3"/>
                  <circle cx="18" cy="20" r="1.3"/>
                </svg>
                ${cartBadge()}
              </button>
              <a class="ghost-btn ${here === "admin" ? "active" : ""}" href="#/admin">Administrador</a>
              <button class="menu-btn" type="button" data-menu aria-label="Abrir menú">☰</button>
            </div>
          </div>
          <nav class="mobile-menu" id="mobile-menu" aria-label="Móvil">
            <a href="#/">Inicio</a>
            <a href="#/catalogo">Catálogo</a>
            ${CATEGORIES.map((c) => `<a href="#/catalogo?categoria=${c.slug}">${c.label}</a>`).join("")}
            <a href="#/carrito">Carrito ${cartCount() ? `(${cartCount()})` : ""}</a>
            <a href="#/admin">Administrador</a>
          </nav>
        </header>
        ${cartOverlayHtml()}
        <main>${content}</main>
        <footer class="site-foot">
          <div class="wrap foot-grid">
            <div>
              ${logo()}
              <p class="muted" style="margin-top:0.75rem;max-width:18rem;font-size:0.9rem">Catálogo de ropa y equipo para personal militar. Precios en soles. Envíos solo en Iquitos.</p>
            </div>
            <div>
              <p class="subtle">Categorías</p>
              <ul>${CATEGORIES.map((c) => `<li><a href="#/catalogo?categoria=${c.slug}">${c.label}</a></li>`).join("")}</ul>
            </div>
            <div>
              <p class="subtle">Catálogo</p>
              <ul>
                <li><a href="#/catalogo">Ver todo</a></li>
                <li><a href="#/carrito">Carrito</a></li>
                <li><a href="#/admin">Administrador</a></li>
              </ul>
            </div>
          </div>
          <div class="copy">ATLAS TÁCTICO · Catálogo de referencia · Precios en S/</div>
        </footer>
      </div>`;
  }

  function card(p) {
    const img = p.images?.[0] || "";
    return `<a class="card" href="#/producto/${p.id}">
      <img src="${img}" alt="${escapeHtml(p.name)}" />
      <div class="card-body">
        <p class="subtle">${LABEL[p.category] || p.category}</p>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="card-foot">
          <div>
            <p>${money(p.priceSoles)}</p>
            ${stockLabel(p.stock)}
          </div>
          <div class="swatches">${(p.colors || [])
            .slice(0, 4)
            .map((c) => `<span class="swatch" title="${escapeHtml(c.name)}" style="background:${c.hex}"></span>`)
            .join("")}</div>
        </div>
      </div>
    </a>`;
  }

  function escapeHtml(s) {
    const amp = "&" + "amp;";
    const lt = "&" + "lt;";
    const gt = "&" + "gt;";
    const quot = "&" + "quot;";
    return String(s ?? "")
      .replace(/&/g, amp)
      .replace(/</g, lt)
      .replace(/>/g, gt)
      .replace(/"/g, quot);
  }

  function home() {
    const all = products();
    const featured = all.filter((p) => p.featured);
    const show = featured.length >= 4 ? featured.slice(0, 8) : all.slice(0, 8);
    return `
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-inner">
          <p class="kicker">Equipo de servicio</p>
          <h1>Catálogo táctico para quien sirve.</h1>
          <p>Uniformes, calzado, chalecos y accesorios. Vista simple del catálogo; ficha completa al entrar en cada producto. Precios en soles.</p>
          <div class="hero-actions">
            <a class="btn lg" href="#/catalogo">Ver catálogo →</a>
            <a class="btn lg outline" href="#/catalogo?categoria=uniformes">Uniformes</a>
          </div>
        </div>
      </section>
      <section class="section wrap">
        <div class="section-head"><h2>Categorías</h2></div>
        <div class="cats">${CATEGORIES.map(
          (c) => `<a class="cat-card" href="#/catalogo?categoria=${c.slug}"><span>${c.label}</span></a>`,
        ).join("")}</div>
      </section>
      <section class="section wrap" style="padding-top:0">
        <div class="section-head"><h2>Destacados</h2><a class="muted" href="#/catalogo">Ver todo</a></div>
        <div class="grid">${show.map(card).join("")}</div>
      </section>`;
  }

  function catalog() {
    const { params } = parseHash();
    const cat = params.categoria || "";
    const q = (params.q || "").trim().toLowerCase();
    let list = products();
    if (cat) list = list.filter((p) => p.category === cat);
    if (q) {
      list = list.filter((p) =>
        (p.name + " " + p.description).toLowerCase().includes(q),
      );
    }
    const title = cat ? LABEL[cat] || cat : "Catálogo";
    return `
      <div class="wrap" style="padding-top:2rem;padding-bottom:3rem">
        <p class="kicker">Inventario</p>
        <h1 style="font-size:clamp(2rem,5vw,3rem);margin-top:0.3rem">${escapeHtml(title)}</h1>
        <p class="muted" style="margin-top:0.4rem">${list.length} producto${list.length === 1 ? "" : "s"}</p>
        <form class="search" data-search>
          <input name="q" value="${escapeHtml(params.q || "")}" placeholder="Buscar prenda…" />
          <button class="btn" type="submit">Buscar</button>
        </form>
        <div class="filters">
          <a class="chip ${!cat ? "on" : ""}" href="#/catalogo">Todo</a>
          ${CATEGORIES.map(
            (c) =>
              `<a class="chip ${cat === c.slug ? "on" : ""}" href="#/catalogo?categoria=${c.slug}">${c.label}</a>`,
          ).join("")}
        </div>
        ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<p class="empty">No hay productos en esta vista.</p>`}
      </div>`;
  }

  function productPage(id) {
    const p = byId(id);
    if (!p) return `<div class="wrap empty">Producto no encontrado. <a href="#/catalogo">Volver al catálogo</a></div>`;
    const related = products()
      .filter((x) => x.category === p.category && x.id !== p.id)
      .slice(0, 4);
    const soldOut = p.stock <= 0;
    return `
      <div class="wrap">
        <nav class="crumbs">
          <a href="#/">Inicio</a><span>/</span>
          <a href="#/catalogo?categoria=${p.category}">${LABEL[p.category] || p.category}</a>
          <span>/</span><span>${escapeHtml(p.name)}</span>
        </nav>
        <article class="detail">
          <div>
            ${
              p.images.length > 1
                ? `<div class="thumbs">${p.images
                    .map(
                      (src, i) =>
                        `<button type="button" class="${i === 0 ? "on" : ""}" data-thumb="${i}"><img src="${src}" alt=""></button>`,
                    )
                    .join("")}</div>`
                : ""
            }
            <img class="photo" id="main-photo" src="${p.images[0] || ""}" alt="${escapeHtml(p.name)}" />
          </div>
          <div>
            <span class="badge">${LABEL[p.category] || p.category}</span>
            <h1 style="margin-top:0.7rem;font-size:clamp(2rem,5vw,3rem)">${escapeHtml(p.name)}</h1>
            <p class="price">${money(p.priceSoles)}</p>
            <p class="muted" style="font-size:0.9rem">Precio en soles (PEN)</p>
            <p style="margin-top:0.75rem">${stockLabel(p.stock)}</p>
            ${
              p.colors?.length
                ? `<fieldset style="border:0;padding:0;margin-top:1.6rem">
                    <legend class="subtle">Color</legend>
                    <div class="choices" id="color-choices">
                      ${p.colors
                        .map(
                          (c, i) =>
                            `<button type="button" class="choice ${i === 0 ? "on" : ""}" data-color="${escapeHtml(c.name)}"><span class="swatch" style="background:${c.hex}"></span>${escapeHtml(c.name)}</button>`,
                        )
                        .join("")}
                    </div>
                  </fieldset>`
                : ""
            }
            ${
              p.sizes?.length
                ? `<fieldset style="border:0;padding:0;margin-top:1.2rem">
                    <legend class="subtle">Talla</legend>
                    <div class="choices" id="size-choices">
                      ${p.sizes
                        .map(
                          (s, i) =>
                            `<button type="button" class="size ${i === 0 ? "on" : ""}" data-size="${escapeHtml(s)}">${escapeHtml(s)}</button>`,
                        )
                        .join("")}
                    </div>
                  </fieldset>`
                : ""
            }
            <p class="muted" style="margin-top:1.6rem">${escapeHtml(p.description)}</p>
            <form data-add-cart="${p.id}" style="margin-top:1.5rem">
              <input type="hidden" name="color" value="${escapeHtml(p.colors[0]?.name || "")}" />
              <input type="hidden" name="size" value="${escapeHtml(p.sizes[0] || "")}" />
              ${
                soldOut
                  ? `<button class="btn lg" type="button" disabled>Agotado</button>`
                  : `<div class="field" style="max-width:8rem;margin-bottom:0.85rem">
                      <label>Cantidad</label>
                      <input name="qty" type="number" min="1" max="${p.stock}" value="1" required />
                    </div>
                    <p class="error" data-err hidden></p>
                    <div class="hero-actions">
                      <button class="btn lg" type="submit">Añadir al carrito</button>
                      <a class="btn lg outline" href="#/carrito">Ver carrito</a>
                    </div>`
              }
            </form>
          </div>
        </article>
        <div class="panels">
          <div class="panel">
            <h2>Características</h2>
            <ul>${(p.features || []).map((f) => `<li>✓ ${escapeHtml(f)}</li>`).join("") || "<li class='muted'>Sin características extra.</li>"}</ul>
          </div>
          <div class="panel">
            <h2>Ficha técnica</h2>
            <dl>
              <div class="row"><dt class="muted">Material</dt><dd>${escapeHtml(p.material || "—")}</dd></div>
              <div class="row"><dt class="muted">Peso</dt><dd>${p.weightG ? p.weightG + " g" : "—"}</dd></div>
              ${Object.entries(p.specs || {})
                .map(
                  ([k, v]) =>
                    `<div class="row"><dt class="muted">${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`,
                )
                .join("")}
            </dl>
          </div>
        </div>
        ${
          related.length
            ? `<section class="section" style="padding-top:0"><div class="section-head"><h2>Relacionados</h2></div><div class="grid">${related.map(card).join("")}</div></section>`
            : ""
        }
      </div>`;
  }

  function cartPage() {
    const items = loadCart().map((item) => {
      const p = byId(item.productId);
      return { ...item, stock: p ? p.stock : 0, missing: !p };
    });
    if (!items.length) {
      return `
        <div class="wrap" style="padding:3rem 0">
          <p class="kicker">Carrito</p>
          <h1 style="margin-top:0.4rem;font-size:2.4rem">Tu carrito está vacío</h1>
          <p class="muted" style="margin-top:0.5rem">Añade prendas desde el catálogo. En cada producto eliges talla, color y cantidad.</p>
          <p style="margin-top:1.25rem"><a class="btn" href="#/catalogo">Ir al catálogo</a></p>
        </div>`;
    }
    return `
      <div class="wrap" style="padding:2rem 0 3rem;max-width:52rem">
        <p class="kicker">Carrito</p>
        <h1 style="margin-top:0.4rem;font-size:2.4rem">Tus prendas</h1>
        <p class="muted" style="margin-top:0.5rem">${cartCount()} artículo${cartCount() === 1 ? "" : "s"} · Envíos solo en Iquitos</p>
        <div class="cart-list">
          ${items
            .map(
              (item) => `<div class="cart-row">
                <img src="${item.image}" alt="" />
                <div>
                  <h3><a href="#/producto/${item.productId}">${escapeHtml(item.name)}</a></h3>
                  <p class="muted">Talla ${escapeHtml(item.size)} · ${escapeHtml(item.color)}</p>
                  <p class="muted">${money(item.priceSoles)} c/u</p>
                  ${item.missing ? `<p class="error">Esta prenda ya no está en el catálogo.</p>` : ""}
                </div>
                <div class="cart-side">
                  <input data-cart-qty="${escapeHtml(item.key)}" type="number" min="1" max="${item.stock || 1}" value="${item.qty}" />
                  <strong>${money(item.priceSoles * item.qty)}</strong>
                  <button class="btn danger" type="button" data-cart-del="${escapeHtml(item.key)}">Quitar</button>
                </div>
              </div>`,
            )
            .join("")}
        </div>
        <div class="cart-total">
          <p>Total <strong>${money(cartTotal())}</strong></p>
          <a class="btn lg" href="#/comprar">Realizar compra</a>
        </div>
      </div>`;
  }

  function buyerPage() {
    const items = loadCart();
    if (!items.length) {
      return `
        <div class="wrap" style="padding:3rem 0">
          <h1>El carrito está vacío</h1>
          <p class="muted" style="margin-top:0.5rem">Añade prendas antes de completar la compra.</p>
          <p style="margin-top:1rem"><a class="btn" href="#/catalogo">Ir al catálogo</a></p>
        </div>`;
    }
    return `
      <div class="wrap" style="padding:2rem 0 3rem;max-width:44rem">
        <p class="kicker">Paso 2</p>
        <h1 style="margin-top:0.4rem;font-size:2.4rem">Datos del comprador</h1>
        <p class="muted" style="margin-top:0.5rem">Envíos solo en Iquitos. Revisa el pedido y confirma antes de abrir WhatsApp.</p>
        <div class="panel" style="margin:1.25rem 0">
          ${items
            .map(
              (i) =>
                `<p style="padding:0.35rem 0">${escapeHtml(i.qty + " × " + i.name)} <span class="muted">(${escapeHtml(i.size)} · ${escapeHtml(i.color)})</span> — ${money(i.priceSoles * i.qty)}</p>`,
            )
            .join("")}
          <p style="margin-top:0.6rem"><strong>Total ${money(cartTotal())}</strong></p>
          <p style="margin-top:0.5rem"><a class="muted" href="#/carrito">Editar carrito</a></p>
        </div>
        <form class="form-card" data-checkout novalidate>
          <div class="field"><label>Nombre completo</label>
            <input name="name" required maxlength="80" autocomplete="name" placeholder="Nombre y apellido" />
          </div>
          <div class="form-grid two">
            <div class="field"><label>Celular (9 dígitos)</label>
              <input name="phone" required inputmode="numeric" maxlength="15" placeholder="9xxxxxxxx" autocomplete="tel" />
              <span class="hint">Debe empezar con 9. Ejemplo: 955802712</span>
            </div>
            <div class="field"><label>DNI (opcional)</label>
              <input name="dni" inputmode="numeric" maxlength="8" placeholder="8 dígitos" />
            </div>
          </div>
          <div class="field">
            <label>Ciudad de envío</label>
            <input value="Iquitos, Loreto, Perú" readonly class="readonly" />
          </div>
          <div class="field"><label>Dirección en Iquitos</label>
            <input name="address" required maxlength="160" autocomplete="street-address" placeholder="Calle, número, urbanización o zona" />
          </div>
          <div class="field"><label>Referencia</label>
            <input name="ref" maxlength="120" placeholder="Casa color, piso, costado de…" />
          </div>
          <p class="error" data-err hidden></p>
          <button class="btn lg" type="submit">Revisar pedido</button>
        </form>
        <div class="modal" data-preview hidden>
          <div class="modal-card">
            <p class="kicker">Vista previa</p>
            <h2 style="margin-top:0.35rem">Confirma tu pedido</h2>
            <dl class="preview-list" data-preview-body></dl>
            <div class="preview-actions">
              <button class="btn outline" type="button" data-preview-edit>Editar</button>
              <button class="btn" type="button" data-preview-send>Confirmar y abrir WhatsApp</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function isAdmin() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function adminPage() {
    if (!isAdmin()) {
      return `
        <div class="wrap" style="padding:3rem 0;max-width:24rem">
          <p class="kicker">Acceso</p>
          <h1 style="margin-top:0.4rem">Administrador</h1>
          <form class="form-card" data-login style="margin-top:1.25rem">
            <div class="field"><label>Contraseña</label><input name="password" type="password" required /></div>
            <p class="error" data-err hidden></p>
            <button class="btn" type="submit">Entrar</button>
          </form>
        </div>`;
    }
    const list = products();
    return `
      <div class="wrap" style="padding:2rem 0 3rem">
        <div class="section-head">
          <div>
            <p class="kicker">Panel</p>
            <h1 style="margin-top:0.3rem;font-size:2.4rem">Productos y stock</h1>
          </div>
          <button class="btn outline" type="button" data-logout>Salir</button>
        </div>
        <form class="form-card" data-admin-form style="margin-bottom:2rem">
          <input type="hidden" name="id" />
          <h2 id="form-title">Nueva prenda</h2>
          <div class="field"><label>Nombre</label><input name="name" required /></div>
          <div class="form-grid two">
            <div class="field"><label>Categoría</label>
              <select name="category">${CATEGORIES.map((c) => `<option value="${c.slug}">${c.label}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Precio (S/)</label><input name="priceSoles" type="number" min="1" step="0.01" required /></div>
          </div>
          <div class="form-grid two">
            <div class="field"><label>Stock (unidades)</label><input name="stock" type="number" min="0" step="1" required value="10" /></div>
            <div class="field"><label>Tallas (separadas por coma)</label><input name="sizes" value="S, M, L, XL" /></div>
          </div>
          <div class="field">
            <label>Colores</label>
            <div class="color-list" data-color-list>
              ${colorRowHtml("Olivo", "#4B5320")}${colorRowHtml("Negro", "#1A1A1A")}
            </div>
            <button class="btn outline" type="button" data-add-color>Añadir color</button>
            <div class="picker" data-picker hidden>
              <p class="subtle">Elige el color</p>
              <div class="picker-sv" data-sv>
                <span class="picker-knob" data-sv-knob></span>
              </div>
              <span class="hint">Tono</span>
              <div class="picker-hue" data-hue>
                <span class="picker-hue-knob" data-hue-knob></span>
              </div>
              <span class="hint">Exposición</span>
              <input class="picker-exp" type="range" min="0" max="100" data-value />
              <div class="picker-tools">
                <button class="btn outline" type="button" data-eyedrop hidden>Cuentagotas</button>
                <input class="picker-hex" data-hex maxlength="7" spellcheck="false" />
                <button class="btn" type="button" data-picker-ok>Listo</button>
              </div>
            </div>
          </div>
          <div class="field"><label>URL de imagen</label><input name="image" placeholder="https://…" /></div>
          <div class="field"><label>Descripción</label><textarea name="description" required minlength="20"></textarea></div>
          <div class="field"><label>Material</label><input name="material" /></div>
          <button class="btn" type="submit">Guardar</button>
          <button class="btn outline" type="button" data-reset-form>Cancelar edición</button>
        </form>
        <div class="admin-list">
          ${list
            .map(
              (p) => `<div class="admin-row">
                <img src="${p.images[0] || ""}" alt="" />
                <div>
                  <h3>${escapeHtml(p.name)}</h3>
                  <p class="muted">${money(p.priceSoles)} · ${stockLabel(p.stock)}</p>
                </div>
                <div class="row-actions">
                  <button class="btn outline" data-edit="${p.id}">Editar</button>
                  <button class="btn danger" data-del="${p.id}">Borrar</button>
                </div>
              </div>`,
            )
            .join("")}
        </div>
      </div>`;
  }

  function parseColors(text) {
    return String(text)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, hex] = part.split(":").map((s) => s.trim());
        return { name: name || "Color", hex: normalizeHex(hex) };
      });
  }

  function normalizeHex(hex) {
    let h = String(hex || "").trim();
    if (!h.startsWith("#")) h = "#" + h;
    if (/^#[0-9a-fA-F]{3}$/.test(h)) {
      h = "#" + [...h.slice(1)].map((c) => c + c).join("");
    }
    return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : "#4B5320";
  }

  function hexToHsv(hex) {
    const h = normalizeHex(hex).slice(1);
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let hue = 0;
    if (d) {
      if (max === r) hue = ((g - b) / d) % 6;
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60;
      if (hue < 0) hue += 360;
    }
    return { h: hue, s: max === 0 ? 0 : d / max, v: max };
  }

  function hsvToHex(h, s, v) {
    const f = (n) => {
      const k = (n + h / 60) % 6;
      return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    };
    const to = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");
    return ("#" + to(f(5)) + to(f(3)) + to(f(1))).toUpperCase();
  }

  function colorRowHtml(name, hex) {
    const safe = normalizeHex(hex);
    return `<div class="color-row">
      <button type="button" class="color-chip" data-open-picker style="background:${safe}" aria-label="Elegir color"></button>
      <input type="text" data-color-name value="${escapeHtml(name)}" placeholder="Nombre del color" maxlength="40" />
      <input type="hidden" data-color-hex value="${safe}" />
      <button type="button" class="btn outline" data-remove-color>Quitar</button>
    </div>`;
  }

  function readAdminColors() {
    return [...document.querySelectorAll(".color-row")]
      .map((row) => ({
        name: row.querySelector("[data-color-name]")?.value.trim() || "Color",
        hex: normalizeHex(row.querySelector("[data-color-hex]")?.value),
      }))
      .filter((c) => c.name);
  }

  function setColorList(colors) {
    const list = document.querySelector("[data-color-list]");
    if (!list) return;
    const rows = colors.length
      ? colors
      : [
          { name: "Olivo", hex: "#4B5320" },
          { name: "Negro", hex: "#1A1A1A" },
        ];
    list.innerHTML = rows.map((c) => colorRowHtml(c.name, c.hex)).join("");
  }

  function bindColorPicker() {
    const picker = document.querySelector("[data-picker]");
    const sv = document.querySelector("[data-sv]");
    const svKnob = document.querySelector("[data-sv-knob]");
    const hueEl = document.querySelector("[data-hue]");
    const hueKnob = document.querySelector("[data-hue-knob]");
    const valueEl = document.querySelector("[data-value]");
    const hexEl = document.querySelector("[data-hex]");
    const eyedrop = document.querySelector("[data-eyedrop]");
    if (!picker || !sv) return;

    let hsv = { h: 80, s: 0.55, v: 0.32 };
    let activeRow = null;

    if (window.EyeDropper && eyedrop) eyedrop.hidden = false;

    function applyToRow() {
      if (!activeRow) return;
      const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
      const chip = activeRow.querySelector("[data-open-picker]");
      const hidden = activeRow.querySelector("[data-color-hex]");
      if (chip) chip.style.background = hex;
      if (hidden) hidden.value = hex;
      if (hexEl) hexEl.value = hex;
    }

    function paint() {
      const hueColor = hsvToHex(hsv.h, 1, 1);
      sv.style.setProperty("--picker-hue", hueColor);
      if (svKnob) {
        svKnob.style.left = hsv.s * 100 + "%";
        svKnob.style.top = 100 - hsv.v * 100 + "%";
      }
      if (hueKnob) hueKnob.style.left = (hsv.h / 360) * 100 + "%";
      if (valueEl) valueEl.value = String(Math.round(hsv.v * 100));
      applyToRow();
    }

    function openFor(row) {
      activeRow = row;
      const hex = row.querySelector("[data-color-hex]")?.value || "#4B5320";
      hsv = hexToHsv(hex);
      picker.hidden = false;
      paint();
      picker.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function fromPoint(el, ev, horizontal, vertical) {
      const r = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
      if (horizontal) hsv.h = x * 360;
      if (vertical) {
        hsv.s = x;
        hsv.v = 1 - y;
      }
      paint();
    }

    function drag(el, onMove) {
      const move = (ev) => onMove(ev.touches ? ev.touches[0] : ev);
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", up);
    }

    document.querySelector("[data-color-list]")?.addEventListener("click", (e) => {
      const row = e.target.closest(".color-row");
      if (!row) return;
      if (e.target.closest("[data-open-picker]")) openFor(row);
      if (e.target.closest("[data-remove-color]")) {
        const list = document.querySelector("[data-color-list]");
        if (list && list.querySelectorAll(".color-row").length > 1) row.remove();
        if (activeRow === row) {
          picker.hidden = true;
          activeRow = null;
        }
      }
    });

    document.querySelector("[data-add-color]")?.addEventListener("click", () => {
      const list = document.querySelector("[data-color-list]");
      if (!list) return;
      list.insertAdjacentHTML("beforeend", colorRowHtml("Color", "#8A9A6A"));
      openFor(list.querySelector(".color-row:last-child"));
    });

    sv.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      fromPoint(sv, ev, false, true);
      drag(sv, (p) => fromPoint(sv, p, false, true));
    });
    hueEl?.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      fromPoint(hueEl, ev, true, false);
      drag(hueEl, (p) => fromPoint(hueEl, p, true, false));
    });
    valueEl?.addEventListener("input", () => {
      hsv.v = Number(valueEl.value) / 100;
      paint();
    });
    hexEl?.addEventListener("change", () => {
      hsv = hexToHsv(hexEl.value);
      paint();
    });
    eyedrop?.addEventListener("click", async () => {
      if (!window.EyeDropper) return;
      try {
        const result = await new window.EyeDropper().open();
        hsv = hexToHsv(result.sRGBHex);
        paint();
      } catch (_) {}
    });
    document.querySelector("[data-picker-ok]")?.addEventListener("click", () => {
      picker.hidden = true;
      activeRow = null;
    });
  }

  function bind() {
    $("#mobile-menu")?.classList.remove("open");
    document.querySelector("[data-menu]")?.addEventListener("click", () => {
      $("#mobile-menu")?.classList.toggle("open");
    });

    document.querySelector("[data-cart-toggle]")?.addEventListener("click", () => {
      if (drawerOpen) closeDrawer();
      else openDrawer();
    });
    document.querySelectorAll("[data-cart-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeDrawer());
    });
    document.querySelectorAll("[data-cart-expand]").forEach((link) => {
      link.addEventListener("click", () => closeDrawer());
    });

    document.querySelector("[data-search]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new FormData(e.target).get("q");
      const { params } = parseHash();
      const cat = params.categoria ? `categoria=${params.categoria}&` : "";
      go(`#/catalogo?${cat}q=${encodeURIComponent(String(q || "").trim())}`);
    });

    document.querySelectorAll("[data-thumb]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-thumb]").forEach((b) => b.classList.remove("on"));
        btn.classList.add("on");
        const p = byId(parseHash().parts[1]);
        const i = Number(btn.getAttribute("data-thumb"));
        const photo = $("#main-photo");
        if (photo && p?.images[i]) photo.src = p.images[i];
      });
    });
    document.querySelectorAll("[data-color]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-color]").forEach((b) => b.classList.remove("on"));
        btn.classList.add("on");
        const hidden = document.querySelector('[data-add-cart] [name="color"]');
        if (hidden) hidden.value = btn.getAttribute("data-color") || "";
      });
    });
    document.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-size]").forEach((b) => b.classList.remove("on"));
        btn.classList.add("on");
        const hidden = document.querySelector('[data-add-cart] [name="size"]');
        if (hidden) hidden.value = btn.getAttribute("data-size") || "";
      });
    });

    document.querySelector("[data-add-cart]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const err = form.querySelector("[data-err]");
      const data = Object.fromEntries(new FormData(form).entries());
      const msg = addToCart({
        productId: form.getAttribute("data-add-cart"),
        size: data.size,
        color: data.color,
        qty: data.qty,
      });
      if (msg) {
        err.hidden = false;
        err.textContent = msg;
        return;
      }
      if (err) err.hidden = true;
      refreshCartUI();
      openDrawer();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = "Añadido";
        setTimeout(() => {
          if (btn.textContent === "Añadido") btn.textContent = prev;
        }, 1400);
      }
    });

    document.querySelectorAll("[data-cart-del]").forEach((btn) => {
      btn.addEventListener("click", onCartDelete);
    });
    document.querySelectorAll("[data-cart-qty]").forEach((input) => {
      input.addEventListener("change", () => {
        setCartQty(input.getAttribute("data-cart-qty"), input.value);
        render();
      });
    });

    document.querySelector("[data-checkout]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const err = form.querySelector("[data-err]");
      const modal = document.querySelector("[data-preview]");
      const items = loadCart();
      if (!modal) return;
      const showError = (msg) => {
        err.hidden = false;
        err.textContent = msg;
        err.scrollIntoView({ behavior: "smooth", block: "center" });
      };
      err.hidden = true;
      if (!items.length) {
        showError("El carrito está vacío.");
        return;
      }
      for (const item of items) {
        const p = byId(item.productId);
        if (!p) {
          showError(`"${item.name}" ya no está en el catálogo. Quítalo del carrito.`);
          return;
        }
        if (qtyInCart(p.id) > p.stock) {
          showError(`No hay stock suficiente de ${p.name}.`);
          return;
        }
      }
      const data = Object.fromEntries(new FormData(form).entries());
      const invalid = validateOrder(data);
      if (invalid) {
        showError(invalid);
        return;
      }
      const phone = normalizePhone(data.phone);
      const name = String(data.name).trim();
      const address = String(data.address).trim();
      const ref = String(data.ref || "").trim();
      const dni = onlyDigits(data.dni);
      const total = money(cartTotal());
      const rows = [
        ...items.map((i) => [
          `${i.qty} × ${i.name}`,
          `${i.size} · ${i.color} · ${money(i.priceSoles * i.qty)}`,
        ]),
        ["Total", total],
        ["Nombre", name],
        ["Celular", phone],
        dni ? ["DNI", dni] : null,
        ["Ciudad", `${SHIP_CITY}, ${SHIP_REGION}`],
        ["Dirección", address],
        ref ? ["Referencia", ref] : null,
      ].filter(Boolean);
      modal.querySelector("[data-preview-body]").innerHTML = rows
        .map(
          ([k, v]) =>
            `<div class="row"><dt class="muted">${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`,
        )
        .join("");
      modal.hidden = false;
      document.body.style.overflow = "hidden";

      const closePreview = () => {
        modal.hidden = true;
        document.body.style.overflow = "";
      };
      modal.querySelector("[data-preview-edit]").onclick = closePreview;
      modal.onclick = (ev) => {
        if (ev.target === modal) closePreview();
      };
      modal.querySelector("[data-preview-send]").onclick = () => {
        const sendBtn = modal.querySelector("[data-preview-send]");
        sendBtn.disabled = true;
        const qtyByProduct = {};
        for (const item of items) {
          qtyByProduct[item.productId] = (qtyByProduct[item.productId] || 0) + Number(item.qty);
        }
        for (const [id, qty] of Object.entries(qtyByProduct)) {
          const p = byId(id);
          if (p) setStock(p.id, p.stock - qty);
        }
        clearCart();
        const lines = items.map(
          (i) =>
            `• ${i.qty} × ${i.name} (${i.size}, ${i.color}) — ${money(i.priceSoles * i.qty)}`,
        );
        const msg = [
          "Pedido ATLAS TÁCTICO",
          "",
          "Prendas",
          ...lines,
          `Total: ${total}`,
          "",
          "Comprador",
          `Nombre: ${name}`,
          `Teléfono: ${phone}`,
          dni ? `DNI: ${dni}` : null,
          `Ciudad: ${SHIP_CITY}, ${SHIP_REGION}`,
          `Dirección: ${address}`,
          ref ? `Referencia: ${ref}` : null,
        ]
          .filter(Boolean)
          .join("\n");
        window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      };
    });

    bindColorPicker();

    document.querySelector("[data-login]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const password = new FormData(e.target).get("password");
      const err = e.target.querySelector("[data-err]");
      if (String(password) === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "1");
        render();
      } else {
        err.hidden = false;
        err.textContent = "Contraseña incorrecta.";
      }
    });
    document.querySelector("[data-logout]")?.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      render();
    });
    document.querySelector("[data-reset-form]")?.addEventListener("click", () => {
      const form = document.querySelector("[data-admin-form]");
      form?.reset();
      form.querySelector('[name="id"]').value = "";
      setColorList([
        { name: "Olivo", hex: "#4B5320" },
        { name: "Negro", hex: "#1A1A1A" },
      ]);
      const title = $("#form-title");
      if (title) title.textContent = "Nueva prenda";
      document.querySelector("[data-picker]")?.setAttribute("hidden", "");
    });
    document.querySelector("[data-admin-form]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target).entries());
      const input = {
        name: String(fd.name).trim(),
        description: String(fd.description).trim(),
        category: fd.category,
        priceSoles: Number(fd.priceSoles),
        stock: Math.max(0, Number(fd.stock) || 0),
        sizes: String(fd.sizes)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: (() => {
          const list = readAdminColors();
          return list.length ? list : [{ name: "Olivo", hex: "#4B5320" }];
        })(),
        images: fd.image ? [String(fd.image).trim()] : ["https://images.unsplash.com/photo-1548449112-96a38a64381d?auto=format&fit=crop&w=900&q=80"],
        material: String(fd.material || "").trim(),
        weightG: null,
        features: [],
        specs: {},
        featured: false,
      };
      upsertProduct(input, fd.id || null);
      render();
    });
    document.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = byId(btn.getAttribute("data-edit"));
        const form = document.querySelector("[data-admin-form]");
        if (!p || !form) return;
        form.name.value = p.name;
        form.category.value = p.category;
        form.priceSoles.value = p.priceSoles;
        form.stock.value = p.stock;
        form.sizes.value = (p.sizes || []).join(", ");
        setColorList(p.colors || []);
        form.image.value = p.images?.[0] || "";
        form.description.value = p.description;
        form.material.value = p.material || "";
        form.id.value = p.id;
        const title = $("#form-title");
        if (title) title.textContent = "Editar prenda";
        form.scrollIntoView({ behavior: "smooth" });
      });
    });
    document.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("¿Eliminar esta prenda?")) {
          removeProduct(btn.getAttribute("data-del"));
          render();
        }
      });
    });
  }

  function render() {
    try {
      if (!app) return;
      const { parts } = parseHash();
      let inner = home();
      if (parts[0] === "catalogo") inner = catalog();
      else if (parts[0] === "producto") inner = productPage(parts[1]);
      else if (parts[0] === "carrito") inner = cartPage();
      else if (parts[0] === "comprar") inner = buyerPage();
      else if (parts[0] === "admin") inner = adminPage();
      app.innerHTML = layout(inner);
      bind();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      if (app) {
        app.innerHTML =
          '<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><h1>ATLAS TÁCTICO</h1><p>No se pudo cargar el catálogo. Recarga la página.</p></div>';
      }
    }
  }

  window.addEventListener("hashchange", render);
  render();
})();
