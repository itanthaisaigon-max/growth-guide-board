import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/coupons/$couponId")({
  head: () => ({ meta: [{ title: "Coupon detail — Atelier CMS" }] }),
  component: CouponDetail,
});

function CouponDetail() {
  const { couponId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["coupons", "detail", couponId], queryFn: () => api.coupons.get(couponId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/coupons" backLabel="Back to coupons" />;

  const amountLabel = data.discount_type === "percent" ? `${data.amount}%` : `$${data.amount.toFixed(2)}`;
  return (
    <DetailLayout
      backTo="/coupons" backLabel="Coupons" breadcrumb={data.code}
      meta={<><StatusBadge status={data.status} /><StatusBadge status={data.discount_type} /></>}
      title={<span className="font-mono">{data.code}</span>}
      subtitle={`${amountLabel} off · used ${data.usage_count.toLocaleString()}${data.usage_limit ? ` of ${data.usage_limit.toLocaleString()}` : ""} times`}
      main={
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Restrictions & rules</h2>
          <p className="text-sm text-muted-foreground">
            Cart minimums, product/category restrictions, and per-customer limits for{" "}
            <strong className="font-mono">{data.code}</strong> appear here once connected.
          </p>
        </Card>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Details</h3>
          <DetailRow label="Discount type" value={<span className="capitalize">{data.discount_type.replace("_", " ")}</span>} />
          <DetailRow label="Amount" value={<span className="tabular-nums font-medium">{amountLabel}</span>} />
          <DetailRow label="Used" value={<span className="tabular-nums">{data.usage_count.toLocaleString()}</span>} />
          <DetailRow label="Limit" value={data.usage_limit ? data.usage_limit.toLocaleString() : "—"} />
          <DetailRow label="Expires" value={data.expires_at ? new Date(data.expires_at).toLocaleDateString() : "—"} />
        </Card>
      }
    />
  );
}
