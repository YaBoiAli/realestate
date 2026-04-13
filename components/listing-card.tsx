import { BedDouble, Bath, Maximize2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";
import { StatusBadge } from "./status-badge";

const numberFormatter = new Intl.NumberFormat("en-US");

export function ListingCard({
  listing,
  onSelect,
  onAdvance,
  compact = false,
}: {
  listing: Listing;
  onSelect: (id: string) => void;
  onAdvance: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <motion.div
      layout
      className="listing-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(listing.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(listing.id);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-slate-900">{listing.address}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {listing.city}, {listing.state}
          </p>
        </div>
        <StatusBadge status={listing.status} />
      </div>
      <p className={`font-semibold tracking-tight text-slate-950 ${compact ? "mt-2 text-lg" : "mt-3 text-xl"}`}>
        ${numberFormatter.format(listing.price)}
      </p>
      <div className={`mt-2 ${compact ? "flex flex-wrap gap-2" : "grid grid-cols-3 gap-2"} text-xs text-slate-500`}>
        <span className="inline-flex items-center gap-1">
          <BedDouble size={12} />
          {listing.bedrooms}bd
        </span>
        <span className="inline-flex items-center gap-1">
          <Bath size={12} />
          {listing.bathrooms}ba
        </span>
        <span className="inline-flex items-center gap-1">
          <Maximize2 size={12} />
          {numberFormatter.format(listing.squareFeet)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">
        <p className="text-xs text-slate-500">Agent: {listing.agentName}</p>
        {listing.status !== "live" && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(listing.id);
            }}
          >
            <Sparkles size={12} />
            Advance
          </button>
        )}
      </div>
    </motion.div>
  );
}
