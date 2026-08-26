import { o as __toESM } from "../_runtime.mjs";
import { n as categoryLabel, r as formatSoles } from "./catalog-shared-Ul0nMdTI.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Check } from "../_libs/lucide-react.mjs";
import { n as Route, s as cn } from "./router-gk9FQjnq.mjs";
import { t as ProductImage } from "./product-image-6D9kmQSq.mjs";
import { t as ProductGrid } from "./product-grid-C9dLYGye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/producto._id-DFlCc0II.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-elevated px-2.5 py-1 text-xs font-medium tracking-wide text-muted uppercase", className),
		...props
	});
}
function ProductDetail({ product, related }) {
	const [imageIndex, setImageIndex] = (0, import_react.useState)(0);
	const [size, setSize] = (0, import_react.useState)(product.sizes[0] ?? "");
	const [color, setColor] = (0, import_react.useState)(product.colors[0]?.name ?? "");
	const selectedColor = (0, import_react.useMemo)(() => product.colors.find((c) => c.name === color) ?? product.colors[0], [color, product.colors]);
	const main = product.images[imageIndex] ?? product.images[0];
	const specEntries = Object.entries(product.specs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mb-6 flex flex-wrap items-center gap-2 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-fg",
						children: "Inicio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalogo",
						search: { categoria: product.category },
						className: "hover:text-fg",
						children: categoryLabel(product.category)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row",
					children: [product.images.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 sm:w-20 sm:flex-col",
						children: product.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setImageIndex(i),
							className: `size-16 overflow-hidden rounded-md sm:size-20 ${i === imageIndex ? "ring-2 ring-primary" : "shadow-[var(--shadow-border)]"}`,
							"aria-label": `Foto ${i + 1}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
								src,
								alt: "",
								className: "size-full"
							})
						}, src + i))
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
						src: main,
						alt: product.name,
						className: "aspect-square w-full rounded-xl"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: categoryLabel(product.category) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-sm text-muted",
						children: ["Ref. ", product.sku]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-display text-4xl font-semibold tabular-nums",
						children: formatSoles(product.priceSoles)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Precio en soles (PEN)"
					}),
					product.colors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
							className: "text-xs font-medium tracking-[0.18em] text-subtle uppercase",
							children: ["Color: ", selectedColor?.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: product.colors.map((c) => {
								const active = c.name === color;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setColor(c.name),
									className: `flex h-11 items-center gap-2 rounded-full px-3 text-sm shadow-[var(--shadow-border)] ${active ? "ring-2 ring-primary" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "size-4 rounded-full",
											style: { backgroundColor: c.hex }
										}),
										c.name,
										active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : null
									]
								}, c.name);
							})
						})]
					}) : null,
					product.sizes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
							className: "text-xs font-medium tracking-[0.18em] text-subtle uppercase",
							children: ["Talla: ", size]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: product.sizes.map((s) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSize(s),
									className: `flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm ${s === size ? "bg-primary text-primary-fg" : "bg-elevated text-fg shadow-[var(--shadow-border)]"}`,
									children: s
								}, s);
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-sm leading-relaxed text-muted",
						children: product.description
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 grid gap-8 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Características"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2",
						children: [product.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-primary" }), f]
						}, f)), product.features.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted",
							children: "Sin características extra."
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold",
						children: "Ficha técnica"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 divide-y divide-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Material"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: product.material || "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Peso"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right tabular-nums",
									children: product.weightG ? `${product.weightG} g` : "—"
								})]
							}),
							specEntries.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-right",
									children: v
								})]
							}, k))
						]
					})]
				})]
			}),
			related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 font-display text-3xl font-semibold",
					children: "Relacionados"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: related })]
			}) : null
		]
	});
}
function ProductPage() {
	const { product, related } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetail, {
		product,
		related
	});
}
//#endregion
export { ProductPage as component };
