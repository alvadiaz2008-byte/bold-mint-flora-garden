import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/catalog-shared";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
] as const;

export function SiteChrome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="hidden border-b border-border bg-surface px-4 py-1.5 text-center text-[0.7rem] tracking-[0.22em] text-muted uppercase sm:block">
          Catálogo de equipo táctico · Personal militar y de seguridad
        </div>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg",
                  pathname === item.to && "text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                to="/catalogo"
                search={{ categoria: cat.slug }}
                className="flex h-11 items-center px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link
              to="/catalogo"
              className="flex size-11 items-center justify-center text-muted hover:text-fg"
              aria-label="Buscar en el catálogo"
            >
              <Search className="size-5" />
            </Link>
            <Link
              to="/admin"
              className={cn(
                "hidden h-11 items-center px-3 text-sm font-medium text-muted hover:text-fg md:flex",
                pathname.startsWith("/admin") && "text-fg",
              )}
            >
              Administrador
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
            <nav className="flex flex-col" aria-label="Móvil">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/catalogo"
                  search={{ categoria: cat.slug }}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center text-sm font-medium text-muted"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex h-12 items-center text-sm font-medium"
              >
                Administrador
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Catálogo de ropa y equipo para personal militar. Precios en soles.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-subtle uppercase">
              Categorías
            </p>
            <ul className="mt-3 space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to="/catalogo"
                    search={{ categoria: cat.slug }}
                    className="text-sm text-muted hover:text-fg"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-subtle uppercase">
              Catálogo
            </p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              <li>
                <Link to="/catalogo" className="hover:text-fg">
                  Ver todo
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-fg">
                  Administrador
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border px-4 py-4 text-center text-xs text-subtle">
          ATLAS TÁCTICO · Catálogo de referencia · Precios en S/
        </div>
      </footer>
      <Toaster theme="dark" position="top-center" richColors={false} />
    </div>
  );
}
