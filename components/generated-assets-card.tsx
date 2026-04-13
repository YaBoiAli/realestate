import type { GeneratedAssets } from "@/lib/types";
import { Mail, Megaphone, Sparkles } from "lucide-react";

export function GeneratedAssetsCard({ assets }: { assets?: GeneratedAssets }) {
  if (!assets) {
    return (
      <div className="empty-state">
        Run new listing intake to generate MLS copy, social, and email drafts automatically.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-indigo-100 bg-indigo-50/80 px-3 py-2 text-xs text-indigo-900">
        <span className="font-semibold">AI marketing bundle</span> — tuned to price, bedrooms, and city. Edit before publish.
      </p>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Megaphone size={14} className="text-indigo-500" aria-hidden />
          Property description <span className="font-normal normal-case text-slate-400">(MLS tone)</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700">{assets.propertyDescription}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Sparkles size={14} className="text-pink-500" aria-hidden />
          Instagram caption <span className="font-normal normal-case text-slate-400">(short, emoji-friendly)</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{assets.instagramCaption}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Mail size={14} className="text-slate-500" aria-hidden />
          Email promo <span className="font-normal normal-case text-slate-400">(professional)</span>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">{assets.emailPromo}</pre>
      </article>
    </div>
  );
}
