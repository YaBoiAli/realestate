import { generateMarketingAssets } from "./marketing";
import { STATUS_LABELS } from "./status";
import type {
  ActivityEvent,
  GeneratedAssets,
  Listing,
  ListingStatus,
  Task,
  TaskPriority,
  WorkflowStage,
} from "./types";

export interface ListingAutomationResult {
  generatedAssets: GeneratedAssets;
  tasks: Task[];
  updatedStatus: ListingStatus;
  activityLog: ActivityEvent[];
}

function createTask(
  listingId: string,
  title: string,
  type: Task["type"],
  stage: WorkflowStage,
  priority: TaskPriority,
  createdAt: string
): Task {
  return {
    id: crypto.randomUUID(),
    listingId,
    title,
    type,
    stage,
    priority,
    completed: true,
    createdAt,
  };
}

/** Media tasks use higher priority when price is in the upper market band. */
function mediaPriority(price: number): TaskPriority {
  return price >= 700_000 ? "high" : "medium";
}

function buildCoreTasks(listing: Listing, now: string): Task[] {
  const photoPriority = mediaPriority(listing.price);

  const tasks: Task[] = [
    createTask(listing.id, "Notify transaction team of new listing", "team_notification", "new_listing", "medium", now),
    createTask(
      listing.id,
      "Generate MLS, social and email marketing package",
      "marketing_content",
      "marketing_prep",
      "medium",
      now
    ),
    createTask(listing.id, "Schedule photographer", "media_task", "media_scheduled", photoPriority, now),
  ];

  if (listing.price > 700_000) {
    tasks.push(createTask(listing.id, "Request drone footage", "media_task", "media_scheduled", "high", now));
  }

  if (listing.price > 800_000) {
    tasks.push(
      createTask(listing.id, "Senior agent review required", "workflow_routing", "ready_to_publish", "high", now)
    );
  }

  if (listing.bedrooms >= 4) {
    tasks.push(
      createTask(listing.id, "Target family buyer segment", "workflow_routing", "marketing_prep", "medium", now)
    );
  }

  if (!listing.description.trim()) {
    tasks.push(
      createTask(listing.id, "Write listing description", "workflow_routing", "marketing_prep", "high", now)
    );
  }

  return tasks;
}

/**
 * Resolves pipeline status after automation from listing + generated tasks.
 * - Intake at `new_listing` advances to Marketing Prep once marketing runs.
 * - Presence of media tasks moves the listing to Media Scheduled (media shoot workflow).
 */
export function determineAutomatedStatus(currentStatus: ListingStatus, tasks: Task[]): ListingStatus {
  if (currentStatus === "live") return "live";

  const hasMediaTask = tasks.some((t) => t.type === "media_task");
  let status: ListingStatus = currentStatus === "new_listing" ? "marketing_prep" : currentStatus;

  if (hasMediaTask) status = "media_scheduled";

  return status;
}

function staggeredAt(baseIso: string, offsetMs: number): string {
  return new Date(new Date(baseIso).getTime() + offsetMs).toISOString();
}

function buildActivityLog(
  listing: Listing,
  tasks: Task[],
  previousStatus: ListingStatus,
  updatedStatus: ListingStatus,
  marketingTone: string,
  baseTime: string
): ActivityEvent[] {
  const id = () => crypto.randomUUID();

  return [
    {
      id: id(),
      listingId: listing.id,
      kind: "listing_created",
      message: `Listing created: ${listing.address}${listing.city ? ` · ${listing.city}, ${listing.state}` : ""}. Intake captured and automation engine started.`,
      at: staggeredAt(baseTime, 0),
    },
    {
      id: id(),
      listingId: listing.id,
      kind: "marketing_generated",
      message: `Marketing generated (${marketingTone}): MLS description, Instagram caption, and email promo draft are ready for review.`,
      at: staggeredAt(baseTime, 400),
    },
    {
      id: id(),
      listingId: listing.id,
      kind: "tasks_routed",
      message: `Automation routed ${tasks.length} tasks: notifications, content, media${tasks.some((t) => t.title.includes("Senior")) ? ", and senior review" : ""}${!listing.description.trim() ? ", plus description drafting" : ""}.`,
      at: staggeredAt(baseTime, 800),
    },
    {
      id: id(),
      listingId: listing.id,
      kind: "status_updated",
      message: `Status updated: ${STATUS_LABELS[previousStatus]} → ${STATUS_LABELS[updatedStatus]}.`,
      at: staggeredAt(baseTime, 1200),
    },
  ];
}

function marketingToneLabel(listing: Listing): string {
  if (listing.price >= 800_000) return "luxury MLS tone";
  if (listing.price >= 650_000) return "upscale MLS tone";
  if (listing.price < 400_000) return "value-focused MLS tone";
  return "mid-market MLS tone";
}

/** Runs the full automation pipeline for a newly created listing. */
export function runListingAutomations(listing: Listing): ListingAutomationResult {
  const now = new Date().toISOString();
  const previousStatus = listing.status;

  const generatedAssets = generateMarketingAssets(listing);
  const tasks = buildCoreTasks(listing, now);
  const updatedStatus = determineAutomatedStatus(listing.status, tasks);
  const tone = marketingToneLabel(listing);

  const activityLog = buildActivityLog(listing, tasks, previousStatus, updatedStatus, tone, now);

  return { generatedAssets, tasks, updatedStatus, activityLog };
}
