import type { ListingStatus } from "./types";

export const STATUS_ORDER: ListingStatus[] = [
  "new_listing",
  "marketing_prep",
  "media_scheduled",
  "ready_to_publish",
  "live",
];

export const STATUS_LABELS: Record<ListingStatus, string> = {
  new_listing: "New Listing",
  marketing_prep: "Marketing Prep",
  media_scheduled: "Media Scheduled",
  ready_to_publish: "Ready to Publish",
  live: "Live",
};

export function nextStatus(status: ListingStatus): ListingStatus {
  const i = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[Math.min(i + 1, STATUS_ORDER.length - 1)]!;
}
