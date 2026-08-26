import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as cn } from "./router-gk9FQjnq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-image-6D9kmQSq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductImage({ src, alt, className, imgClassName }) {
	const [failed, setFailed] = (0, import_react.useState)(!src);
	if (failed || !src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center justify-center bg-elevated text-center text-xs tracking-wide text-subtle uppercase", className),
		children: alt
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden bg-elevated", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt,
			onError: () => setFailed(true),
			className: cn("size-full object-cover saturate-[0.88] contrast-[1.04]", imgClassName)
		})
	});
}
//#endregion
export { ProductImage as t };
