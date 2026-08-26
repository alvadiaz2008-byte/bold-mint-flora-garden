//#region node_modules/.nitro/vite/services/ssr/assets/catalog-shared-Ul0nMdTI.js
var CATEGORIES = [
	{
		slug: "uniformes",
		label: "Uniformes"
	},
	{
		slug: "calzado",
		label: "Calzado"
	},
	{
		slug: "chalecos",
		label: "Chalecos"
	},
	{
		slug: "mochilas",
		label: "Mochilas"
	},
	{
		slug: "abrigos",
		label: "Abrigos"
	},
	{
		slug: "accesorios",
		label: "Accesorios"
	}
];
var CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label]));
var APPAREL_SIZES = [
	"XS",
	"S",
	"M",
	"L",
	"XL",
	"XXL",
	"XXXL"
];
var FOOTWEAR_SIZES = [
	"38",
	"39",
	"40",
	"41",
	"42",
	"43",
	"44",
	"45",
	"46"
];
var ONE_SIZE = ["Única"];
function formatSoles(value) {
	return new Intl.NumberFormat("es-PE", {
		style: "currency",
		currency: "PEN",
		minimumFractionDigits: 2
	}).format(value);
}
function categoryLabel(slug) {
	return CATEGORY_LABEL[slug] ?? slug;
}
function sizesForCategory(category) {
	if (category === "calzado") return FOOTWEAR_SIZES;
	if (category === "accesorios" || category === "mochilas") return [...ONE_SIZE, ...APPAREL_SIZES];
	return APPAREL_SIZES;
}
//#endregion
export { sizesForCategory as i, categoryLabel as n, formatSoles as r, CATEGORIES as t };
