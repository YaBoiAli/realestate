"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";

type ListingInput = Omit<Listing, "id" | "createdAt" | "status">;

interface IntakeFormProps {
  onCreate: (input: ListingInput) => void;
}

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
};

export function IntakeForm({ onCreate }: IntakeFormProps) {
  const [form, setForm] = useState<ListingInput>(initialState);

  const update = <K extends keyof ListingInput>(key: K, value: ListingInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="surface-card p-6">
      <h2 className="text-xl font-semibold text-slate-900">New Listing Intake</h2>
      <p className="mt-1 text-sm text-slate-500">Capture listing details and trigger automated ops.</p>

      <form
        className="mt-5 grid gap-3 md:grid-cols-2"
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
          <label key={field.key} className="flex flex-col gap-1 text-sm text-slate-600">
            {field.label}
            <input
              required
              type={field.type}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-indigo-200 focus:ring"
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

        <label className="md:col-span-2 flex flex-col gap-1 text-sm text-slate-600">
          Listing description
          <textarea
            required
            className="min-h-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-indigo-200 focus:ring"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="md:col-span-2 mt-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500"
        >
          Create Listing + Trigger Automations
        </button>
      </form>
    </section>
  );
}
