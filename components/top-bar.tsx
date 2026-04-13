import { Activity, Plus } from "lucide-react";

interface TopBarProps {
  onCreateClick: () => void;
}

export function TopBar({ onCreateClick }: TopBarProps) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">LocalPRO</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">LocalPRO Listing Flow</h1>
        <p className="mt-2 text-sm text-slate-500">Automate listing operations from intake to launch</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="surface-card flex items-center gap-2 px-3 py-2 text-xs text-slate-600">
          <Activity size={14} className="text-emerald-500" />
          Automation Active
        </div>
        <button className="btn-primary" onClick={onCreateClick}>
          <Plus size={16} />
          New Listing
        </button>
      </div>
    </header>
  );
}
