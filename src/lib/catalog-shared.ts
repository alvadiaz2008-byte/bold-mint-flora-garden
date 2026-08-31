export const CATEGORIES = [
  { slug: "uniformes", label: "Uniformes" },
  { slug: "calzado", label: "Calzado" },
  { slug: "chalecos", label: "Chalecos" },
  { slug: "mochilas", label: "Mochilas" },
  { slug: "abrigos", label: "Abrigos" },
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
  if (category === "accesorios" || category === "mochilas") {
    return [...ONE_SIZE, ...APPAREL_SIZES];
  }
  return APPAREL_SIZES;
}
