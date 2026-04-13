import { Building2, CircleCheckBig, Clock3, Radar } from "lucide-react";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";

export function OverviewStats({ listings }: { listings: Listing[] }) {
  const metrics = [
    {
      label: "Total Listings",
      value: listings.length,
      icon: Building2,
    },
    {
      label: "In Progress",
      value: listings.filter((l) => ["marketing_prep", "media_scheduled", "ready_to_publish"].includes(l.status))
        .length,
      icon: Radar,
    },
    {
      label: "Awaiting Media",
      value: listings.filter((l) => l.status === "marketing_prep").length,
      icon: Clock3,
    },
    {
      label: "Live",
      value: listings.filter((l) => l.status === "live").length,
      icon: CircleCheckBig,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <motion.article
            key={metric.label}
            className="surface-card p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <Icon size={16} className="text-slate-400" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
          </motion.article>
        );
      })}
    </section>
  );
}
