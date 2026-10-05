(function () {
  const STORE_KEY = "atlas-tactico-store-v1";
  const CART_KEY = "atlas-tactico-cart-v1";
  const STOCK_CACHE_KEY = "lead-stock-cache-v1";
  const SHEETDB = "https://sheetdb.io/api/v1/jrxq3blppmk92";
  const WHATSAPP = "51955802712";
  const app = document.querySelector("#app");

  const style = document.createElement("style");
  style.textContent = `
.hero-bg {
  background: url("public/logo.png") center/contain no-repeat !important;
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
`;
  document.head.appendChild(style);

  function rowKey(productId, size, color) {
    return String(productId) + "|" + String(size || "Sin talla") + "|" + String(color || "");
  }

  function loadProducts() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const list = raw ? JSON.parse(raw) : [];
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
      const errText = await res.text().catch(() => "");
      console.warn("SheetDB seed failed", res.status, errText);
      throw new Error(
        "La hoja de Excel está vacía. En la fila 1 pon: key | product_id | sku | name | size | color | stock",
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
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error("No se pudo actualizar el stock. Intenta de nuevo.");
    }
  }

  function money(n) {
    return "S/ " + Number(n || 0).toFixed(2);
  }

  function variantNote(size, color) {
    const s = size && size !== "Sin talla" ? size : null;
    if (s && color) return s + " / " + color;
    return color || s || "—";
  }

  function stockMapFromRows(rows) {
    const map = {};
    rows.forEach((r) => {
      const k = r.key || rowKey(r.product_id, r.size, r.color);
      map[k] = Math.max(0, Number(r.stock) || 0);
    });
    return map;
  }

  /** Solo verifica stock (sin descontar). Devuelve mensaje de error o null si está bien. */
  function checkStockMessage(items, map) {
    for (const item of items) {
      const size = item.size || "Sin talla";
      const k = rowKey(item.productId, size, item.color);
      const need = Math.max(1, Number(item.qty) || 1);
      const have = map[k];
      const label =
        (item.name || "Producto") +
        " (" +
        variantNote(size, item.color) +
        ")";

      if (have == null) {
        return (
          "No hay stock registrado en el Excel para:\n\n" +
          label +
          "\n\nAgrega esa variante en la hoja o revisa el key."
        );
      }
      if (have < need) {
        return (
          "Stock insuficiente para:\n\n" +
          label +
          "\n\nDisponible: " +
          have +
          "\nEn tu pedido: " +
          need +
          "\n\nReduce la cantidad o elige otra variante."
        );
      }
    }
    return null;
  }

  /** Consulta Excel y valida el carrito. Actualiza caché local. */
  async function validateCartAgainstSheet(items) {
    const rows = await fetchSheetStock();
    const map = stockMapFromRows(rows);
    applyStockRows(rows);
    const msg = checkStockMessage(items, map);
    if (msg) throw new Error(msg);
    return map;
  }

  /** Valida y descuenta en Excel (al confirmar pedido). */
  async function confirmPurchaseWithSheet(items) {
    const map = await validateCartAgainstSheet(items);

    for (const item of items) {
      const size = item.size || "Sin talla";
      const k = rowKey(item.productId, size, item.color);
      const need = Math.max(1, Number(item.qty) || 1);

      // Segunda lectura por variante (por si alguien compró al mismo tiempo)
      const freshRows = await fetchSheetStock();
      const freshMap = stockMapFromRows(freshRows);
      const have = freshMap[k];
      if (have == null || have < need) {
        applyStockRows(freshRows);
        throw new Error(
          checkStockMessage([item], freshMap) ||
            "Stock insuficiente. El pedido no se confirmó.",
        );
      }

      const next = Math.max(0, have - need);
      await patchStock(k, next);
      map[k] = next;
      freshMap[k] = next;
      applyStockRows(
        Object.keys(freshMap).map((key) => {
          const parts = key.split("|");
          return {
            key,
            product_id: parts[0],
            size: parts[1],
            color: parts[2],
            stock: freshMap[key],
          };
        }),
      );
    }
  }

  let scheduled = false;
  function applyLogo() {
    document.querySelectorAll("a.logo").forEach((el) => {
      if (el.getAttribute("aria-label") !== "LEAD BAZAR MILITAR — inicio") {
        el.setAttribute("aria-label", "LEAD BAZAR MILITAR — inicio");
      }
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
        if (strong && strong.textContent !== "LEAD") strong.textContent = "LEAD";
        if (span && span.textContent !== "BAZAR MILITAR") span.textContent = "BAZAR MILITAR";
      }
    });
  }

  function scheduleLogo() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      applyLogo();
    });
  }

  /** Al enviar el formulario (Revisar pedido): consulta stock y avisa qué prenda falta */
  document.addEventListener(
    "submit",
    async function (e) {
      const form = e.target.closest("[data-checkout]");
      if (!form || form.dataset.stockChecked === "1") return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const items = loadCart();
      if (!items.length) {
        alert("El carrito está vacío.");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const prev = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Consultando stock…";
      }

      try {
        await validateCartAgainstSheet(items);
        form.dataset.stockChecked = "1";
        if (btn) {
          btn.disabled = false;
          btn.textContent = prev;
        }
        form.requestSubmit();
        setTimeout(function () {
          form.dataset.stockChecked = "";
        }, 500);
      } catch (err) {
        console.error(err);
        alert(err.message || "No se pudo verificar el stock.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = prev;
        }
      }
    },
    true,
  );

  /** Confirmar y abrir WhatsApp: vuelve a consultar, descuenta y confirma */
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
        alert("El carrito está vacío.");
        return;
      }

      btn.disabled = true;
      btn.dataset.sheetdbHandling = "1";
      const prevText = btn.textContent;
      btn.textContent = "Verificando stock…";

      try {
        await confirmPurchaseWithSheet(items);

        const form = document.querySelector("[data-checkout]");
        const fd = form ? new FormData(form) : null;
        const name = fd ? String(fd.get("name") || "").trim() : "";
        const phone = fd ? String(fd.get("phone") || "").trim() : "";
        const dni = fd ? String(fd.get("dni") || "").trim() : "";
        const address = fd ? String(fd.get("address") || "").trim() : "";
        const ref = fd ? String(fd.get("ref") || "").trim() : "";

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
          ref ? "Referencia: " + ref : null,
        ]
          .filter(Boolean)
          .join("\n");

        localStorage.setItem(CART_KEY, "[]");
        window.location.href =
          "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
      } catch (err) {
        console.error(err);
        alert(err.message || "No se pudo confirmar el pedido.");
        btn.disabled = false;
        btn.textContent = prevText;
        btn.dataset.sheetdbHandling = "";
        try {
          await syncStockFromSheet();
        } catch (_) {}
      }
    },
    true,
  );

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
      window.addEventListener("hashchange", scheduleLogo);
    };
    document.body.appendChild(s);
  }

  if (app) {
    app.innerHTML =
      '<div class="wrap" style="padding:3rem 1rem;color:#ecebe3"><p>LEAD BAZAR MILITAR</p><h1>Cargando catálogo…</h1></div>';
  }
  boot();
})();
