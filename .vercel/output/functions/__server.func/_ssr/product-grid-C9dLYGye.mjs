import { n as categoryLabel, r as formatSoles } from "./catalog-shared-Ul0nMdTI.mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ProductImage } from "./product-image-6D9kmQSq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-grid-C9dLYGye.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/producto/$id",
		params: { id: String(product.id) },
		className: "group flex flex-col rounded-xl bg-surface p-2 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-border-hover)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
			src: product.images[0],
			alt: product.name,
			className: "aspect-square rounded-lg",
			imgClassName: "transition-transform duration-300 ease-out group-hover:scale-[1.03]"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-1.5 px-2 pt-3 pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] tracking-[0.18em] text-subtle uppercase",
					children: categoryLabel(product.category)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-semibold leading-snug text-fg",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium tabular-nums text-fg",
						children: formatSoles(product.priceSoles)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: product.colors.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: c.name,
							className: "size-3 rounded-full shadow-[var(--shadow-border)]",
							style: { backgroundColor: c.hex }
						}, c.hex + c.name))
					})]
				})
			]
		})]
	});
}
function ProductGrid({ products }) {
	if (products.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-semibold",
			children: "Sin resultados"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "No hay productos con esos filtros. Prueba otra categoría o búsqueda."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4",
		children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
	});
}
//#endregion
export { ProductGrid as t };
