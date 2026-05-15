import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface Props {
  backTo: string;
  backLabel: string;
  breadcrumb?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  main: ReactNode;
  side?: ReactNode;
}

export function DetailLayout({ backTo, backLabel, breadcrumb, title, subtitle, meta, actions, main, side }: Props) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: backTo })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {backLabel}
          </Button>
          {breadcrumb && <span className="text-muted-foreground text-sm truncate">/ {breadcrumb}</span>}
        </div>
        <div className="flex items-center gap-2">
          {actions ?? (
            <>
              <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">{meta}</div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </Card>

      {side ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">{main}</div>
          <div className="space-y-6">{side}</div>
        </div>
      ) : (
        <div className="space-y-6">{main}</div>
      )}
    </div>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium text-right">{value}</span>
    </div>
  );
}

export function NotFoundDetail({ backTo, backLabel }: { backTo: string; backLabel: string }) {
  return (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">Not found.</p>
      <Link to={backTo} className="text-primary text-sm underline mt-2 inline-block">{backLabel}</Link>
    </div>
  );
}
