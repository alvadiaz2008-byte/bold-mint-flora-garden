import { o as __toESM } from "../_runtime.mjs";
import { t as CATEGORIES } from "./catalog-shared-Ul0nMdTI.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { V as notFound, _ as createFileRoute, b as useRouter, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, c as string, i as literal, l as union, n as array, o as object, r as boolean, s as record, t as _enum } from "../_libs/zod.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Search, c as Menu, r as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DupOO0WN.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var categorySlugs = CATEGORIES.map((c) => c.slug);
var colorSchema = object({
	name: string().trim().min(1).max(40),
	hex: string().trim().regex(/^#([0-9a-fA-F]{6})$/, "Color hexadecimal inválido")
});
var productInputSchema = object({
	sku: string().trim().min(3).max(32),
	name: string().trim().min(3).max(120),
	description: string().trim().min(20).max(4e3),
	category: _enum(categorySlugs),
	priceSoles: number().positive().max(99999),
	sizes: array(string().trim().min(1).max(12)).min(1).max(16),
	colors: array(colorSchema).min(1).max(12),
	images: array(string().trim().min(1).max(7e5)).min(1).max(5),
	material: string().trim().min(2).max(160),
	weightG: number().int().positive().max(2e4).nullable(),
	features: array(string().trim().min(2).max(80)).max(12),
	specs: record(string(), string().max(120)),
	featured: boolean()
});
var listProducts = createServerFn({ method: "GET" }).validator(object({
	category: string().optional(),
	q: string().optional()
}).optional()).handler(createSsrRpc("c262ca68ae109a6c858f2d5da3eb05db7ddbdf146772378f0f3fe01eddf97675"));
var getProduct = createServerFn({ method: "GET" }).validator(object({ id: number().int().positive() })).handler(createSsrRpc("bb7e7e2450555d24df3a04bab1583d6f54ed73c3a89806649a7ebbe96e61ca4b"));
var getAdminSession = createServerFn({ method: "GET" }).handler(createSsrRpc("200f626c40a989fed808ca98e83072dd51882a3e2cea488509b83e6ebce19900"));
var loginAdmin = createServerFn({ method: "POST" }).validator(object({ password: string().min(1).max(64) })).handler(createSsrRpc("5fc01cc31578f32f071b13e45df787c9c6b032cf363854912ad880b74693f349"));
var logoutAdmin = createServerFn({ method: "POST" }).handler(createSsrRpc("dba8bd39fda96b7a019343342b65957e685f861683edbecbb0fc2cef3c2f3bbc"));
var createProduct = createServerFn({ method: "POST" }).validator(productInputSchema).handler(createSsrRpc("fbabc9218daf45d932316f94d41999633a70a4fa1dc6bd429ada57b0dbf75dc9"));
var updateProduct = createServerFn({ method: "POST" }).validator(productInputSchema.extend({ id: number().int().positive() })).handler(createSsrRpc("002832a975c273ddcc70d67e9c2c417c9f8eba5dc917f527511d1b21c5108a7a"));
var deleteProduct = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(createSsrRpc("2ee09114606aaec50f620f4ba56b5ae21103647c2dad5c041a85f2d75052e35b"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-gk9FQjnq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Algo salió mal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: error.message || "Ocurrió un error inesperado. Recarga la página."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-2 text-sm text-primary hover:underline",
				children: "Volver al inicio"
			})
		]
	});
}
function AppNotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold",
				children: "No encontrado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm text-muted",
				children: "Ese producto o página no existe en el catálogo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalogo",
				className: "mt-2 text-sm text-primary hover:underline",
				children: "Ver catálogo"
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Logo({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("flex items-center gap-2.5 text-fg", className),
		"aria-label": "ATLAS TÁCTICO — inicio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "size-8 shrink-0",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 2.5 28 8.2v7.4c0 7.2-5.1 12.6-12 14.9C9.1 28.2 4 22.8 4 15.6V8.2L16 2.5Z",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 8.2 22.4 22h-2.6l-1.2-2.8h-5.2L12.2 22H9.6L16 8.2Zm-3 8.6h6L16 12.2 13 16.8Z",
				fill: "currentColor"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex flex-col leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg font-semibold tracking-[0.18em]",
				children: "ATLAS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[0.65rem] font-medium tracking-[0.32em] text-primary",
				children: "TÁCTICO"
			})]
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-elevated",
			ghost: "bg-transparent text-fg hover:bg-elevated",
			danger: "bg-danger text-fg hover:opacity-90",
			link: "bg-transparent text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4 text-sm",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var NAV = [{
	to: "/",
	label: "Inicio"
}, {
	to: "/catalogo",
	label: "Catálogo"
}];
function SiteChrome() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden border-b border-border bg-surface px-4 py-1.5 text-center text-[0.7rem] tracking-[0.22em] text-muted uppercase sm:block",
						children: "Catálogo de equipo táctico · Personal militar y de seguridad"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "hidden items-center gap-1 md:flex",
								"aria-label": "Principal",
								children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("flex h-11 items-center px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg", pathname === item.to && "text-fg"),
									children: item.label
								}, item.to)), CATEGORIES.slice(0, 4).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalogo",
									search: { categoria: cat.slug },
									className: "flex h-11 items-center px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg",
									children: cat.label
								}, cat.slug))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/catalogo",
										className: "flex size-11 items-center justify-center text-muted hover:text-fg",
										"aria-label": "Buscar en el catálogo",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin",
										className: cn("hidden h-11 items-center px-3 text-sm font-medium text-muted hover:text-fg md:flex", pathname.startsWith("/admin") && "text-fg"),
										children: "Administrador"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "md:hidden",
										"aria-label": open ? "Cerrar menú" : "Abrir menú",
										onClick: () => setOpen((v) => !v),
										children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
									})
								]
							})
						]
					}),
					open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border bg-surface px-4 py-3 md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-col",
							"aria-label": "Móvil",
							children: [
								NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									onClick: () => setOpen(false),
									className: "flex h-12 items-center text-sm font-medium",
									children: item.label
								}, item.to)),
								CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalogo",
									search: { categoria: cat.slug },
									onClick: () => setOpen(false),
									className: "flex h-12 items-center text-sm font-medium text-muted",
									children: cat.label
								}, cat.slug)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin",
									onClick: () => setOpen(false),
									className: "flex h-12 items-center text-sm font-medium",
									children: "Administrador"
								})
							]
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xs text-sm text-muted",
							children: "Catálogo de ropa y equipo para personal militar. Precios en soles."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.2em] text-subtle uppercase",
							children: "Categorías"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1",
							children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalogo",
								search: { categoria: cat.slug },
								className: "text-sm text-muted hover:text-fg",
								children: cat.label
							}) }, cat.slug))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.2em] text-subtle uppercase",
							children: "Catálogo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalogo",
								className: "hover:text-fg",
								children: "Ver todo"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "hover:text-fg",
								children: "Administrador"
							}) })]
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border px-4 py-4 text-center text-xs text-subtle",
					children: "ATLAS TÁCTICO · Catálogo de referencia · Precios en S/"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				richColors: false
			})
		]
	});
}
var styles_default = "/assets/styles-Bmye9bhh.css";
var APP_NAME = "ATLAS TÁCTICO";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Catálogo de ropa y equipo táctico para personal militar. Precios en soles."
			},
			{
				name: "theme-color",
				content: "#0b0c0a"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$3 = () => import("./routes-dFfINw3o.mjs");
var Route$3 = createFileRoute("/")({
	loader: () => listProducts(),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin-_GvdvezC.mjs");
var Route$2 = createFileRoute("/admin")({
	loader: async () => {
		const session = await getAdminSession();
		const products = session.ok ? await listProducts() : [];
		return {
			ok: session.ok,
			products
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./catalogo-CnvimtXN.mjs");
var Route$1 = createFileRoute("/catalogo")({
	validateSearch: (search) => ({
		categoria: typeof search.categoria === "string" ? search.categoria : void 0,
		q: typeof search.q === "string" ? search.q : void 0
	}),
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => listProducts({ data: {
		category: deps.categoria,
		q: deps.q
	} }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./producto._id-DFlCc0II.mjs");
var Route = createFileRoute("/producto/$id")({
	loader: async ({ params }) => {
		const id = Number(params.id);
		if (!Number.isFinite(id) || id <= 0) throw notFound();
		const data = await getProduct({ data: { id } });
		if (!data.product) throw notFound();
		return {
			product: data.product,
			related: data.related
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	AdminRoute: Route$2.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$4
	}),
	CatalogoRoute: Route$1.update({
		id: "/catalogo",
		path: "/catalogo",
		getParentRoute: () => Route$4
	}),
	ProductoIdRoute: Route.update({
		id: "/producto/$id",
		path: "/producto/$id",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultNotFoundComponent: AppNotFoundComponent
	});
}
//#endregion
export { Route$3 as a, createProduct as c, logoutAdmin as d, updateProduct as f, Route$2 as i, deleteProduct as l, Route as n, Button as o, Route$1 as r, cn as s, router_exports as t, loginAdmin as u };
