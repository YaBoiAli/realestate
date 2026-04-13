import type { ActivityEvent, GeneratedAssets, Listing, Task } from "@/lib/types";

interface ListingDetailProps {
  listing: Listing | null;
  tasks: Task[];
  assets?: GeneratedAssets;
  activity: ActivityEvent[];
}
const STATUS_LABELS: Record<Listing["status"], string> = {
  new_listing: "New Listing",
  marketing_prep: "Marketing Prep",
  media_scheduled: "Media Scheduled",
  ready_to_publish: "Ready to Publish",
  live: "Live",
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

export function ListingDetail({ listing, tasks, assets, activity }: ListingDetailProps) {
  if (!listing) {
    return (
      <aside className="surface-card border-dashed p-5 text-sm text-slate-500">
        Select a listing card to view generated assets, tasks, and activity.
      </aside>
    );
  }

  return (
    <aside className="surface-card space-y-4 p-5">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">{listing.address}</h3>
          <span className={`status-badge status-${listing.status}`}>{STATUS_LABELS[listing.status]}</span>
        </div>
        <p className="text-sm text-slate-500">
          {listing.city}, {listing.state} {listing.zip}
        </p>
      </div>

      <section>
        <h4 className="text-sm font-semibold text-slate-700">Automation Tasks</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium text-slate-800">{task.title}</p>
              <p className={task.completed ? "text-emerald-600 text-xs" : "text-amber-600 text-xs"}>
                {task.completed ? "Completed" : "Pending"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-slate-700">Generated Assets</h4>
        {assets ? (
          <div className="mt-2 space-y-2 text-sm">
            <article className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium text-slate-800">Property Description</p>
              <p className="text-slate-600">{assets.propertyDescription}</p>
            </article>
            <article className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium text-slate-800">Instagram Caption</p>
              <p className="text-slate-600">{assets.instagramCaption}</p>
            </article>
            <article className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium text-slate-800">Email Promo</p>
              <pre className="whitespace-pre-wrap text-slate-600">{assets.emailPromo}</pre>
            </article>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No generated assets yet.</p>
        )}
      </section>

      <section>
        <h4 className="text-sm font-semibold text-slate-700">Activity Timeline</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {activity.map((event) => (
            <li key={event.id} className="rounded-lg border border-slate-200 p-2 text-slate-600">
              <p>{event.message}</p>
              <p className="mt-1 text-xs text-slate-400">{dateTimeFormatter.format(new Date(event.at))} UTC</p>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
