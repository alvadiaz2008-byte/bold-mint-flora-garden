import { t as CATEGORIES } from "./catalog-shared-Ul0nMdTI.mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as Route$3, o as Button } from "./router-gk9FQjnq.mjs";
import { t as ProductGrid } from "./product-grid-C9dLYGye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-dFfINw3o.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const products = Route$3.useLoaderData();
	const featured = products.filter((p) => p.featured).slice(0, 8);
	const showcase = featured.length >= 4 ? featured : products.slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-cover bg-center opacity-30",
					style: { backgroundImage: "url(https://images.unsplash.com/photo-1548449112-96a38a64381d?auto=format&fit=crop&w=1600&q=70)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/80" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-end px-4 py-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.28em] text-primary uppercase",
							children: "Equipo de servicio"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 max-w-2xl font-display text-5xl font-semibold tracking-tight md:text-7xl",
							children: "Catálogo táctico para quien sirve."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-lg text-base text-muted md:text-lg",
							children: "Uniformes, calzado, chalecos y accesorios. Vista simple del catálogo; ficha completa al entrar en cada producto. Precios en soles."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/catalogo",
									children: ["Ver catálogo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalogo",
									search: { categoria: "uniformes" },
									children: "Uniformes"
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex items-end justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold",
					children: "Categorías"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
				children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalogo",
					search: { categoria: cat.slug },
					className: "flex min-h-24 flex-col justify-end rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl font-semibold",
						children: cat.label
					})
				}, cat.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold",
					children: "Destacados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalogo",
					className: "text-sm text-muted hover:text-fg",
					children: "Ver todo"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: showcase })]
		})
	] });
}
//#endregion
export { Home as component };
