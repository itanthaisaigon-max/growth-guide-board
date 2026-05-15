import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileVideo, ImageIcon } from "lucide-react";
import { DetailLayout, DetailRow, NotFoundDetail } from "@/components/admin/DetailLayout";

export const Route = createFileRoute("/media/$mediaId")({
  head: () => ({ meta: [{ title: "Media detail — Atelier CMS" }] }),
  component: MediaDetail,
});

const iconFor = { image: ImageIcon, video: FileVideo, document: FileText };

function MediaDetail() {
  const { mediaId } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["media", "detail", mediaId], queryFn: () => api.media.get(mediaId) });
  if (isLoading) return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  if (!data) return <NotFoundDetail backTo="/media" backLabel="Back to media" />;

  const Icon = iconFor[data.type];
  return (
    <DetailLayout
      backTo="/media" backLabel="Media library" breadcrumb={data.name}
      meta={<Badge variant="secondary" className="capitalize">{data.type}</Badge>}
      title={data.name}
      subtitle={`Uploaded ${new Date(data.uploaded_at).toLocaleDateString()} · ${(data.size_kb / 1024).toFixed(2)} MB`}
      actions={<Button variant="outline" size="sm" asChild><a href={data.url} download><Download className="h-4 w-4 mr-1" /> Download</a></Button>}
      main={
        <Card className="p-0 overflow-hidden">
          <div className="aspect-video bg-muted flex items-center justify-center">
            {data.type === "image" ? (
              <img src={data.url} alt={data.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2">
                <Icon className="h-16 w-16" />
                <span className="text-xs uppercase tracking-wide">{data.type} preview unavailable</span>
              </div>
            )}
          </div>
        </Card>
      }
      side={
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">File info</h3>
          <DetailRow label="Type" value={<span className="capitalize">{data.type}</span>} />
          <DetailRow label="Size" value={`${(data.size_kb / 1024).toFixed(2)} MB`} />
          <DetailRow label="Uploaded" value={new Date(data.uploaded_at).toLocaleDateString()} />
          <DetailRow label="URL" value={<code className="text-xs break-all">{data.url}</code>} />
        </Card>
      }
    />
  );
}
