import { Link } from "@tanstack/react-router";
import { ProductImage } from "@/components/product-image";
import { categoryLabel, formatSoles, type Product } from "@/lib/catalog-shared";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/producto/$id"
      params={{ id: String(product.id) }}
      className="group flex flex-col rounded-xl bg-surface p-2 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-border-hover)]"
    >
      <ProductImage
        src={product.images[0]}
        alt={product.name}
        className="aspect-square rounded-lg"
        imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col gap-1.5 px-2 pt-3 pb-2">
        <p className="text-[0.65rem] tracking-[0.18em] text-subtle uppercase">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug text-fg">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="text-base font-medium tabular-nums text-fg">
            {formatSoles(product.priceSoles)}
          </p>
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.hex + c.name}
                title={c.name}
                className="size-3 rounded-full shadow-[var(--shadow-border)]"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
