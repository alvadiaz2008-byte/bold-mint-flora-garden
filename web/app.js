(function () {
  const WHATSAPP = "51955802712";
  const ADMIN_PASSWORD = "589";
  const STORE_KEY = "atlas-tactico-store-v1";
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

  const $ = (sel) => document.querySelector(sel);
  const app = $("#app");

  function money(n) {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(n) || 0);
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
              <a class="icon-btn" href="#/catalogo" aria-label="Buscar">⌕</a>
              <a class="ghost-btn ${here === "admin" ? "active" : ""}" href="#/admin">Administrador</a>
              <button class="menu-btn" type="button" data-menu aria-label="Abrir menú">☰</button>
            </div>
          </div>
          <nav class="mobile-menu" id="mobile-menu" aria-label="Móvil">
            <a href="#/">Inicio</a>
            <a href="#/catalogo">Catálogo</a>
            ${CATEGORIES.map((c) => `<a href="#/catalogo?categoria=${c.slug}">${c.label}</a>`).join("")}
            <a href="#/admin">Administrador</a>
          </nav>
        </header>
        <main>${content}</main>
        <footer class="site-foot">
          <div class="wrap foot-grid">
            <div>
              ${logo()}
              <p class="muted" style="margin-top:0.75rem;max-width:18rem;font-size:0.9rem">Catálogo de ropa y equipo para personal militar. Precios en soles.</p>
            </div>
            <div>
              <p class="subtle">Categorías</p>
              <ul>${CATEGORIES.map((c) => `<li><a href="#/catalogo?categoria=${c.slug}">${c.label}</a></li>`).join("")}</ul>
            </div>
            <div>
              <p class="subtle">Catálogo</p>
              <ul>
                <li><a href="#/catalogo">Ver todo</a></li>
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
        (p.name + " " + p.sku + " " + p.description).toLowerCase().includes(q),
      );
    }
    const title = cat ? LABEL[cat] || cat : "Catálogo";
    return `
      <div class="wrap" style="padding-top:2rem;padding-bottom:3rem">
        <p class="kicker">Inventario</p>
        <h1 style="font-size:clamp(2rem,5vw,3rem);margin-top:0.3rem">${escapeHtml(title)}</h1>
        <p class="muted" style="margin-top:0.4rem">${list.length} producto${list.length === 1 ? "" : "s"}</p>
        <form class="search" data-search>
          <input name="q" value="${escapeHtml(params.q || "")}" placeholder="Buscar prenda, SKU…" />
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
            <p class="muted" style="margin-top:0.4rem;font-family:ui-monospace,monospace">Ref. ${escapeHtml(p.sku)}</p>
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
            <div style="margin-top:1.5rem">
              ${
                soldOut
                  ? `<button class="btn lg" disabled>Agotado</button>`
                  : `<a class="btn lg" href="#/comprar/${p.id}">Comprar por WhatsApp</a>`
              }
            </div>
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

  function checkoutPage(id) {
    const p = byId(id);
    if (!p) return `<div class="wrap empty">Producto no encontrado.</div>`;
    if (p.stock <= 0) {
      return `<div class="wrap" style="padding:3rem 0"><h1>Agotado</h1><p class="muted" style="margin-top:0.5rem">Esta prenda no tiene unidades disponibles.</p><p style="margin-top:1rem"><a class="btn" href="#/producto/${p.id}">Volver</a></p></div>`;
    }
    return `
      <div class="wrap" style="padding:2rem 0 3rem;max-width:44rem">
        <p class="kicker">Pedido</p>
        <h1 style="margin-top:0.4rem;font-size:2.4rem">Datos de envío</h1>
        <p class="muted" style="margin-top:0.5rem">Al confirmar se descuenta 1 unidad del stock y se abre WhatsApp con tu pedido al +51 955 802 712.</p>
        <div class="panel" style="margin:1.25rem 0">
          <p class="subtle">${LABEL[p.category] || ""}</p>
          <h2 style="margin-top:0.3rem">${escapeHtml(p.name)}</h2>
          <p style="margin-top:0.4rem">${money(p.priceSoles)} · ${stockLabel(p.stock)}</p>
        </div>
        <form class="form-card" data-checkout="${p.id}">
          <div class="form-grid two">
            <div class="field"><label>Talla</label>
              <select name="size">${p.sizes.map((s) => `<option>${escapeHtml(s)}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Color</label>
              <select name="color">${p.colors.map((c) => `<option>${escapeHtml(c.name)}</option>`).join("")}</select>
            </div>
          </div>
          <div class="field"><label>Cantidad</label>
            <input name="qty" type="number" min="1" max="${p.stock}" value="1" required />
          </div>
          <div class="field"><label>Nombre completo</label><input name="name" required maxlength="80" /></div>
          <div class="form-grid two">
            <div class="field"><label>Teléfono</label><input name="phone" required maxlength="20" placeholder="9xxxxxxxx" /></div>
            <div class="field"><label>DNI (opcional)</label><input name="dni" maxlength="12" /></div>
          </div>
          <div class="field"><label>Dirección</label><input name="address" required maxlength="160" placeholder="Calle, número, urbanización" /></div>
          <div class="form-grid two">
            <div class="field"><label>Distrito</label><input name="district" required maxlength="60" /></div>
            <div class="field"><label>Ciudad / provincia</label><input name="city" required maxlength="60" /></div>
          </div>
          <div class="field"><label>Referencia</label><input name="ref" maxlength="120" placeholder="Casa color, piso, etc." /></div>
          <p class="error" data-err hidden></p>
          <button class="btn lg" type="submit">Confirmar y abrir WhatsApp</button>
        </form>
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
          <div class="form-grid two">
            <div class="field"><label>Nombre</label><input name="name" required /></div>
            <div class="field"><label>SKU</label><input name="sku" required /></div>
          </div>
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
          <div class="field"><label>Colores (Nombre:#hex, separados por coma)</label><input name="colors" value="Olivo:#4B5320, Negro:#1A1A1A" /></div>
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
                  <p class="muted">${escapeHtml(p.sku)} · ${money(p.priceSoles)} · ${stockLabel(p.stock)}</p>
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
        return { name: name || "Color", hex: hex || "#4B5320" };
      });
  }

  function bind() {
    $("#mobile-menu")?.classList.remove("open");
    document.querySelector("[data-menu]")?.addEventListener("click", () => {
      $("#mobile-menu")?.classList.toggle("open");
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
      });
    });
    document.querySelectorAll("[data-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-size]").forEach((b) => b.classList.remove("on"));
        btn.classList.add("on");
      });
    });

    document.querySelector("[data-checkout]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = e.target.getAttribute("data-checkout");
      const p = byId(id);
      const err = e.target.querySelector("[data-err]");
      if (!p) return;
      const data = Object.fromEntries(new FormData(e.target).entries());
      const qty = Math.max(1, Number(data.qty) || 1);
      if (qty > p.stock) {
        err.hidden = false;
        err.textContent = "No hay tantas unidades.";
        return;
      }
      const next = p.stock - qty;
      setStock(p.id, next);
      const msg = [
        "Pedido ATLAS TÁCTICO",
        "",
        `Producto: ${p.name}`,
        `SKU: ${p.sku}`,
        `Talla: ${data.size}`,
        `Color: ${data.color}`,
        `Cantidad: ${qty}`,
        `Precio unitario: ${money(p.priceSoles)}`,
        `Total: ${money(p.priceSoles * qty)}`,
        "",
        "Comprador",
        `Nombre: ${data.name}`,
        `Teléfono: ${data.phone}`,
        data.dni ? `DNI: ${data.dni}` : null,
        `Dirección: ${data.address}`,
        `Distrito: ${data.district}`,
        `Ciudad: ${data.city}`,
        data.ref ? `Referencia: ${data.ref}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    });

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
      const title = $("#form-title");
      if (title) title.textContent = "Nueva prenda";
    });
    document.querySelector("[data-admin-form]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target).entries());
      const input = {
        sku: String(fd.sku).trim(),
        name: String(fd.name).trim(),
        description: String(fd.description).trim(),
        category: fd.category,
        priceSoles: Number(fd.priceSoles),
        stock: Math.max(0, Number(fd.stock) || 0),
        sizes: String(fd.sizes)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: parseColors(fd.colors),
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
        form.sku.value = p.sku;
        form.category.value = p.category;
        form.priceSoles.value = p.priceSoles;
        form.stock.value = p.stock;
        form.sizes.value = (p.sizes || []).join(", ");
        form.colors.value = (p.colors || []).map((c) => `${c.name}:${c.hex}`).join(", ");
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
      else if (parts[0] === "comprar") inner = checkoutPage(parts[1]);
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
