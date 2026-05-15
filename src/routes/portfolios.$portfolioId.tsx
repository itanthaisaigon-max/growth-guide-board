import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/portfolios/$portfolioId")({
  head: () => ({ meta: [{ title: "Portfolio detail — Atelier CMS" }] }),
  component: PortfolioDetail,
});

function PortfolioDetail() {
  const { portfolioId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["portfolios", "detail", portfolioId], queryFn: () => api.portfolios.get(portfolioId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/portfolios" backLabel="Back to portfolios" />;

  return (
    <DetailLayout
      backTo="/portfolios" backLabel="Portfolios" breadcrumb={data.client}
      meta={<><StatusBadge status={data.status} /><Badge variant="secondary">{data.category}</Badge><Badge variant="outline">{data.year}</Badge></>}
      title={data.title}
      subtitle={`A ${data.category.toLowerCase()} project for ${data.client}.`}
      main={
        <>
          <Card className="p-0 overflow-hidden">
            <div className="aspect-[16/9] bg-muted">
              <img src={data.cover_url} alt={data.title} className="h-full w-full object-cover" />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Case study</h2>
            <p className="text-sm leading-relaxed">
              The full case study for <strong>{data.title}</strong> — challenge, approach, deliverables,
              and outcomes — will render here when wired to your backend.
            </p>
          </Card>
        </>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Details</h3>
          <DetailRow label="Client" value={data.client} />
          <DetailRow label="Category" value={data.category} />
          <DetailRow label="Year" value={data.year} />
          <DetailRow label="Updated" value={new Date(data.updated_at).toLocaleDateString()} />
        </Card>
      }
    />
  );
}
