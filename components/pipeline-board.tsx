import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";
import { STATUS_ORDER, STATUS_LABELS } from "@/lib/status";
import { ListingCard } from "./listing-card";

interface PipelineBoardProps {
  listings: Listing[];
  onAdvance: (id: string) => void;
  onSelect: (id: string) => void;
}

export function PipelineBoard({ listings, onAdvance, onSelect }: PipelineBoardProps) {
  return (
    <section className="surface-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Pipeline Workspace</h2>
        <p className="text-xs text-slate-500">Select any listing to open full details</p>
      </div>
      <div className="pipeline-scroll">
        {STATUS_ORDER.map((status) => {
          const items = listings.filter((listing) => listing.status === status);
          return (
            <motion.section
              key={status}
              layout
              className="pipeline-column"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {STATUS_LABELS[status]}
                </h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.length === 0 && <div className="empty-state">No listings in this stage.</div>}
                {items.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={onSelect}
                    onAdvance={onAdvance}
                    compact={status === "live"}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </section>
  );
}
