(function () {
  const STORE_KEY = "atlas-tactico-store-v1";
  const CART_KEY = "atlas-tactico-cart-v1";
  const STOCK_CACHE_KEY = "lead-stock-cache-v1";
  const RESERVE_KEY = "lead-stock-reserve-v1";
  const BAD_KEYS = "lead-stock-bad-v1";
  const SHEETDB = "https://sheetdb.io/api/v1/jrxq3blppmk92";
  const WHATSAPP = "51955802712";
  const LOGO = "public/logo.webp";
  const app = document.querySelector("#app");

  const style = document.createElement("style");
  style.textContent = `
.hero-bg {
  background: url("${LOGO}") center/contain no-repeat !important;
  background-color: #141611 !important;
  opacity: 0.65 !important;
}
.hero-bg::after {
  background: color-mix(in oklab, #0b0c0a 35%, transparent) !important;
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
.card-photo {
  aspect-ratio: 1 / 1 !important;
  min-height: 0 !important;
  width: 100%;
  overflow: hidden;
}
.card-photo img {
  width: 100% !important;
  height: 100% !important;
  max-height: none !important;
  object-fit: cover !important;
  object-position: center !important;
}
.panels { display: none !important; }
.lead-toast-actions {
  display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;
  margin-top: 1rem;
}
.lead-toast-actions .btn { min-width: 7rem; }
.lead-toast-msg {
  margin-top: 0.5rem;
  color: var(--muted, #9b9c90);
  font-size: 0.95rem;
  white-space: pre-line;
}
.cart-row.stock-bad {
  outline: 2px solid #b4544a !important;
  box-shadow: 0 0 0 1px rgba(180, 84, 74, 0.45) !important;
}
`.replace("${LOGO}", LOGO);
  document.head.appendChild(style);

  (function muteNotifySound() {
    const Native = window.AudioContext || window.webkitAudioContext;
    if (!Native) return;
    function Wrapped(options) {
      const ctx = new Native(options);
      const origOsc = ctx.createOscillator.bind(ctx);
      ctx.createOscillator = function () {
        const o = origOsc();
        o.start = function () {};
        o.stop = function () {};
        return o;
      };
      return ctx;
    }
    Wrapped.prototype = Native.prototype;
    window.AudioContext = Wrapped;
    if (window.webkitAudioContext) window.webkitAudioContext = Wrapped;
  })();

  function refreshProductStockUI() {
    document.querySelectorAll("form").forEach((f) => {
      if (typeof f._paintStock === "function") {
        try {
          f._paintStock();
        } catch (_) {}
      }
    });
  }

  function rowKey(productId, size, color) {
    return String(productId) + "|" + String(size || "Sin talla") + "|" + String(color || "");
  }

  function loadProducts() {
    try {
      const list = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function saveProducts(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function clampCartToStock(map) {
    const cart = loadCart();
    const next = [];
    for (const item of cart) {
      const size = item.size || "Sin talla";
      const k = rowKey(item.productId, size, item.color);
      if (!Object.prototype.hasOwnProperty.call(map, k)) {
        next.push(item);
        continue;
      }
      const max = Math.max(0, Number(map[k]) || 0);
      if (max <= 0) continue;
      const qty = Math.min(Math.max(1, Number(item.qty) || 1), max);
      next.push(Object.assign({}, item, { qty: qty }));
    }
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    return next;
  }

  function getReserve() {
    try {
      return JSON.parse(sessionStorage.getItem(RESERVE_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function setReserve(data) {
    if (data) sessionStorage.setItem(RESERVE_KEY, JSON.stringify(data));
    else sessionStorage.removeItem(RESERVE_KEY);
  }

  function setBadKeys(keys) {
    sessionStorage.setItem(BAD_KEYS, JSON.stringify(keys || []));
  }

  function getBadKeys() {
    try {
      const k = JSON.parse(sessionStorage.getItem(BAD_KEYS) || "[]");
      return Array.isArray(k) ? k : [];
    } catch (_) {
      return [];
    }
  }

  function applyStockRows(rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    const map = {};
    rows.forEach((r) => {
      const k = r.key || rowKey(r.product_id, r.size, r.color);
      map[k] = Math.max(0, Number(r.stock) || 0);
    });
    localStorage.setItem(STOCK_CACHE_KEY, JSON.stringify(map));
    const list = loadProducts().map((p) => {
      const variants = (p.variants || []).map((v) => {
        const k = rowKey(p.id, v.size, v.color);
        if (Object.prototype.hasOwnProperty.call(map, k)) {
          return { ...v, stock: map[k] };
        }
        return v;
      });
      const stock = variants.reduce(
        (n, v) => n + Math.max(0, Number(v.stock) || 0),
        0,
      );
      return { ...p, variants, stock };
    });
    saveProducts(list);
  }

  async function fetchSheetStock() {
    const res = await fetch(SHEETDB, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo consultar el stock. Intenta de nuevo.");
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  }

  async function seedSheetIfEmpty(rows) {
    if (rows.length) return rows;
    const products = loadProducts();
    const data = [];
    products.forEach((p) => {
      (p.variants || []).forEach((v) => {
        data.push({
          key: rowKey(p.id, v.size, v.color),
          product_id: String(p.id),
          sku: p.sku || "",
          name: p.name || "",
          size: v.size || "Sin talla",
          color: v.color || "",
          stock: String(Math.max(0, Number(v.stock) || 0)),
        });
      });
    });
    if (!data.length) return rows;
    const res = await fetch(SHEETDB, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      console.warn("SheetDB seed failed", await res.text().catch(() => ""));
      throw new Error(
        "La hoja de Excel está vacía. Fila 1: key | product_id | sku | name | size | color | stock",
      );
    }
    return fetchSheetStock();
  }

  async function syncStockFromSheet() {
    let rows = await fetchSheetStock();
    try {
      rows = await seedSheetIfEmpty(rows);
    } catch (e) {
      console.warn(e);
    }
    applyStockRows(rows);
    return rows;
  }

  async function patchStock(key, nextStock) {
    const url = SHEETDB + "/key/" + encodeURIComponent(key);
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ stock: String(Math.max(0, nextStock)) }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el stock. Intenta de nuevo.");
  }

  function stockMapFromRows(rows) {
    const map = {};
    rows.forEach((r) => {
      const k = r.key || rowKey(r.product_id, r.size, r.color);
      map[k] = Math.max(0, Number(r.stock) || 0);
    });
    return map;
  }

  function money(n) {
    return "S/ " + Number(n || 0).toFixed(2);
  }

  function variantNote(size, color) {
    const s = size && size !== "Sin talla" ? size : null;
    if (s && color) return s + " / " + color;
    return color || s || "—";
  }

  function dismissLeadToast(overlay) {
    if (!overlay || !overlay.parentNode) return;
    overlay.classList.remove("on");
    overlay.classList.add("off");
    setTimeout(() => overlay.remove(), 200);
  }

  function showLeadDialog({ kicker, title, message, buttons }) {
    return new Promise((resolve) => {
      document.querySelector("[data-lead-toast]")?.remove();
      const overlay = document.createElement("div");
      overlay.className = "toast-overlay";
      overlay.setAttribute("data-lead-toast", "");
      const btns = (buttons || [])
        .map(
          (b, i) =>
            `<button type="button" class="btn ${b.outline ? "outline" : ""}" data-lead-btn="${i}">${b.label}</button>`,
        )
        .join("");
      overlay.innerHTML = `<div class="toast-card" role="dialog" aria-modal="true">
        <p class="kicker">${kicker || "Aviso"}</p>
        <p class="toast-title">${title || ""}</p>
        ${message ? `<p class="lead-toast-msg">${message}</p>` : ""}
        <div class="lead-toast-actions">${btns}</div>
      </div>`;
      overlay.querySelectorAll("[data-lead-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-lead-btn"));
          dismissLeadToast(overlay);
          resolve(buttons[idx]?.id);
        });
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add("on"));
    });
  }

  function findInsufficient(items, map) {
    const bad = [];
    for (const item of items) {
      const size = item.size || "Sin talla";
      const k = rowKey(item.productId, size, item.color);
      const need = Math.max(1, Number(item.qty) || 1);
      const have = map[k];
      if (have == null || have < need) {
        bad.push({
          key: k,
          item,
          have: have == null ? 0 : have,
          need,
          label:
            (item.name || "Producto") +
            " (" +
            variantNote(size, item.color) +
            ")",
        });
      }
    }
    return bad;
  }

  async function reserveCartStock() {
    if (getReserve()) return { ok: true, already: true };
    const items = loadCart();
    if (!items.length) {
      await showLeadDialog({
        kicker: "Carrito",
        title: "Carrito vacío",
        message: "Agrega productos antes de comprar.",
        buttons: [{ id: "ok", label: "Entendido" }],
      });
      location.hash = "#/carrito";
      return { ok: false };
    }
    const rows = await fetchSheetStock();
    const map = stockMapFromRows(rows);
    applyStockRows(rows);
    const bad = findInsufficient(items, map);
    if (bad.length) {
      setBadKeys(bad.map((b) => b.key));
      const lines = bad
        .map(
          (b) =>
            "• " +
            b.label +
            "\n  Disponible: " +
            b.have +
            " · Pedido: " +
            b.need,
        )
        .join("\n\n");
      const choice = await showLeadDialog({
        kicker: "Stock",
        title: "Stock insuficiente",
        message: lines + "\n\nPuedes editar el carrito o salir.",
        buttons: [
          { id: "edit", label: "Editar", outline: true },
          { id: "leave", label: "Salir" },
        ],
      });
      if (choice === "edit") {
        clampCartToStock(map);
        location.hash = "#/carrito";
      } else location.hash = "#/";
      return { ok: false, bad };
    }
    setBadKeys([]);
    const reserved = [];
    for (const item of items) {
      const size = item.size || "Sin talla";
      const k = rowKey(item.productId, size, item.color);
      const need = Math.max(1, Number(item.qty) || 1);
      const freshRows = await fetchSheetStock();
      const freshMap = stockMapFromRows(freshRows);
      const have = freshMap[k];
      if (have == null || have < need) {
        applyStockRows(freshRows);
        for (const r of reserved) {
          try {
            await patchStock(r.key, r.before);
          } catch (_) {}
        }
        setBadKeys([k]);
        const label =
          (item.name || "Producto") +
          " (" +
          variantNote(size, item.color) +
          ")";
        const choice = await showLeadDialog({
          kicker: "Stock",
          title: "Stock insuficiente",
          message:
            "• " +
            label +
            "\n  Disponible: " +
            (have == null ? 0 : have) +
            " · Pedido: " +
            need +
            "\n\nPuedes editar el carrito o salir.",
          buttons: [
            { id: "edit", label: "Editar", outline: true },
            { id: "leave", label: "Salir" },
          ],
        });
        if (choice === "edit") {
          clampCartToStock(freshMap);
          location.hash = "#/carrito";
        } else location.hash = "#/";
        return { ok: false };
      }
      const next = Math.max(0, have - need);
      await patchStock(k, next);
      reserved.push({ key: k, before: have, qty: need, item });
      freshMap[k] = next;
      applyStockRows(
        Object.keys(freshMap).map((key) => {
          const p = key.split("|");
          return {
            key,
            product_id: p[0],
            size: p[1],
            color: p[2],
            stock: freshMap[key],
          };
        }),
      );
    }
    setReserve({ items: reserved, at: Date.now() });
    return { ok: true };
  }

  async function releaseReserve() {
    const res = getReserve();
    setReserve(null);
    if (!res || !res.items || !res.items.length) return;
    try {
      const rows = await fetchSheetStock();
      const map = stockMapFromRows(rows);
      await Promise.all(
        res.items.map((r) => {
          const current = map[r.key];
          const restore =
            current == null ? r.before : current + Number(r.qty || 0);
          map[r.key] = restore;
          return patchStock(r.key, restore).catch((e) =>
            console.warn("No se pudo liberar stock", r.key, e),
          );
        }),
      );
      applyStockRows(
        Object.keys(map).map((key) => {
          const p = key.split("|");
          return {
            key,
            product_id: p[0],
            size: p[1],
            color: p[2],
            stock: map[key],
          };
        }),
      );
    } catch (e) {
      console.warn("releaseReserve", e);
    }
  }

  function currentRoute() {
    const h = (location.hash || "#/").replace(/^#\/?/, "");
    return (h.split("/")[0] || "").toLowerCase();
  }

  let leavingGuard = false;
  let reserving = false;

  async function onEnterComprar() {
    if (reserving) return;
    reserving = true;
    try {
      await reserveCartStock();
    } catch (e) {
      console.error(e);
      await showLeadDialog({
        kicker: "Error",
        title: "No se pudo verificar el stock",
        message: String(e.message || e),
        buttons: [{ id: "ok", label: "Entendido" }],
      });
      location.hash = "#/carrito";
    } finally {
      reserving = false;
    }
  }

  async function onLeaveComprar(nextHash) {
    if (!getReserve() || leavingGuard) {
      if (nextHash != null) location.hash = nextHash;
      return;
    }
    leavingGuard = true;
    const choice = await showLeadDialog({
      kicker: "Pedido en curso",
      title: "¿Seguro que quieres salir?",
      message:
        "Tu stock está reservado por ahora.\nSi sales, otra persona podría comprar esas prendas.",
      buttons: [
        { id: "stay", label: "Continuar", outline: true },
        { id: "leave", label: "Salir" },
      ],
    });
    leavingGuard = false;
    if (choice === "leave") {
      const target = nextHash != null ? nextHash : "#/";
      releaseReserve();
      location.hash = target;
    }
  }

  function markBadCartRows() {
    const bad = getBadKeys();
    if (!bad.length) return;
    const cart = loadCart();
    document.querySelectorAll(".cart-row").forEach((row, idx) => {
      const item = cart[idx];
      if (!item) return;
      const k = rowKey(item.productId, item.size || "Sin talla", item.color);
      if (bad.includes(k)) {
        row.classList.add("stock-bad");
        const input = row.querySelector('input[type="number"]');
        if (input) {
          try {
            const map = JSON.parse(localStorage.getItem(STOCK_CACHE_KEY) || "{}");
            if (map[k] != null) {
              input.max = String(Math.max(0, map[k]));
              if (Number(input.value) > Number(input.max)) {
                input.value = input.max;
              }
            }
          } catch (_) {}
        }
      }
    });
  }

  let lastRoute = currentRoute();

  window.addEventListener("hashchange", async function () {
    const route = currentRoute();
    const prev = lastRoute;
    lastRoute = route;
    if (prev === "comprar" && route !== "comprar") {
      if (getReserve()) {
        leavingGuard = true;
        location.hash = "#/comprar";
        lastRoute = "comprar";
        leavingGuard = false;
        await onLeaveComprar(route === "" ? "#/" : "#/" + route);
        return;
      }
    }
    if (route === "comprar") {
      await onEnterComprar();
      if (window.LeadMap) {
        setTimeout(window.LeadMap.enhanceBuyerForm, 40);
        setTimeout(window.LeadMap.enhanceBuyerForm, 200);
      }
    }
    if (route === "carrito") {
      setTimeout(markBadCartRows, 50);
      setTimeout(markBadCartRows, 300);
    }
  });

  window.addEventListener("beforeunload", function (e) {
    if (getReserve()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  document.addEventListener(
    "click",
    function (e) {
      const del = e.target.closest("[data-cart-del]");
      if (del) {
        setTimeout(refreshProductStockUI, 0);
        setTimeout(refreshProductStockUI, 30);
        setTimeout(refreshProductStockUI, 120);
        return;
      }
      const overlay = e.target.closest("[data-cart-overlay]");
      if (
        overlay &&
        (e.target === overlay || e.target.hasAttribute("data-cart-overlay"))
      ) {
        setTimeout(refreshProductStockUI, 0);
        setTimeout(refreshProductStockUI, 50);
      }
      if (e.target.closest("[data-cart-close], [data-drawer-close]")) {
        setTimeout(refreshProductStockUI, 0);
        setTimeout(refreshProductStockUI, 50);
      }
    },
    true,
  );

  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) refreshProductStockUI();
  });

  document.addEventListener(
    "click",
    async function (e) {
      const btn = e.target.closest("[data-preview-send]");
      if (!btn || btn.dataset.sheetdbHandling === "1") return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const items = loadCart();
      if (!items.length) {
        await showLeadDialog({
          kicker: "Carrito",
          title: "Carrito vacío",
          buttons: [{ id: "ok", label: "Entendido" }],
        });
        return;
      }
      if (window.LeadMap && !window.LeadMap.hasLocation()) {
        await showLeadDialog({
          kicker: "Ubicación",
          title: "Falta la ubicación",
          message: "Elige el punto de entrega en el mapa de Iquitos.",
          buttons: [{ id: "ok", label: "Entendido" }],
        });
        return;
      }
      btn.disabled = true;
      btn.dataset.sheetdbHandling = "1";
      const prevText = btn.textContent;
      btn.textContent = "Confirmando…";
      try {
        // Stock ya reservado al entrar a #/comprar — no reconsultar ni restar de nuevo
        const form = document.querySelector("[data-checkout]");
        const fd = form ? new FormData(form) : null;
        const name = fd ? String(fd.get("name") || "").trim() : "";
        const phone = fd ? String(fd.get("phone") || "").trim() : "";
        const dni = fd ? String(fd.get("dni") || "").trim() : "";
        const address = fd ? String(fd.get("address") || "").trim() : "";
        const ref = fd ? String(fd.get("ref") || "").trim() : "";
        const mapsLink =
          (window.LeadMap && window.LeadMap.getMapsLinkFromForm()) || "";
        const total = money(
          items.reduce(
            (n, i) => n + Number(i.priceSoles || 0) * Number(i.qty || 0),
            0,
          ),
        );
        const lines = items.map(
          (i) =>
            "• " +
            i.qty +
            " × " +
            i.name +
            " (" +
            variantNote(i.size, i.color) +
            ") — " +
            money(i.priceSoles * i.qty),
        );
        const msg = [
          "Pedido LEAD BAZAR MILITAR",
          "",
          "Prendas",
          ...lines,
          "Total: " + total,
          "",
          "Comprador",
          "Nombre: " + name,
          "Teléfono: " + phone,
          dni ? "DNI: " + dni : null,
          "Ciudad: Iquitos, Loreto",
          "Dirección: " + address,
          mapsLink ? "Google Maps: " + mapsLink : null,
          ref ? "Referencia: " + ref : null,
        ]
          .filter(Boolean)
          .join("\n");
        setReserve(null);
        setBadKeys([]);
        localStorage.setItem(CART_KEY, "[]");
        window.location.href =
          "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
      } catch (err) {
        console.error(err);
        await showLeadDialog({
          kicker: "Error",
          title: "No se pudo confirmar",
          message: String(err.message || err),
          buttons: [{ id: "ok", label: "Entendido" }],
        });
        btn.disabled = false;
        btn.textContent = prevText;
        btn.dataset.sheetdbHandling = "";
      }
    },
    true,
  );

  let scheduled = false;
  function applyLogo() {
    document.querySelectorAll("a.logo").forEach((el) => {
      if (el.getAttribute("aria-label") !== "LEAD BAZAR MILITAR — inicio") {
        el.setAttribute("aria-label", "LEAD BAZAR MILITAR — inicio");
      }
      if (!el.querySelector("img.logo-img")) {
        const svg = el.querySelector("svg");
        const img = document.createElement("img");
        img.src = LOGO;
        img.alt = "LEAD BAZAR MILITAR";
        img.className = "logo-img";
        img.width = 36;
        img.height = 36;
        if (svg) svg.replaceWith(img);
        else el.insertBefore(img, el.firstChild);
      } else {
        const img = el.querySelector("img.logo-img");
        if (img && !img.src.includes("logo.webp")) img.src = LOGO;
      }
      const name = el.querySelector(".logo-name");
      if (name) {
        const strong = name.querySelector("strong");
        const span = name.querySelector("span");
        if (strong && strong.textContent !== "LEAD") strong.textContent = "LEAD";
        if (span && span.textContent !== "BAZAR MILITAR") span.textContent = "BAZAR MILITAR";
      }
    });
    if (currentRoute() === "carrito") markBadCartRows();
    if (currentRoute() === "comprar" && window.LeadMap) window.LeadMap.enhanceBuyerForm();
  }

  function scheduleLogo() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      applyLogo();
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
    try {
      await syncStockFromSheet();
    } catch (e) {
      console.warn("Stock SheetDB:", e);
    }
    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/gh/alvadiaz2008-byte/bold-mint-flora-garden@fe6d9b176af50f8546c6597d913a090ddcbebb69/web/app.js";
    s.onload = function () {
      applyLogo();
      const root = document.querySelector("#app");
      if (root) {
        new MutationObserver(scheduleLogo).observe(root, {
          childList: true,
          subtree: true,
        });
      }
      if (currentRoute() === "comprar") {
        onEnterComprar();
        if (window.LeadMap) {
          setTimeout(window.LeadMap.enhanceBuyerForm, 40);
          setTimeout(window.LeadMap.enhanceBuyerForm, 200);
        }
      }
      if (currentRoute() === "carrito") setTimeout(markBadCartRows, 100);
    };
    document.body.appendChild(s);
  }

  if (app) {
    app.innerHTML =
      '<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><p>LEAD BAZAR MILITAR</p><h1>Cargando catálogo…</h1></div>';
  }
  boot();
})();
