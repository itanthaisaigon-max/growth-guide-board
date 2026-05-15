import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/pages/$pageId")({
  head: () => ({ meta: [{ title: "Page detail — Atelier CMS" }] }),
  component: PageDetail,
});

function PageDetail() {
  const { pageId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["pages", "detail", pageId], queryFn: () => api.pages.get(pageId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/pages" backLabel="Back to pages" />;

  return (
    <DetailLayout
      backTo="/pages" backLabel="Pages" breadcrumb={data.slug}
      meta={<><StatusBadge status={data.status} /><Badge variant="secondary" className="capitalize">{data.template}</Badge></>}
      title={data.title}
      subtitle={`Lives at ${data.slug} · last edited by ${data.author.name}`}
      main={
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Content blocks</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is the rendered page content. Once connected to the Laravel API, the page builder
            blocks for <strong>{data.title}</strong> will appear here for review.
          </p>
        </Card>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Details</h3>
          <DetailRow label="Path" value={<code className="text-xs">{data.slug}</code>} />
          <DetailRow label="Template" value={<span className="capitalize">{data.template}</span>} />
          <DetailRow label="Author" value={data.author.name} />
          <DetailRow label="Updated" value={new Date(data.updated_at).toLocaleDateString()} />
        </Card>
      }
    />
  );
}
