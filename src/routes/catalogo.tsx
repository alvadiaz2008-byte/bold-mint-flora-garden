import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listProducts } from "@/lib/catalog";
import { CATEGORIES, categoryLabel } from "@/lib/catalog-shared";

type CatalogSearch = {
  categoria?: string;
  q?: string;
};

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    categoria:
      typeof search.categoria === "string" ? search.categoria : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    listProducts({
      data: { category: deps.categoria, q: deps.q },
    }),
  component: CatalogoPage,
});

function CatalogoPage() {
  const products = Route.useLoaderData();
  const search = Route.useSearch();
  const title = search.categoria
    ? categoryLabel(search.categoria)
    : "Catálogo";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-xs tracking-[0.22em] text-primary uppercase">
        Inventario
      </p>
      <h1 className="mt-1 font-display text-4xl font-semibold md:text-5xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {products.length} producto{products.length === 1 ? "" : "s"}
        {search.q ? ` para “${search.q}”` : ""}
      </p>

      <CatalogFilters categoria={search.categoria} q={search.q} />

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

function CatalogFilters({
  categoria,
  q,
}: {
  categoria?: string;
  q?: string;
}) {
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q ?? "");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    void navigate({
      to: "/catalogo",
      search: {
        categoria,
        q: query.trim() || undefined,
      },
    });
  }

  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={onSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre"
          aria-label="Buscar productos"
        />
        <Button type="submit" variant="secondary" size="icon" aria-label="Buscar">
          <Search className="size-4" />
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        <FilterChip to="/catalogo" search={{ q }} active={!categoria}>
          Todo
        </FilterChip>
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.slug}
            to="/catalogo"
            search={{ categoria: cat.slug, q }}
            active={categoria === cat.slug}
          >
            {cat.label}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  to,
  search,
  active,
  children,
}: {
  to: "/catalogo";
  search: CatalogSearch;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={`flex h-11 items-center rounded-full px-4 text-sm ${
        active
          ? "bg-primary text-primary-fg"
          : "bg-elevated text-fg shadow-[var(--shadow-border)]"
      }`}
    >
      {children}
    </Link>
  );
}
