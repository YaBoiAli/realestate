import type { Listing } from "@/lib/types";

interface SummaryCardsProps {
  listings: Listing[];
}

export function SummaryCards({ listings }: SummaryCardsProps) {
  const totals = {
    total: listings.length,
    newListings: listings.filter((l) => l.status === "new_listing").length,
    inProgress: listings.filter((l) =>
      ["marketing_prep", "media_scheduled", "ready_to_publish"].includes(l.status)
    ).length,
    live: listings.filter((l) => l.status === "live").length,
  };

  const cards = [
    { label: "Total Listings", value: totals.total },
    { label: "New Listings", value: totals.newListings },
    { label: "In Progress", value: totals.inProgress },
    { label: "Live", value: totals.live },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="surface-card p-5">
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
