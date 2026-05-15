import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order detail — Atelier CMS" }] }),
  component: OrderDetail,
});

function OrderDetail() {
  const { orderId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["orders", "detail", orderId], queryFn: () => api.orders.get(orderId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/orders" backLabel="Back to orders" />;

  return (
    <DetailLayout
      backTo="/orders" backLabel="Orders" breadcrumb={data.number}
      meta={<StatusBadge status={data.status} />}
      title={<span className="font-mono">{data.number}</span>}
      subtitle={`Placed ${new Date(data.created_at).toLocaleString()}`}
      main={
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Line items</h2>
          <p className="text-sm text-muted-foreground">
            Order line items, shipping, and payment details will appear here when connected.
          </p>
          <div className="border-t mt-6 pt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">Order total</span>
            <span className="font-semibold tabular-nums">${data.total.toFixed(2)} {data.currency}</span>
          </div>
        </Card>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Customer</h3>
          <DetailRow label="Name" value={data.customer_name} />
          <DetailRow label="Email" value={<span className="text-xs break-all">{data.customer_email}</span>} />
          <DetailRow label="Status" value={<StatusBadge status={data.status} />} />
          <DetailRow label="Created" value={new Date(data.created_at).toLocaleDateString()} />
        </Card>
      }
    />
  );
}
