import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-semibold">Algo salió mal</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message || "Ocurrió un error inesperado. Recarga la página."}
      </p>
      <Link to="/" className="mt-2 text-sm text-primary hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}

export function AppNotFoundComponent() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-display text-4xl font-semibold">No encontrado</h1>
      <p className="max-w-md text-sm text-muted">
        Ese producto o página no existe en el catálogo.
      </p>
      <Link to="/catalogo" className="mt-2 text-sm text-primary hover:underline">
        Ver catálogo
      </Link>
    </main>
  );
}
