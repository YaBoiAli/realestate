"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { STATUS_LABELS } from "@/lib/status";
import type { Listing, WorkflowStage } from "@/lib/types";

type ListingInput = Omit<Listing, "id" | "createdAt">;

const initialState: ListingInput = {
  address: "",
  city: "",
  state: "",
  zip: "",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  squareFeet: 0,
  description: "",
  agentName: "",
  agentEmail: "",
  status: "new_listing",
};

interface NewListingDrawerProps {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (input: ListingInput) => void;
}

export function NewListingDrawer({ open, creating, onClose, onCreate }: NewListingDrawerProps) {
  const [form, setForm] = useState<ListingInput>(initialState);
  const update = <K extends keyof ListingInput>(key: K, value: ListingInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">New Listing Intake</h2>
                <p className="text-sm text-slate-500">Capture listing details to trigger automations.</p>
              </div>
              <button className="rounded-md p-1 hover:bg-slate-100" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                onCreate(form);
                setForm(initialState);
              }}
            >
              {[
                { key: "address", label: "Property address", type: "text" },
                { key: "city", label: "City", type: "text" },
                { key: "state", label: "State", type: "text" },
                { key: "zip", label: "ZIP", type: "text" },
                { key: "price", label: "Price", type: "number" },
                { key: "bedrooms", label: "Bedrooms", type: "number" },
                { key: "bathrooms", label: "Bathrooms", type: "number" },
                { key: "squareFeet", label: "Square feet", type: "number" },
                { key: "agentName", label: "Agent name", type: "text" },
                { key: "agentEmail", label: "Agent email", type: "email" },
              ].map((field) => (
                <label key={field.key} className="form-field">
                  {field.label}
                  <input
                    required
                    type={field.type}
                    className="input"
                    value={String(form[field.key as keyof ListingInput])}
                    onChange={(e) =>
                      update(
                        field.key as keyof ListingInput,
                        field.type === "number"
                          ? Number(e.target.value)
                          : (e.target.value as ListingInput[keyof ListingInput])
                      )
                    }
                  />
                </label>
              ))}

              <label className="form-field sm:col-span-2">
                Listing description
                <textarea
                  required
                  className="input min-h-24"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </label>

              <label className="form-field sm:col-span-2">
                Pipeline stage
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as WorkflowStage)}
                >
                  <option value="new_listing">{STATUS_LABELS.new_listing}</option>
                  <option value="marketing_prep">{STATUS_LABELS.marketing_prep}</option>
                  <option value="media_scheduled">{STATUS_LABELS.media_scheduled}</option>
                  <option value="ready_to_publish">{STATUS_LABELS.ready_to_publish}</option>
                </select>
              </label>

              <button type="submit" className="btn-primary sm:col-span-2" disabled={creating}>
                {creating ? "Running automations..." : "Create Listing"}
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
