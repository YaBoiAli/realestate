import type { ActivityEvent, GeneratedAssets, Listing, Task } from "./types";
import { generateMarketingAssets } from "./marketing";

const BASE_TIME_ISO = "2026-04-13T12:00:00.000Z";
const baseMs = Date.parse(BASE_TIME_ISO);
const hoursAgo = (hours: number) => new Date(baseMs - hours * 60 * 60 * 1000).toISOString();

export const seedListings: Listing[] = [
  {
    id: "lst_1",
    address: "1207 Oak Meadow Dr",
    city: "Dallas",
    state: "TX",
    zip: "75204",
    price: 625000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2410,
    description: "Fresh interior updates, open kitchen, and a landscaped backyard with patio.",
    agentName: "Maya Torres",
    agentEmail: "maya@localpro.com",
    status: "marketing_prep",
    createdAt: hoursAgo(8),
  },
  {
    id: "lst_2",
    address: "889 Lakeview Ln",
    city: "Plano",
    state: "TX",
    zip: "75023",
    price: 510000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1985,
    description: "Single-story floor plan with natural light and newly updated appliances.",
    agentName: "Jordan Lee",
    agentEmail: "jordan@localpro.com",
    status: "media_scheduled",
    createdAt: hoursAgo(20),
  },
  {
    id: "lst_3",
    address: "4420 Pine Crest Ct",
    city: "Frisco",
    state: "TX",
    zip: "75035",
    price: 789000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3320,
    description: "Premium corner lot with upgraded finishes and dedicated office space.",
    agentName: "Riley Shah",
    agentEmail: "riley@localpro.com",
    status: "live",
    createdAt: hoursAgo(30),
  },
];

export const seedAssets: GeneratedAssets[] = seedListings.map((listing) =>
  generateMarketingAssets(listing)
);

export const seedTasks: Task[] = [
  {
    id: "tsk_1",
    listingId: "lst_1",
    title: "Notify transaction team of new listing",
    type: "team_notification",
    stage: "new_listing",
    priority: "medium",
    completed: true,
    createdAt: hoursAgo(7),
  },
  {
    id: "tsk_2",
    listingId: "lst_2",
    title: "Photography requested for this property",
    type: "media_task",
    stage: "media_scheduled",
    priority: "high",
    completed: true,
    createdAt: hoursAgo(18),
  },
];

export const seedActivity: ActivityEvent[] = [
  {
    id: "act_1",
    listingId: "lst_1",
    kind: "listing_created",
    message: "Listing created: 1207 Oak Meadow Dr · Dallas, TX. Intake captured and automation engine started.",
    at: hoursAgo(7.6),
  },
  {
    id: "act_1b",
    listingId: "lst_1",
    kind: "marketing_generated",
    message:
      "Marketing generated (mid-market MLS tone): MLS description, Instagram caption, and email promo draft are ready for review.",
    at: hoursAgo(7.55),
  },
  {
    id: "act_2",
    listingId: "lst_2",
    kind: "user_action",
    message: "Media task completed by vendor coordinator.",
    at: hoursAgo(14),
  },
];
