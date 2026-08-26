import { o as __toESM } from "../_runtime.mjs";
import { n as categoryLabel, t as CATEGORIES } from "./catalog-shared-Ul0nMdTI.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search } from "../_libs/lucide-react.mjs";
import { o as Button, r as Route$1 } from "./router-gk9FQjnq.mjs";
import { t as Input } from "./input-RzaKQNIc.mjs";
import { t as ProductGrid } from "./product-grid-C9dLYGye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalogo-CnvimtXN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogoPage() {
	const products = Route$1.useLoaderData();
	const search = Route$1.useSearch();
	const title = search.categoria ? categoryLabel(search.categoria) : "Catálogo";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-primary uppercase",
				children: "Inventario"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-semibold md:text-5xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					products.length,
					" producto",
					products.length === 1 ? "" : "s",
					search.q ? ` para “${search.q}”` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogFilters, {
				categoria: search.categoria,
				q: search.q
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products })
			})
		]
	});
}
function CatalogFilters({ categoria, q }) {
	const navigate = Route$1.useNavigate();
	const [query, setQuery] = (0, import_react.useState)(q ?? "");
	function onSearch(e) {
		e.preventDefault();
		navigate({
			to: "/catalogo",
			search: {
				categoria,
				q: query.trim() || void 0
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: onSearch,
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Buscar por nombre o referencia",
				"aria-label": "Buscar productos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				variant: "secondary",
				size: "icon",
				"aria-label": "Buscar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				to: "/catalogo",
				search: { q },
				active: !categoria,
				children: "Todo"
			}), CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				to: "/catalogo",
				search: {
					categoria: cat.slug,
					q
				},
				active: categoria === cat.slug,
				children: cat.label
			}, cat.slug))]
		})]
	});
}
function FilterChip({ to, search, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: `flex h-11 items-center rounded-full px-4 text-sm ${active ? "bg-primary text-primary-fg" : "bg-elevated text-fg shadow-[var(--shadow-border)]"}`,
		children
	});
}
//#endregion
export { CatalogoPage as component };
