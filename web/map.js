/*! Lead map - Iquitos delivery location */
(function (global) {
  const IQUITOS = { lat: -3.7491, lng: -73.2538, zoom: 13 };
  const IQUITOS_BOUNDS = [
    [-3.9, -73.4],
    [-3.6, -73.1],
  ];
  let leadMap = null;
  let leadMarker = null;
  let leadPick = null;

  function insideIquitos(lat, lng) {
    const [[s, w], [n, e]] = IQUITOS_BOUNDS;
    return lat >= s && lat <= n && lng >= w && lng <= e;
  }

  function googleMapsLink(lat, lng) {
    return "https://www.google.com/maps?q=" + lat + "," + lng;
  }

  /** Notificación con el mismo estilo que stock / producto añadido */
  function showMapToast({ kicker, title, message, buttons }) {
    return new Promise((resolve) => {
      document.querySelector("[data-lead-map-toast]")?.remove();
      const overlay = document.createElement("div");
      overlay.className = "toast-overlay";
      overlay.setAttribute("data-lead-map-toast", "");
      // z-index por encima del modal del mapa (10000)
      overlay.style.zIndex = "10050";
      const btns = (buttons || [{ id: "ok", label: "Entendido" }])
        .map(
          (b, i) =>
            `<button type="button" class="btn ${b.outline ? "outline" : ""}" data-map-toast-btn="${i}">${b.label}</button>`,
        )
        .join("");
      const msgHtml = message
        ? `<p class="lead-toast-msg">${message}</p>`
        : "";
      overlay.innerHTML = `<div class="toast-card" role="dialog" aria-modal="true">
        <p class="kicker">${kicker || "Aviso"}</p>
        <p class="toast-title">${title || ""}</p>
        ${msgHtml}
        <div class="lead-toast-actions">${btns}</div>
      </div>`;
      const dismiss = () => {
        overlay.classList.remove("on");
        overlay.classList.add("off");
        setTimeout(() => overlay.remove(), 200);
      };
      overlay.querySelectorAll("[data-map-toast-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-map-toast-btn"));
          dismiss();
          resolve((buttons || [{ id: "ok" }])[idx]?.id);
        });
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add("on"));
    });
  }

  function injectStyles() {
    if (document.getElementById("lead-map-styles")) return;
    const s = document.createElement("style");
    s.id = "lead-map-styles";
    s.textContent = `
.lead-map-btn-wrap{margin-top:.5rem;display:flex;flex-direction:column;gap:.4rem}
.lead-map-btn-wrap .btn{width:100%}
.lead-map-summary{font-size:.9rem;color:var(--muted,#9b9c90)}
.lead-map-modal{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:1rem}
.lead-map-modal[hidden]{display:none!important}
.lead-map-card{background:#141611;border:1px solid #2a2d24;border-radius:.85rem;width:min(560px,100%);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;color:#ecebe3}
.lead-map-card header{padding:.85rem 1rem;border-bottom:1px solid #2a2d24;display:flex;justify-content:space-between;align-items:center;gap:.5rem}
.lead-map-card header h2{margin:0;font-size:1.1rem}
.lead-map-card .lead-map-actions{padding:.75rem 1rem;border-top:1px solid #2a2d24;display:flex;flex-wrap:wrap;gap:.5rem}
.lead-map-card .lead-map-actions .btn{flex:1 1 auto;min-width:7rem}
#lead-leaflet-map{height:min(52vh,360px);width:100%;background:#1a1c16}
`;
    document.head.appendChild(s);
  }

  function ensureMapModal() {
    if (document.getElementById("lead-map-modal")) return;
    injectStyles();
    const el = document.createElement("div");
    el.id = "lead-map-modal";
    el.className = "lead-map-modal";
    el.hidden = true;
    el.innerHTML =
      '<div class="lead-map-card" role="dialog" aria-modal="true">' +
      "<header><h2>Ubicación en Iquitos</h2>" +
      '<button type="button" class="btn outline" data-map-close>Cerrar</button></header>' +
      '<div id="lead-leaflet-map"></div>' +
      '<div class="lead-map-actions">' +
      '<button type="button" class="btn outline" data-map-geo>Mi ubicación</button>' +
      '<button type="button" class="btn" data-map-confirm>Usar este punto</button>' +
      "</div>" +
      '<p style="padding:0 1rem .85rem;margin:0;color:#9b9c90;font-size:.9rem">Toca el mapa para marcar el punto. Solo dentro de Iquitos.</p>' +
      "</div>";
    document.body.appendChild(el);
    el.querySelector("[data-map-close]").onclick = closeMapModal;
    el.addEventListener("click", (ev) => {
      if (ev.target === el) closeMapModal();
    });
    el.querySelector("[data-map-geo]").onclick = useDeviceLocation;
    el.querySelector("[data-map-confirm]").onclick = confirmMapPick;
  }

  function initLeadMap() {
    if (typeof L === "undefined") {
      showMapToast({
        kicker: "Mapa",
        title: "Mapa no listo",
        message: "El mapa aún no cargó. Espera un momento e intenta de nuevo.",
      });
      return;
    }
    if (leadMap) {
      leadMap.invalidateSize();
      return;
    }
    leadMap = L.map("lead-leaflet-map", {
      maxBounds: IQUITOS_BOUNDS,
      maxBoundsViscosity: 1,
      minZoom: 12,
      maxZoom: 18,
    }).setView([IQUITOS.lat, IQUITOS.lng], IQUITOS.zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leadMap);

    leadMap.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (!insideIquitos(lat, lng)) {
        showMapToast({
          kicker: "Ubicación",
          title: "Fuera de Iquitos",
          message:
            "Solo puedes marcar ubicaciones dentro de Iquitos.\nEl servicio está limitado a la ciudad.",
        });
        return;
      }
      setMapMarker(lat, lng);
    });
  }

  function setMapMarker(lat, lng) {
    leadPick = { lat, lng };
    if (leadMarker) leadMarker.setLatLng([lat, lng]);
    else if (leadMap) {
      leadMarker = L.marker([lat, lng], { draggable: true }).addTo(leadMap);
      leadMarker.on("dragend", () => {
        const p = leadMarker.getLatLng();
        if (!insideIquitos(p.lat, p.lng)) {
          showMapToast({
            kicker: "Ubicación",
            title: "Fuera de Iquitos",
            message: "El punto debe quedar dentro de Iquitos.",
          });
          leadMarker.setLatLng([leadPick.lat, leadPick.lng]);
          return;
        }
        leadPick = { lat: p.lat, lng: p.lng };
      });
    }
    if (leadMap) leadMap.panTo([lat, lng]);
  }

  function openMapModal() {
    ensureMapModal();
    document.getElementById("lead-map-modal").hidden = false;
    requestAnimationFrame(() => {
      initLeadMap();
      if (leadPick) setMapMarker(leadPick.lat, leadPick.lng);
      setTimeout(() => leadMap && leadMap.invalidateSize(), 80);
    });
  }

  function closeMapModal() {
    const m = document.getElementById("lead-map-modal");
    if (m) m.hidden = true;
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) {
      showMapToast({
        kicker: "Ubicación",
        title: "No disponible",
        message: "Tu dispositivo no soporta geolocalización.\nMarca el punto en el mapa.",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (!insideIquitos(lat, lng)) {
          if (leadMap) leadMap.setView([IQUITOS.lat, IQUITOS.lng], IQUITOS.zoom);
          showMapToast({
            kicker: "Ubicación",
            title: "Fuera de Iquitos",
            message:
              "Tu ubicación está fuera de Iquitos.\nEl servicio solo está disponible dentro de la ciudad.\nMarca un punto en el mapa.",
          });
          return;
        }
        setMapMarker(lat, lng);
      },
      () => {
        showMapToast({
          kicker: "Ubicación",
          title: "No se pudo obtener",
          message:
            "No se pudo obtener tu ubicación.\nRevisa los permisos o marca el punto en el mapa.",
        });
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  function confirmMapPick() {
    if (!leadPick) {
      showMapToast({
        kicker: "Ubicación",
        title: "Falta el punto",
        message: "Marca un punto en el mapa o usa «Mi ubicación».",
      });
      return;
    }
    const { lat, lng } = leadPick;
    const label = "Iquitos (" + lat.toFixed(5) + ", " + lng.toFixed(5) + ")";
    const input = document.querySelector('[name="address"]');
    if (input) {
      input.value = label;
      input.dataset.lat = String(lat);
      input.dataset.lng = String(lng);
      input.dataset.maps = googleMapsLink(lat, lng);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const sum = document.querySelector("[data-map-summary]");
    if (sum) {
      sum.textContent = "Ubicación: " + label;
      sum.hidden = false;
    }
    closeMapModal();
  }

  function enhanceBuyerForm() {
    const form = document.querySelector("[data-checkout]");
    if (!form || form.dataset.mapEnhanced === "1") return;
    const field = form.querySelector('[name="address"]');
    if (!field) return;
    form.dataset.mapEnhanced = "1";
    field.readOnly = true;
    field.placeholder = "Elige la ubicación en el mapa";
    field.autocomplete = "off";
    const wrap = document.createElement("div");
    wrap.className = "lead-map-btn-wrap";
    wrap.innerHTML =
      '<button type="button" class="btn" data-open-map>Elegir ubicación en el mapa</button>' +
      '<p class="lead-map-summary" data-map-summary hidden></p>';
    field.insertAdjacentElement("afterend", wrap);
    wrap.querySelector("[data-open-map]").onclick = (e) => {
      e.preventDefault();
      openMapModal();
    };
  }

  function getMapsLinkFromForm() {
    const addrEl = document.querySelector('[name="address"]');
    if (!addrEl) return "";
    if (addrEl.dataset.maps) return addrEl.dataset.maps;
    if (addrEl.dataset.lat && addrEl.dataset.lng) {
      return googleMapsLink(
        Number(addrEl.dataset.lat),
        Number(addrEl.dataset.lng),
      );
    }
    return "";
  }

  function hasLocation() {
    const addrEl = document.querySelector('[name="address"]');
    return !!(addrEl && addrEl.dataset.lat && addrEl.dataset.lng);
  }

  global.LeadMap = {
    enhanceBuyerForm,
    getMapsLinkFromForm,
    hasLocation,
    googleMapsLink,
  };
})(window);
