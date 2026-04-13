"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/top-bar";
import { OverviewStats } from "@/components/overview-stats";
import { NewListingDrawer } from "@/components/new-listing-drawer";
import { ListingDetailPanel } from "@/components/listing-detail-panel";
import { PipelineBoard } from "@/components/pipeline-board";
import { runListingAutomations } from "@/lib/automation";
import { seedActivity, seedAssets, seedListings, seedTasks } from "@/lib/seed-data";
import { nextStatus } from "@/lib/status";
import type { ActivityEvent, GeneratedAssets, Listing, Task } from "@/lib/types";

export default function Page() {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [assets, setAssets] = useState<GeneratedAssets[]>(seedAssets);
  const [activity, setActivity] = useState<ActivityEvent[]>(seedActivity);
  const [selectedId, setSelectedId] = useState<string | null>(seedListings[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [runningAutomation, setRunningAutomation] = useState(false);
  const [recentlyCreatedId, setRecentlyCreatedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      listings.filter((l) =>
        `${l.address} ${l.city} ${l.agentName}`.toLowerCase().includes(query.toLowerCase())
      ),
    [listings, query]
  );

  const selected = listings.find((l) => l.id === selectedId) ?? null;

  return (
    <AppShell>
      <TopBar onCreateClick={() => setDrawerOpen(true)} />
      <OverviewStats listings={listings} />

      <section className="surface-card mt-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ops Workspace</h2>
            <p className="text-sm text-slate-500">Pipeline control with intelligent listing context</p>
          </div>
          <input
            className="input w-full max-w-xs"
            placeholder="Search by address, city, or agent..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      {runningAutomation && (
        <motion.div
          className="surface-card mt-4 flex items-center gap-2 p-3 text-sm text-indigo-700"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Sparkles size={16} className="animate-pulse" />
          Running automations: team notification, marketing generation, and media scheduling...
        </motion.div>
      )}

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <PipelineBoard
          listings={filtered}
          onSelect={setSelectedId}
          onAdvance={(id) => {
            setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: nextStatus(l.status) } : l)));
            setActivity((prev) => [
              {
                id: crypto.randomUUID(),
                listingId: id,
                kind: "user_action",
                message: "Pipeline stage advanced manually.",
                at: new Date().toISOString(),
              },
              ...prev,
            ]);
          }}
        />

        <ListingDetailPanel
          listing={selected}
          tasks={tasks.filter((t) => t.listingId === selected?.id)}
          assets={assets.find((a) => a.listingId === selected?.id)}
          activity={activity.filter((a) => a.listingId === selected?.id)}
        />
      </section>

      <NewListingDrawer
        open={drawerOpen}
        creating={runningAutomation}
        onClose={() => setDrawerOpen(false)}
        onCreate={(input) => {
          const listing: Listing = {
            ...input,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };
          setRunningAutomation(true);
          setDrawerOpen(false);

          window.setTimeout(() => {
            const automation = runListingAutomations(listing);
            setListings((prev) => [{ ...listing, status: automation.updatedStatus }, ...prev]);
            setAssets((prev) => [automation.generatedAssets, ...prev]);
            setTasks((prev) => [...automation.tasks, ...prev]);
            setActivity((prev) => [...automation.activityLog, ...prev]);
            setSelectedId(listing.id);
            setRecentlyCreatedId(listing.id);
            setRunningAutomation(false);
            window.setTimeout(() => setRecentlyCreatedId(null), 1800);
          }, 1200);
        }}
      />

      {recentlyCreatedId && (
        <motion.div
          className="surface-card fixed bottom-5 right-5 z-50 p-3 text-sm text-slate-700"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Listing created successfully. Automations attached and stage updated.
        </motion.div>
      )}
    </AppShell>
  );
}
