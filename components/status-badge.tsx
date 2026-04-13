import type { ListingStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/status";

export function StatusBadge({ status }: { status: ListingStatus }) {
  return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status]}</span>;
}
