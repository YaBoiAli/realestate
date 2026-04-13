"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ActivityEvent, GeneratedAssets, Listing, Task } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { GeneratedAssetsCard } from "./generated-assets-card";
import { AutomationTaskList } from "./automation-task-list";
import { ActivityTimeline } from "./activity-timeline";

const numberFormatter = new Intl.NumberFormat("en-US");

interface ListingDetailPanelProps {
  listing: Listing | null;
  tasks: Task[];
  assets?: GeneratedAssets;
  activity: ActivityEvent[];
}

export function ListingDetailPanel({ listing, tasks, assets, activity }: ListingDetailPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {listing ? (
        <motion.aside
          key={listing.id}
          className="surface-card sticky top-6 h-fit min-w-0 space-y-4 p-5 xl:min-w-[400px]"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.2 }}
        >
          <header className="w-full">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">{listing.address}</h3>
              <StatusBadge status={listing.status} />
            </div>
            <p className="text-sm text-slate-500">
              {listing.city}, {listing.state} {listing.zip}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">${numberFormatter.format(listing.price)}</p>
            <p className="text-xs text-slate-500">
              {listing.bedrooms}bd · {listing.bathrooms}ba · {numberFormatter.format(listing.squareFeet)} sqft
            </p>
          </header>

          <section className="w-full">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Generated assets</h4>
            <GeneratedAssetsCard assets={assets} />
          </section>

          <section className="w-full">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Tasks</h4>
            <p className="mb-2 text-xs text-slate-500">
              Rule-based routing from intake — priorities reflect price, beds, and missing copy.
            </p>
            <AutomationTaskList tasks={tasks} />
          </section>

          <section className="w-full">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Activity timeline</h4>
            <p className="mb-2 text-xs text-slate-500">Chronological audit: intake, marketing, automation, pipeline.</p>
            <ActivityTimeline activity={activity} />
          </section>
        </motion.aside>
      ) : (
        <motion.aside
          key="empty"
          className="surface-card p-5 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Select a listing to view property intelligence, generated assets, and timeline activity.
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
