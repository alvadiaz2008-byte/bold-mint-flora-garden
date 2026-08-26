import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/catalog-shared";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-border)]">
        <p className="font-display text-2xl font-semibold">Sin resultados</p>
        <p className="mt-2 text-sm text-muted">
          No hay productos con esos filtros. Prueba otra categoría o búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
