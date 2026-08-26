import { t as CATEGORIES } from "./catalog-shared-Ul0nMdTI.mjs";
import { a as getCookie, i as deleteCookie$1, n as TSS_SERVER_FUNCTION, o as setCookie$1, t as createServerFn } from "./ssr.mjs";
import { a as number, c as string, n as array, o as object, r as boolean, s as record, t as _enum } from "../_libs/zod.mjs";
import { n as jwtVerify, t as SignJWT } from "../_libs/jose.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-kOUOnZfw.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_products_default = "create table if not exists products (\n  id serial primary key,\n  sku text not null unique,\n  name text not null,\n  description text not null,\n  category text not null,\n  price_soles numeric(10, 2) not null,\n  sizes text[] not null default '{}',\n  colors jsonb not null default '[]',\n  images text[] not null default '{}',\n  material text not null default '',\n  weight_g integer,\n  features text[] not null default '{}',\n  specs jsonb not null default '{}',\n  featured boolean not null default false,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists products_category_idx on products (category);\ncreate index if not exists products_created_at_idx on products (created_at desc);\n\ninsert into products (\n  sku, name, description, category, price_soles, sizes, colors, images,\n  material, weight_g, features, specs, featured\n) values\n(\n  'ATL-UNI-001',\n  'Camiseta táctica Dry-Fit',\n  $d$Camiseta de servicio en tejido Dry-Fit de secado rápido. Corte atlético que no estorba bajo chaleco o placa. Costuras planas en hombros y costados para reducir rozaduras en jornadas largas. Cuello redondo reforzado que no se deforma con el lavado.$d$,\n  'uniformes',\n  89.00,\n  array['S','M','L','XL','XXL'],\n  '[{\"name\":\"Olivo\",\"hex\":\"#4B5320\"},{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Coyote\",\"hex\":\"#9A7B4F\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Poliéster Dry-Fit 160 g/m²',\n  180,\n  array['Secado rápido','Anti-olor','Costuras planas','Cuello reforzado'],\n  '{\"Uso\":\"Instrucción y servicio diario\",\"Corte\":\"Atlético\",\"Cuidado\":\"Lavado a 30 °C\"}'::jsonb,\n  true\n),\n(\n  'ATL-UNI-002',\n  'Pantalón cargo Ripstop 6 bolsillos',\n  $d$Pantalón de faena en ripstop polialgodón. Seis bolsillos de carga con fuelle, rodillas reforzadas y pretina con elástico interior para mantener el pantalón en su sitio con cinturón rigger. Tela que no se abre en desgarro y resiste rozadura de monte.$d$,\n  'uniformes',\n  189.00,\n  array['S','M','L','XL','XXL','XXXL'],\n  '[{\"name\":\"Olivo\",\"hex\":\"#4B5320\"},{\"name\":\"Khaki\",\"hex\":\"#A3926B\"},{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Ripstop 65% poliéster / 35% algodón',\n  520,\n  array['6 bolsillos de carga','Rodilla reforzada','Ripstop anti-desgarro','Pretina con elástico'],\n  '{\"Uso\":\"Faena y patrulla\",\"Cierre\":\"Botón y bragueta\",\"Cuidado\":\"Lavado industrial suave\"}'::jsonb,\n  true\n),\n(\n  'ATL-CAL-001',\n  'Bota de combate 8\" cuero y cordura',\n  $d$Bota de caña 8 pulgadas con capellada de cuero full-grain y cordura 1000D. Suela de goma de alta tracción, plantilla amortiguada y puntera reforzada. Pensada para marcha con equipo y terreno mixto. Cremallera lateral con fuelle para calzar rápido sin perder sello.$d$,\n  'calzado',\n  349.00,\n  array['38','39','40','41','42','43','44','45'],\n  '[{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Coyote\",\"hex\":\"#9A7B4F\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1539185441755-769473a23584?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Cuero full-grain y Cordura 1000D',\n  1480,\n  array['Caña 8 pulgadas','Cremallera lateral','Suela de alta tracción','Puntera reforzada'],\n  '{\"Altura\":\"8 pulgadas\",\"Suela\":\"Goma vibram-style\",\"Plantilla\":\"EVA extraíble\"}'::jsonb,\n  true\n),\n(\n  'ATL-CHA-001',\n  'Chaleco táctico MOLLE',\n  $d$Chaleco portaplacas ligero con trama MOLLE en pecho, espalda y costados. Ajuste de hombros y cinchas laterales. Compatible con placas blandas o rígidas de talla estándar. Malla interior para ventilación. Pensado para instrucción, seguridad y servicio, no como disfraz.$d$,\n  'chalecos',\n  279.00,\n  array['S','M','L','XL','XXL'],\n  '[{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Olivo\",\"hex\":\"#4B5320\"},{\"name\":\"Coyote\",\"hex\":\"#9A7B4F\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1544022613-e87caecea06c?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Nylon 500D con malla 3D',\n  890,\n  array['Trama MOLLE completa','Ajuste de hombros y costado','Compatible con placa estándar','Malla interior ventilada'],\n  '{\"Placas\":\"SAPI / ESAPI talla M-L\",\"Peso vacío\":\"890 g\",\"Cierre\":\"Cinchas laterales\"}'::jsonb,\n  true\n),\n(\n  'ATL-MOC-001',\n  'Mochila de asalto 40 L',\n  $d$Mochila de 40 litros con compartimento principal de boca amplia, bolsillo de hidratación, correas de compresión y panel MOLLE frontal. Espalda acolchada con canal de aire. Cinturón lumbar desmontable. Sirve para salida de 24–48 h o transporte de equipo de instrucción.$d$,\n  'mochilas',\n  229.00,\n  array['Única'],\n  '[{\"name\":\"Olivo\",\"hex\":\"#4B5320\"},{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Coyote\",\"hex\":\"#9A7B4F\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Nylon 600D ripstop',\n  1100,\n  array['40 litros','Panel MOLLE','Hidratación 3 L','Cinturón lumbar desmontable'],\n  '{\"Capacidad\":\"40 L\",\"Hidratación\":\"Funda para vejiga 3 L\",\"Dimensiones\":\"54 × 32 × 22 cm\"}'::jsonb,\n  false\n),\n(\n  'ATL-ACC-001',\n  'Gorra operator con velcro',\n  $d$Gorra de perfil bajo con visera curva, ajuste de velcro posterior y panel de velcro frontal para parche. Tejido ripstop ligero, interior con cinta anti-sudor. No deforma con el sol ni el lavado a mano.$d$,\n  'accesorios',\n  45.00,\n  array['S/M','L/XL'],\n  '[{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Olivo\",\"hex\":\"#4B5320\"},{\"name\":\"Arena\",\"hex\":\"#C2A878\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Ripstop poliéster',\n  85,\n  array['Panel velcro para parche','Ajuste posterior','Cinta anti-sudor','Perfil bajo'],\n  '{\"Perfil\":\"Bajo\",\"Visera\":\"Curva\",\"Parche\":\"Velcro 8 × 5 cm\"}'::jsonb,\n  false\n),\n(\n  'ATL-ABR-001',\n  'Chaqueta softshell cortaviento',\n  $d$Softshell de tres capas: exterior elástico cortaviento, membrana transpirable y interior de micropolar. Capucha ajustable que entra bajo casco, axilas con cremallera de ventilación y bolsillos altos para usar con chaleco. Ideal para frío seco de sierra y viento en costa.$d$,\n  'abrigos',\n  259.00,\n  array['S','M','L','XL','XXL'],\n  '[{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Olivo\",\"hex\":\"#4B5320\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1544022613-e87caecea06c?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Softshell 3 capas, membrana TPU',\n  640,\n  array['Cortaviento','Capucha bajo casco','Cremalleras de axila','Bolsillos altos'],\n  '{\"Clima\":\"Frío seco y viento\",\"Capucha\":\"Ajustable, casco-compatible\",\"Cuidado\":\"No usar suavizante\"}'::jsonb,\n  true\n),\n(\n  'ATL-ACC-002',\n  'Guantes tácticos con nudillo',\n  $d$Guantes de dedo completo con palma de cuero sintético antideslizante, nudillos termoplásticos y dorso transpirable. Dedo índice y pulgar táctiles para pantalla. Muñeca con velcro. Protección sin perder destreza para arma, volante o herramientas.$d$,\n  'accesorios',\n  69.00,\n  array['S','M','L','XL'],\n  '[{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Olivo\",\"hex\":\"#4B5320\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1588345921523-c2dcd7f38b0d?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Piel sintética, spandex y TPR',\n  120,\n  array['Nudillo rígido','Palma antideslizante','Punta táctil','Cierre de velcro'],\n  '{\"Dedos\":\"Completos\",\"Pantalla\":\"Índice y pulgar táctiles\",\"Par\":\"Incluye ambos\"}'::jsonb,\n  false\n),\n(\n  'ATL-ACC-003',\n  'Cinturón rigger 45 mm',\n  $d$Cinturón de 45 mm en nylon de alta densidad con hebilla de doble barra. No tiene agujeros: se ajusta al milímetro y no afloja con el peso del equipo. Compatible con fundas y portaequipo de cintura. Largo recortable.$d$,\n  'accesorios',\n  55.00,\n  array['Única'],\n  '[{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"},{\"name\":\"Coyote\",\"hex\":\"#9A7B4F\"},{\"name\":\"Olivo\",\"hex\":\"#4B5320\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Nylon 45 mm, hebilla acetal',\n  160,\n  array['Ancho 45 mm','Ajuste continuo','Hebilla de doble barra','Largo recortable'],\n  '{\"Ancho\":\"45 mm\",\"Largo\":\"Hasta 125 cm, recortable\",\"Hebilla\":\"Acetal de doble barra\"}'::jsonb,\n  false\n),\n(\n  'ATL-ABR-002',\n  'Poncho impermeable 3 en 1',\n  $d$Poncho de nylon recubierto que cubre al usuario con mochila puesta. Se convierte en toldo ligero con las ojetes de esquina y, plegado, en capa de suelo. Costuras termoselladas. No es traje de lluvia de ciudad: está cortado para servicio a campo.$d$,\n  'abrigos',\n  119.00,\n  array['Única'],\n  '[{\"name\":\"Olivo\",\"hex\":\"#4B5320\"},{\"name\":\"Negro\",\"hex\":\"#1A1A1A\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Nylon 210T recubierto PU',\n  380,\n  array['Impermeable','Cubre mochila','Ojetes para toldo','Costuras termoselladas'],\n  '{\"Modos\":\"Poncho, toldo, suelo\",\"Índice agua\":\"3000 mm\",\"Empaque\":\"Bolsa incluida\"}'::jsonb,\n  false\n),\n(\n  'ATL-UNI-003',\n  'Conjunto camuflaje selva',\n  $d$Camisa y pantalón de camuflaje selva en ripstop. Camisa de manga larga con bolsillos de pecho, hombreras y puños ajustables. Pantalón con bolsillos cargo y pretina reforzada. Patrón de selva de alto contraste para monte húmedo. Se vende como conjunto.$d$,\n  'uniformes',\n  320.00,\n  array['S','M','L','XL','XXL'],\n  '[{\"name\":\"Selva\",\"hex\":\"#3D4A2F\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1548449112-96a38a64381d?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Ripstop polialgodón, estampado selva',\n  980,\n  array['Conjunto camisa + pantalón','Bolsillos de pecho y cargo','Puños ajustables','Ripstop'],\n  '{\"Incluye\":\"Camisa y pantalón\",\"Patrón\":\"Selva\",\"Manga\":\"Larga, arremangable\"}'::jsonb,\n  true\n),\n(\n  'ATL-CAL-002',\n  'Bota desierto transpirable',\n  $d$Bota de caña media para clima cálido. Malla y gamuza en la capellada para ventilación, suela de goma que no se ablanda en asfalto caliente y plantilla extraíble. Menos peso que la bota de combate 8\". Indicada para costa y zonas áridas.$d$,\n  'calzado',\n  299.00,\n  array['38','39','40','41','42','43','44','45','46'],\n  '[{\"name\":\"Arena\",\"hex\":\"#C2A878\"},{\"name\":\"Coyote\",\"hex\":\"#9A7B4F\"}]'::jsonb,\n  array[\n    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',\n    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80'\n  ],\n  'Gamuza, malla y suela de goma',\n  980,\n  array['Caña media','Capellada transpirable','Suela resistente al calor','Plantilla extraíble'],\n  '{\"Altura\":\"6 pulgadas\",\"Clima\":\"Cálido y árido\",\"Peso par\":\"980 g talla 42\"}'::jsonb,\n  false\n)\non conflict (sku) do nothing;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_products.sql": _0002_products_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var ADMIN_COOKIE = "atlas_admin";
var ADMIN_PASSWORD = "589";
var TOKEN_SECRET = new TextEncoder().encode("atlas-tactico-admin-hmac-key-32ch");
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
function asStringArray(value) {
	if (Array.isArray(value)) return value.map(String).filter(Boolean);
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return [];
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
		} catch {
			return trimmed.replace(/^{|}$/g, "").split(",").map((s) => s.replace(/^"|"$/g, "").trim()).filter(Boolean);
		}
	}
	return [];
}
function asColors(value) {
	const raw = typeof value === "string" ? safeJson(value) : value;
	if (!Array.isArray(raw)) return [];
	return raw.map((item) => {
		if (!item || typeof item !== "object") return null;
		const rec = item;
		const name = String(rec.name ?? "").trim();
		const hex = String(rec.hex ?? "").trim();
		if (!name || !hex) return null;
		return {
			name,
			hex
		};
	}).filter((c) => c !== null);
}
function asSpecs(value) {
	const raw = typeof value === "string" ? safeJson(value) : value;
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const out = {};
	for (const [k, v] of Object.entries(raw)) if (k) out[k] = String(v ?? "");
	return out;
}
function safeJson(text) {
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
function asMoney(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function asIso(value) {
	if (value instanceof Date) return value.toISOString();
	return String(value);
}
function mapProduct(row) {
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
		weightG: row.weight_g === null || row.weight_g === void 0 ? null : Number(row.weight_g),
		features: asStringArray(row.features),
		specs: asSpecs(row.specs),
		featured: Boolean(row.featured),
		createdAt: asIso(row.created_at)
	};
}
async function signAdminToken() {
	return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("12h").sign(TOKEN_SECRET);
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
	if (!await isAdminFromCookie()) throw new Error("No autorizado");
}
var SELECT_FIELDS = `
  id, sku, name, description, category, price_soles, sizes, colors, images,
  material, weight_g, features, specs, featured, created_at
`;
var listProducts_createServerFn_handler = createServerRpc({
	id: "c262ca68ae109a6c858f2d5da3eb05db7ddbdf146772378f0f3fe01eddf97675",
	name: "listProducts",
	filename: "src/lib/catalog.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).validator(object({
	category: string().optional(),
	q: string().optional()
}).optional()).handler(listProducts_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const category = data?.category?.trim() || "";
	const q = data?.q?.trim() || "";
	let rows;
	if (category && q) {
		const like = `%${q}%`;
		rows = await sql.query(`select ${SELECT_FIELDS} from products
         where category = $1 and (name ilike $2 or sku ilike $2 or description ilike $2)
         order by created_at desc`, [category, like]);
	} else if (category) rows = await sql.query(`select ${SELECT_FIELDS} from products where category = $1 order by created_at desc`, [category]);
	else if (q) {
		const like = `%${q}%`;
		rows = await sql.query(`select ${SELECT_FIELDS} from products
         where name ilike $1 or sku ilike $1 or description ilike $1
         order by created_at desc`, [like]);
	} else rows = await sql.query(`select ${SELECT_FIELDS} from products order by created_at desc`);
	return rows.map(mapProduct);
});
var getProduct_createServerFn_handler = createServerRpc({
	id: "bb7e7e2450555d24df3a04bab1583d6f54ed73c3a89806649a7ebbe96e61ca4b",
	name: "getProduct",
	filename: "src/lib/catalog.ts"
}, (opts) => getProduct.__executeServer(opts));
var getProduct = createServerFn({ method: "GET" }).validator(object({ id: number().int().positive() })).handler(getProduct_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select ${SELECT_FIELDS} from products where id = $1 limit 1`, [data.id]);
	const product = rows[0] ? mapProduct(rows[0]) : null;
	if (!product) return {
		product: null,
		related: []
	};
	return {
		product,
		related: (await sql.query(`select ${SELECT_FIELDS} from products
       where category = $1 and id <> $2
       order by featured desc, created_at desc
       limit 4`, [product.category, product.id])).map(mapProduct)
	};
});
var getAdminSession_createServerFn_handler = createServerRpc({
	id: "200f626c40a989fed808ca98e83072dd51882a3e2cea488509b83e6ebce19900",
	name: "getAdminSession",
	filename: "src/lib/catalog.ts"
}, (opts) => getAdminSession.__executeServer(opts));
var getAdminSession = createServerFn({ method: "GET" }).handler(getAdminSession_createServerFn_handler, async () => {
	return { ok: await isAdminFromCookie() };
});
var loginAdmin_createServerFn_handler = createServerRpc({
	id: "5fc01cc31578f32f071b13e45df787c9c6b032cf363854912ad880b74693f349",
	name: "loginAdmin",
	filename: "src/lib/catalog.ts"
}, (opts) => loginAdmin.__executeServer(opts));
var loginAdmin = createServerFn({ method: "POST" }).validator(object({ password: string().min(1).max(64) })).handler(loginAdmin_createServerFn_handler, async ({ data }) => {
	if (data.password !== ADMIN_PASSWORD) throw new Error("Contraseña incorrecta");
	const token = await signAdminToken();
	setCookie$1(ADMIN_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 43200,
		secure: true
	});
	return { ok: true };
});
var logoutAdmin_createServerFn_handler = createServerRpc({
	id: "dba8bd39fda96b7a019343342b65957e685f861683edbecbb0fc2cef3c2f3bbc",
	name: "logoutAdmin",
	filename: "src/lib/catalog.ts"
}, (opts) => logoutAdmin.__executeServer(opts));
var logoutAdmin = createServerFn({ method: "POST" }).handler(logoutAdmin_createServerFn_handler, async () => {
	deleteCookie$1(ADMIN_COOKIE);
	return { ok: true };
});
var createProduct_createServerFn_handler = createServerRpc({
	id: "fbabc9218daf45d932316f94d41999633a70a4fa1dc6bd429ada57b0dbf75dc9",
	name: "createProduct",
	filename: "src/lib/catalog.ts"
}, (opts) => createProduct.__executeServer(opts));
var createProduct = createServerFn({ method: "POST" }).validator(productInputSchema).handler(createProduct_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	const rows = await (await getSql()).query(`insert into products (
         sku, name, description, category, price_soles, sizes, colors, images,
         material, weight_g, features, specs, featured
       ) values (
         $1,$2,$3,$4,$5,$6::text[],$7::jsonb,$8::text[],$9,$10,$11::text[],$12::jsonb,$13
       ) returning id`, toInsertParams(data));
	return { id: Number(rows[0]?.id) };
});
var updateProduct_createServerFn_handler = createServerRpc({
	id: "002832a975c273ddcc70d67e9c2c417c9f8eba5dc917f527511d1b21c5108a7a",
	name: "updateProduct",
	filename: "src/lib/catalog.ts"
}, (opts) => updateProduct.__executeServer(opts));
var updateProduct = createServerFn({ method: "POST" }).validator(productInputSchema.extend({ id: number().int().positive() })).handler(updateProduct_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	const { id, ...input } = data;
	const sql = await getSql();
	const params = toInsertParams(input);
	await sql.query(`update products set
         sku=$1, name=$2, description=$3, category=$4, price_soles=$5,
         sizes=$6::text[], colors=$7::jsonb, images=$8::text[], material=$9,
         weight_g=$10, features=$11::text[], specs=$12::jsonb, featured=$13
       where id=$14`, [...params, id]);
	return { id };
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "2ee09114606aaec50f620f4ba56b5ae21103647c2dad5c041a85f2d75052e35b",
	name: "deleteProduct",
	filename: "src/lib/catalog.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).validator(object({ id: number().int().positive() })).handler(deleteProduct_createServerFn_handler, async ({ data }) => {
	await requireAdmin();
	await (await getSql()).query(`delete from products where id = $1`, [data.id]);
	return { ok: true };
});
function toInsertParams(data) {
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
		data.featured
	];
}
//#endregion
export { createProduct_createServerFn_handler, deleteProduct_createServerFn_handler, getAdminSession_createServerFn_handler, getProduct_createServerFn_handler, listProducts_createServerFn_handler, loginAdmin_createServerFn_handler, logoutAdmin_createServerFn_handler, updateProduct_createServerFn_handler };
