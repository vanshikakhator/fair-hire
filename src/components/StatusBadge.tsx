import { cn } from "@/lib/utils";
import { Check, Clock, X } from "lucide-react";

type Status = "Applied" | "Shortlisted" | "Accepted" | "Rejected" | "Pending" | "Active" | "Paused";

const styles: Record<Status, string> = {
  Applied: "bg-info/15 text-info border-info/30",
  Shortlisted: "bg-warning/15 text-warning border-warning/30",
  Accepted: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Pending: "bg-muted text-muted-foreground border-border",
  Active: "bg-success/15 text-success border-success/30",
  Paused: "bg-muted text-muted-foreground border-border",
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const icon = status === "Accepted" ? <Check className="h-3 w-3" /> : status === "Rejected" ? <X className="h-3 w-3" /> : status === "Shortlisted" ? <Clock className="h-3 w-3" /> : null;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {icon}
      {status}
    </span>
  );
};
