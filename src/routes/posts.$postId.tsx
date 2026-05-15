import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ArrowLeft, Eye, Calendar, User, Tag as TagIcon, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/posts/$postId")({
  head: () => ({
    meta: [{ title: "Post detail — Atelier CMS" }],
  }),
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useQuery({
    queryKey: ["posts", "detail", postId],
    queryFn: () => api.posts.get(postId),
  });

  if (isLoading) {
    return <div className="text-muted-foreground py-10 text-center">Loading…</div>;
  }
  if (!post) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/posts" className="text-primary text-sm underline mt-2 inline-block">Back to posts</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/posts" })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Posts
          </Button>
          <span className="text-muted-foreground text-sm">/ {post.slug}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={post.status} />
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
            <p className="text-muted-foreground mt-2">{post.excerpt}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Content</h2>
            <article className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-4">
              <p>
                This is a friendly preview of the article body. In production this area renders the
                rich-text content returned by the Laravel API for <strong>{post.title}</strong>.
              </p>
              <p>
                Editors can review formatting, embedded media, and SEO snippets before publishing.
                Use the Edit button above to open the full editor when wired up to your backend.
              </p>
              <p>
                Tags help readers and search engines understand the topic — this post is filed under{" "}
                {post.tags.map((t, i) => (
                  <span key={t}>
                    <span className="font-medium">{t}</span>
                    {i < post.tags.length - 1 ? ", " : ""}
                  </span>
                ))}.
              </p>
            </article>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Author</span>
                <span className="ml-auto font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Views</span>
                <span className="ml-auto font-medium tabular-nums">{post.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Published</span>
                <span className="ml-auto font-medium">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated</span>
                <span className="ml-auto font-medium">{new Date(post.updated_at).toLocaleDateString()}</span>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <TagIcon className="h-4 w-4" /> Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.length === 0 && <span className="text-sm text-muted-foreground">No tags</span>}
              {post.tags.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Permalink</h3>
            <code className="text-xs bg-muted rounded px-2 py-1 break-all block">/{post.slug}</code>
          </Card>
        </div>
      </div>
    </div>
  );
}
