import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import {
  categoryLabel,
  formatSoles,
  type Product,
} from "@/lib/catalog-shared";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const selectedColor = useMemo(
    () => product.colors.find((c) => c.name === color) ?? product.colors[0],
    [color, product.colors],
  );
  const main = product.images[imageIndex] ?? product.images[0];
  const specEntries = Object.entries(product.specs);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link to="/" className="hover:text-fg">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to="/catalogo"
          search={{ categoria: product.category }}
          className="hover:text-fg"
        >
          {categoryLabel(product.category)}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-fg">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-3 sm:flex-row">
          {product.images.length > 1 ? (
            <div className="flex gap-2 sm:w-20 sm:flex-col">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={`size-16 overflow-hidden rounded-md sm:size-20 ${
                    i === imageIndex
                      ? "ring-2 ring-primary"
                      : "shadow-[var(--shadow-border)]"
                  }`}
                  aria-label={`Foto ${i + 1}`}
                >
                  <ProductImage src={src} alt="" className="size-full" />
                </button>
              ))}
            </div>
          ) : null}
          <ProductImage
            src={main}
            alt={product.name}
            className="aspect-square w-full rounded-xl"
          />
        </div>

        <div>
          <Badge>{categoryLabel(product.category)}</Badge>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 font-display text-4xl font-semibold tabular-nums">
            {formatSoles(product.priceSoles)}
          </p>
          <p className="mt-1 text-sm text-muted">Precio en soles (PEN)</p>

          {product.colors.length > 0 ? (
            <fieldset className="mt-8">
              <legend className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">
                Color: {selectedColor?.name}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => {
                  const active = c.name === color;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      className={`flex h-11 items-center gap-2 rounded-full px-3 text-sm shadow-[var(--shadow-border)] ${
                        active ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <span
                        className="size-4 rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                      {active ? <Check className="size-3.5" /> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {product.sizes.length > 0 ? (
            <fieldset className="mt-6">
              <legend className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">
                Talla: {size}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm ${
                        active
                          ? "bg-primary text-primary-fg"
                          : "bg-elevated text-fg shadow-[var(--shadow-border)]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          <p className="mt-8 text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        </div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl font-semibold">Características</h2>
          <ul className="mt-4 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-fg">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
            {product.features.length === 0 ? (
              <li className="text-sm text-muted">Sin características extra.</li>
            ) : null}
          </ul>
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl font-semibold">Ficha técnica</h2>
          <dl className="mt-4 divide-y divide-border">
            <div className="flex justify-between gap-4 py-2.5 text-sm">
              <dt className="text-muted">Material</dt>
              <dd className="text-right">{product.material || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5 text-sm">
              <dt className="text-muted">Peso</dt>
              <dd className="text-right tabular-nums">
                {product.weightG ? `${product.weightG} g` : "—"}
              </dd>
            </div>
            {specEntries.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-3xl font-semibold">
            Relacionados
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </article>
  );
}
