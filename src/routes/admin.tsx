import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin-gate";
import { AdminPanel } from "@/components/admin-panel";
import { getAdminSession, listProducts } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const session = await getAdminSession();
    const products = session.ok ? await listProducts() : [];
    return { ok: session.ok, products };
  },
  component: AdminPage,
});

function AdminPage() {
  const { ok, products } = Route.useLoaderData();
  if (!ok) return <AdminGate />;
  return <AdminPanel products={products} />;
}
