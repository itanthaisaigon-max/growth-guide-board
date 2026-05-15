import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/categories/$categoryId")({
  head: () => ({ meta: [{ title: "Category detail — Atelier CMS" }] }),
  component: CategoryDetail,
});

function CategoryDetail() {
  const { categoryId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["categories", "detail", categoryId], queryFn: () => api.categories.get(categoryId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/categories" backLabel="Back to categories" />;

  return (
    <DetailLayout
      backTo="/categories" backLabel="Categories" breadcrumb={data.slug}
      title={data.name}
      subtitle={`${data.posts_count} post${data.posts_count === 1 ? "" : "s"} in this category.`}
      main={
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Recent posts</h2>
          <p className="text-sm text-muted-foreground">
            Posts filed under <strong>{data.name}</strong> will appear here once connected.
          </p>
        </Card>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Details</h3>
          <DetailRow label="Slug" value={<code className="text-xs">{data.slug}</code>} />
          <DetailRow label="Posts" value={data.posts_count} />
          <DetailRow label="Parent" value={data.parent_id ?? "—"} />
          <DetailRow label="Updated" value={new Date(data.updated_at).toLocaleDateString()} />
        </Card>
      }
    />
  );
}
