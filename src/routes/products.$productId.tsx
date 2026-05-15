import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({ meta: [{ title: "Product detail — Atelier CMS" }] }),
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["products", "detail", productId], queryFn: () => api.products.get(productId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/products" backLabel="Back to products" />;

  return (
    <DetailLayout
      backTo="/products" backLabel="Products" breadcrumb={data.sku}
      meta={<><StatusBadge status={data.status} /><Badge variant="secondary" className="capitalize">{data.type}</Badge><StatusBadge status={data.stock_status} /></>}
      title={data.name}
      subtitle={<span>SKU <code className="text-xs">{data.sku}</code></span>}
      main={
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Long-form description, attributes, and variants for <strong>{data.name}</strong> will render here.
          </p>
        </Card>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Pricing & stock</h3>
          <DetailRow label="Price" value={<span className="tabular-nums">${data.price.toFixed(2)}</span>} />
          <DetailRow label="Stock qty" value={<span className="tabular-nums">{data.stock_quantity}</span>} />
          <DetailRow label="Stock status" value={<StatusBadge status={data.stock_status} />} />
          <DetailRow label="Slug" value={<code className="text-xs">{data.slug}</code>} />
          <DetailRow label="Updated" value={new Date(data.updated_at).toLocaleDateString()} />
        </Card>
      }
    />
  );
}
