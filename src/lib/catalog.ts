import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { getSql } from "@/lib/db";
import type { Product, ProductColor, ProductInput } from "@/lib/catalog-shared";
import { CATEGORIES } from "@/lib/catalog-shared";

const ADMIN_COOKIE = "atlas_admin";
const ADMIN_PASSWORD = "589";
const TOKEN_SECRET = new TextEncoder().encode(
  "atlas-tactico-admin-hmac-key-32ch",
);

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

const colorSchema = z.object({
  name: z.string().trim().min(1).max(40),
  hex: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, "Color hexadecimal inválido"),
});

const productInputSchema = z.object({
  sku: z.string().trim().min(3).max(32),
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(4000),
  category: z.enum(categorySlugs),
  priceSoles: z.number().positive().max(99999),
  sizes: z.array(z.string().trim().min(1).max(12)).min(1).max(16),
  colors: z.array(colorSchema).min(1).max(12),
  images: z.array(z.string().trim().min(1).max(700_000)).min(1).max(5),
  material: z.string().trim().min(2).max(160),
  weightG: z.number().int().positive().max(20000).nullable(),
  features: z.array(z.string().trim().min(2).max(80)).max(12),
  specs: z.record(z.string(), z.string().max(120)),
  featured: z.boolean(),
});

type ProductRow = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  price_soles: unknown;
  sizes: unknown;
  colors: unknown;
  images: unknown;
  material: string;
  weight_g: number | null;
  features: unknown;
  specs: unknown;
  featured: boolean;
  created_at: string | Date;
};

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return trimmed.replace(/^{|}$/g, "").split(",").map((s) => s.replace(/^"|"$/g, "").trim()).filter(Boolean);
    }
  }
  return [];
}

function asColors(value: unknown): ProductColor[] {
  const raw = typeof value === "string" ? safeJson(value) : value;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const rec = item as Record<string, unknown>;
      const name = String(rec.name ?? "").trim();
      const hex = String(rec.hex ?? "").trim();
      if (!name || !hex) return null;
      return { name, hex };
    })
    .filter((c): c is ProductColor => c !== null);
}

function asSpecs(value: unknown): Record<string, string> {
  const raw = typeof value === "string" ? safeJson(value) : value;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (k) out[k] = String(v ?? "");
  }
  return out;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function asMoney(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asIso(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapProduct(row: ProductRow): Product {
  return {
    id: Number(row.id),
    sku: row.sku,
    name: row.name,
    description: row.description,
    category: row.category,
    priceSoles: asMoney(row.price_soles),
    sizes: asStringArray(row.sizes),
    colors: asColors(row.colors),
    images: asStringArray(row.images),
    material: row.material ?? "",
    weightG: row.weight_g === null || row.weight_g === undefined ? null : Number(row.weight_g),
    features: asStringArray(row.features),
    specs: asSpecs(row.specs),
    featured: Boolean(row.featured),
    createdAt: asIso(row.created_at),
  };
}

async function signAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(TOKEN_SECRET);
}

async function isAdminFromCookie() {
  const token = getCookie(ADMIN_COOKIE);
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, TOKEN_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

async function requireAdmin() {
  if (!(await isAdminFromCookie())) {
    throw new Error("No autorizado");
  }
}

const SELECT_FIELDS = `
  id, sku, name, description, category, price_soles, sizes, colors, images,
  material, weight_g, features, specs, featured, created_at
`;

export const listProducts = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        category: z.string().optional(),
        q: z.string().optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const category = data?.category?.trim() || "";
    const q = data?.q?.trim() || "";
    let rows: ProductRow[];
    if (category && q) {
      const like = `%${q}%`;
      rows = await sql.query<ProductRow>(
        `select ${SELECT_FIELDS} from products
         where category = $1 and (name ilike $2 or sku ilike $2 or description ilike $2)
         order by created_at desc`,
        [category, like],
      );
    } else if (category) {
      rows = await sql.query<ProductRow>(
        `select ${SELECT_FIELDS} from products where category = $1 order by created_at desc`,
        [category],
      );
    } else if (q) {
      const like = `%${q}%`;
      rows = await sql.query<ProductRow>(
        `select ${SELECT_FIELDS} from products
         where name ilike $1 or sku ilike $1 or description ilike $1
         order by created_at desc`,
        [like],
      );
    } else {
      rows = await sql.query<ProductRow>(
        `select ${SELECT_FIELDS} from products order by created_at desc`,
      );
    }
    return rows.map(mapProduct);
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query<ProductRow>(
      `select ${SELECT_FIELDS} from products where id = $1 limit 1`,
      [data.id],
    );
    const product = rows[0] ? mapProduct(rows[0]) : null;
    if (!product) return { product: null, related: [] as Product[] };
    const relatedRows = await sql.query<ProductRow>(
      `select ${SELECT_FIELDS} from products
       where category = $1 and id <> $2
       order by featured desc, created_at desc
       limit 4`,
      [product.category, product.id],
    );
    return { product, related: relatedRows.map(mapProduct) };
  });

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async () => {
    return { ok: await isAdminFromCookie() };
  },
);

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(64) }))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
      throw new Error("Contraseña incorrecta");
    }
    const token = await signAdminToken();
    setCookie(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
      secure: process.env.NODE_ENV === "production",
    });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(
  async () => {
    deleteCookie(ADMIN_COOKIE);
    return { ok: true as const };
  },
);

export const createProduct = createServerFn({ method: "POST" })
  .validator(productInputSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const sql = await getSql();
    const rows = await sql.query<{ id: number }>(
      `insert into products (
         sku, name, description, category, price_soles, sizes, colors, images,
         material, weight_g, features, specs, featured
       ) values (
         $1,$2,$3,$4,$5,$6::text[],$7::jsonb,$8::text[],$9,$10,$11::text[],$12::jsonb,$13
       ) returning id`,
      toInsertParams(data),
    );
    return { id: Number(rows[0]?.id) };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .validator(productInputSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, ...input } = data;
    const sql = await getSql();
    const params = toInsertParams(input);
    await sql.query(
      `update products set
         sku=$1, name=$2, description=$3, category=$4, price_soles=$5,
         sizes=$6::text[], colors=$7::jsonb, images=$8::text[], material=$9,
         weight_g=$10, features=$11::text[], specs=$12::jsonb, featured=$13
       where id=$14`,
      [...params, id],
    );
    return { id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const sql = await getSql();
    await sql.query(`delete from products where id = $1`, [data.id]);
    return { ok: true as const };
  });

function toInsertParams(data: ProductInput): unknown[] {
  return [
    data.sku.toUpperCase(),
    data.name,
    data.description,
    data.category,
    data.priceSoles,
    data.sizes,
    JSON.stringify(data.colors),
    data.images,
    data.material,
    data.weightG,
    data.features,
    JSON.stringify(data.specs),
    data.featured,
  ];
}
