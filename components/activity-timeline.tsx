import type { ActivityEvent, ActivityEventKind } from "@/lib/types";
import { ArrowRight, FileText, ListChecks, Sparkles, User } from "lucide-react";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function iconForKind(kind: ActivityEventKind | undefined) {
  switch (kind) {
    case "listing_created":
      return FileText;
    case "marketing_generated":
      return Sparkles;
    case "tasks_routed":
      return ListChecks;
    case "status_updated":
      return ArrowRight;
    case "user_action":
      return User;
    default:
      return ListChecks;
  }
}

function ringForKind(kind: ActivityEventKind | undefined) {
  switch (kind) {
    case "listing_created":
      return "border-slate-200 bg-slate-50 text-slate-600";
    case "marketing_generated":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "tasks_routed":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "status_updated":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "user_action":
      return "border-violet-200 bg-violet-50 text-violet-800";
    default:
      return "border-slate-200 bg-white text-slate-600";
  }
}

export function ActivityTimeline({ activity }: { activity: ActivityEvent[] }) {
  if (activity.length === 0) return <div className="empty-state">Activity timeline will populate automatically.</div>;
  const sorted = [...activity].sort((a, b) => a.at.localeCompare(b.at));

  return (
    <div className="relative pl-2">
      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-200" aria-hidden />
      <ul className="space-y-0">
        {sorted.map((event) => {
          const Icon = iconForKind(event.kind);
          const ring = ringForKind(event.kind);
          return (
            <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
              <div
                className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${ring}`}
              >
                <Icon size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-sm leading-relaxed text-slate-700">{event.message}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {dateTimeFormatter.format(new Date(event.at))} UTC
                  {event.kind && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                      {labelForKind(event.kind)}
                    </span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function labelForKind(kind: ActivityEventKind): string {
  const labels: Record<ActivityEventKind, string> = {
    listing_created: "Intake",
    marketing_generated: "Marketing",
    tasks_routed: "Automation",
    status_updated: "Pipeline",
    user_action: "User",
  };
  return labels[kind];
}
