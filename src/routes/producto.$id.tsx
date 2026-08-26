import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductDetail } from "@/components/product-detail";
import { getProduct } from "@/lib/catalog";

export const Route = createFileRoute("/producto/$id")({
  loader: async ({ params }) => {
    const id = Number(params.id);
    if (!Number.isFinite(id) || id <= 0) throw notFound();
    const data = await getProduct({ data: { id } });
    if (!data.product) throw notFound();
    return { product: data.product, related: data.related };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  return <ProductDetail product={product} related={related} />;
}
