import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { listProducts } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/catalog-shared";

export const Route = createFileRoute("/")({
  loader: () => listProducts(),
  component: Home,
});

function Home() {
  const products = Route.useLoaderData();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const showcase = featured.length >= 4 ? featured : products.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1548449112-96a38a64381d?auto=format&fit=crop&w=1600&q=70)",
          }}
        />
        <div className="absolute inset-0 bg-bg/80" />
        <div className="relative mx-auto flex min-h-[72svh] max-w-6xl flex-col justify-end px-4 py-16">
          <p className="text-xs tracking-[0.28em] text-primary uppercase">
            Equipo de servicio
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Catálogo táctico
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted md:text-lg">
            Uniformes, calzado, chalecos y accesorios. Vista simple del
            catálogo; ficha completa al entrar en cada producto. Precios en
            soles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/catalogo">
                Ver catálogo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/catalogo" search={{ categoria: "uniformes" }}>
                Uniformes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold">Categorías</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to="/catalogo"
              search={{ categoria: cat.slug }}
              className="flex min-h-24 flex-col justify-end rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <span className="font-display text-xl font-semibold">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold">Destacados</h2>
          <Link
            to="/catalogo"
            className="text-sm text-muted hover:text-fg"
          >
            Ver todo
          </Link>
        </div>
        <ProductGrid products={showcase} />
      </section>
    </div>
  );
}
