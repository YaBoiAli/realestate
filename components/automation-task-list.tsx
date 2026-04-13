import type { Task } from "@/lib/types";
import { CheckCircle2, CircleDashed } from "lucide-react";

const STAGE_LABELS: Record<Task["stage"], string> = {
  new_listing: "New Listing",
  marketing_prep: "Marketing Prep",
  media_scheduled: "Media Scheduled",
  ready_to_publish: "Ready to Publish",
};

export function AutomationTaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return <div className="empty-state">No automation tasks yet.</div>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3">
          {task.completed ? (
            <CheckCircle2 size={16} className="mt-0.5 text-emerald-500" />
          ) : (
            <CircleDashed size={16} className="mt-0.5 text-amber-500" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-800">{task.title}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-slate-500">{task.completed ? "Completed" : "Pending"}</p>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {STAGE_LABELS[task.stage]}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  task.priority === "high"
                    ? "bg-rose-100 text-rose-700"
                    : task.priority === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
