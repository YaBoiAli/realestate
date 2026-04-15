"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
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

type SlackAudience = "transaction" | "marketing";

type SlackNotifyResult = { ok: boolean; skipped?: boolean; reason?: string; audience?: string; error?: string };

async function notifyTeamInSlack(listing: Listing, taskTitle: string, audience: SlackAudience): Promise<SlackNotifyResult> {
  const response = await fetch("/api/slack/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: listing.id,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      price: listing.price,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      stage: listing.status.replaceAll("_", " "),
      agentName: listing.agentName,
      taskTitle,
      audience,
    }),
  });

  let data: SlackNotifyResult;
  try {
    data = (await response.json()) as SlackNotifyResult;
  } catch {
    throw new Error("Slack notification response was not valid JSON");
  }

  if (!response.ok) {
    throw new Error(data.error || "Slack notification request failed");
  }

  return data;
}

function handleSlackNotifyResult(
  result: SlackNotifyResult,
  listingId: string,
  audience: SlackAudience,
  setActivity: Dispatch<SetStateAction<ActivityEvent[]>>
) {
  if (result.skipped) {
    setActivity((prev) => [
      {
        id: crypto.randomUUID(),
        listingId,
        kind: "user_action",
        message: `Slack skipped (${audience}): ${result.reason ?? "Add webhook URL to .env.local and restart dev server."}`,
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
    return;
  }
  if (result.ok) {
    setActivity((prev) => [
      {
        id: crypto.randomUUID(),
        listingId,
        kind: "user_action",
        message:
          audience === "marketing"
            ? "Slack notification sent to marketing channel."
            : "Slack notification sent to transaction channel.",
        at: new Date().toISOString(),
      },
      ...prev,
    ]);
  }
}

function audienceForStatus(status: Listing["status"]): SlackAudience | null {
  if (status === "marketing_prep") return "marketing";
  if (status === "live") return "transaction";
  return null;
}

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
          onAdvance={(listing) => {
            const advancedListing: Listing = { ...listing, status: nextStatus(listing.status) };

            setListings((prev) =>
              prev.map((l) => (l.id === listing.id ? advancedListing : l))
            );

            setActivity((prev) => [
              {
                id: crypto.randomUUID(),
                listingId: listing.id,
                kind: "user_action",
                message: "Pipeline stage advanced manually.",
                at: new Date().toISOString(),
              },
              ...prev,
            ]);

            const audience = audienceForStatus(advancedListing.status);
            if (audience) {
              void notifyTeamInSlack(advancedListing, "Pipeline stage advanced", audience)
                .then((result) => handleSlackNotifyResult(result, advancedListing.id, audience, setActivity))
                .catch(() => {
                  setActivity((prev) => [
                    {
                      id: crypto.randomUUID(),
                      listingId: advancedListing.id,
                      kind: "user_action",
                      message: `Slack ${audience} notification failed. Check webhook configuration.`,
                      at: new Date().toISOString(),
                    },
                    ...prev,
                  ]);
                });
            }
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

            const createdListing = { ...listing, status: automation.updatedStatus };
            const audience = audienceForStatus(createdListing.status);
            if (audience) {
              const taskTitle =
                audience === "marketing"
                  ? "Generate MLS, social and email marketing package"
                  : "Notify transaction team of new listing";
              void notifyTeamInSlack(createdListing, taskTitle, audience)
                .then((result) => handleSlackNotifyResult(result, listing.id, audience, setActivity))
                .catch(() => {
                  setActivity((prev) => [
                    {
                      id: crypto.randomUUID(),
                      listingId: listing.id,
                      kind: "user_action",
                      message: `Slack ${audience} notification failed. Check webhook configuration.`,
                      at: new Date().toISOString(),
                    },
                    ...prev,
                  ]);
                });
            }
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
