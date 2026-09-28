export const CATEGORIES = [
  { slug: "uniformes", label: "Uniformes" },
  { slug: "calzado", label: "Calzado" },
  { slug: "chalecos", label: "Chalecos" },
  { slug: "mochilas", label: "Mochilas" },
  { slug: "abrigos", label: "Abrigos" },
  { slug: "gorras", label: "Gorras" },
  { slug: "accesorios", label: "Accesorios" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label]),
);

export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
export const FOOTWEAR_SIZES = [
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
] as const;
export const ONE_SIZE = ["Única"] as const;

export type ProductColor = { name: string; hex: string };

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  priceSoles: number;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  material: string;
  weightG: number | null;
  features: string[];
  specs: Record<string, string>;
  featured: boolean;
  createdAt: string;
};

export type ProductInput = {
  name: string;
  description: string;
  category: string;
  priceSoles: number;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  material: string;
  weightG: number | null;
  features: string[];
  specs: Record<string, string>;
  featured: boolean;
};

export function formatSoles(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);
}

export function categoryLabel(slug: string) {
  return CATEGORY_LABEL[slug] ?? slug;
}

export function sizesForCategory(category: string): readonly string[] {
  if (category === "calzado") return FOOTWEAR_SIZES;
  if (category === "accesorios" || category === "mochilas" || category === "gorras") {
    return [...ONE_SIZE, ...APPAREL_SIZES];
  }
  return APPAREL_SIZES;
}

const NAMED_COLORS: [string, string][] = [
  ["Negro", "#1A1A1A"],
  ["Blanco", "#F4F1E8"],
  ["Gris", "#6E7066"],
  ["Olivo", "#4B5320"],
  ["Verde bosque", "#2F3D24"],
  ["Verde", "#3D6B3A"],
  ["Coyote", "#9A7B4F"],
  ["Khaki", "#A3926B"],
  ["Arena", "#C2A878"],
  ["Beige", "#D4C4A8"],
  ["Marrón", "#6B4423"],
  ["Tan", "#C2B280"],
  ["Azul marino", "#1B2A4A"],
  ["Azul", "#2E4A7A"],
  ["Rojo", "#8B2E2E"],
  ["Naranja", "#C45A1A"],
  ["Amarillo", "#C9B037"],
  ["Morado", "#5A3D6B"],
  ["Selva", "#3D4A2F"],
];

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").padStart(6, "0");
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ];
}

export function autoColorName(hex: string): string {
  const [r, g, b] = hexRgb(hex);
  let best = "Color";
  let bestD = Infinity;
  for (const [name, sample] of NAMED_COLORS) {
    const [sr, sg, sb] = hexRgb(sample);
    const d = (r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2;
    if (d < bestD) {
      bestD = d;
      best = name;
    }
  }
  return best;
}
