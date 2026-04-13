import type { GeneratedAssets, Listing } from "./types";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatPrice(price: number) {
  return `$${numberFormatter.format(price)}`;
}

type PriceTier = "budget" | "mid_market" | "upscale" | "luxury";

function priceTier(price: number): PriceTier {
  if (price < 400_000) return "budget";
  if (price < 650_000) return "mid_market";
  if (price < 800_000) return "upscale";
  return "luxury";
}

function cityAppeal(city: string): string {
  const c = city.trim();
  if (!c) return "a location buyers actively tour";
  return `${c}, where demand stays strong for well-presented homes`;
}

/** Professional MLS-style copy: third person, factual, no hype words like "amazing". */
export function generateMarketingAssets(listing: Listing): GeneratedAssets {
  const fullAddress = `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`.trim();
  const stats = `${listing.bedrooms} bedroom, ${listing.bathrooms} bathroom residence, ${numberFormatter.format(
    listing.squareFeet
  )} square feet`;
  const tier = priceTier(listing.price);
  const familyFriendly = listing.bedrooms >= 3;
  const cityLine = cityAppeal(listing.city);

  const userNotes = listing.description?.trim();

  const tierMLS = {
    budget: `Well-maintained home offered at an approachable price point in ${cityLine}.`,
    mid_market: `Solid value in ${cityLine} with practical updates and move-in readiness.`,
    upscale: `Refined presentation in ${cityLine} with finishes and scale that match the asking price.`,
    luxury: `Executive-caliber home in ${cityLine} with elevated finishes, presence, and buyer appeal.`,
  }[tier];

  const familyMLS = familyFriendly
    ? "The layout supports everyday living with bedrooms and shared spaces that work well for households."
    : "The floor plan is efficient for buyers seeking a right-sized footprint with low-friction upkeep.";

  const bodySource = userNotes
    ? userNotes
    : "Interior spaces are staged for market with neutral tones and strong natural light in key living areas.";

  const propertyDescription = [
    `${tierMLS} ${familyMLS}`,
    `Presented at ${fullAddress}. ${stats}. Listed at ${formatPrice(listing.price)}.`,
    bodySource,
    "Showing coordination and disclosure package available upon request.",
  ].join(" ");

  const emojiLead =
    tier === "luxury"
      ? "✨ Executive listing"
      : tier === "upscale"
        ? "🏡 Just listed"
        : tier === "mid_market"
          ? "🔑 New on market"
          : "🏠 Great value";

  const cityHook = listing.city.trim()
    ? `${listing.city} living — walkable pockets, strong schools nearby, and steady buyer traffic.`
    : "Prime timing for motivated buyers in this pocket.";

  const instagramCaption = [
    `${emojiLead} · ${listing.city.trim() || "New listing"} · ${listing.bedrooms}bd/${listing.bathrooms}ba · ${formatPrice(
      listing.price
    )}`,
    familyFriendly ? "Room to grow 👨‍👩‍👧‍👦" : "Smart layout for busy schedules ⚡",
    cityHook,
    `Tour with ${listing.agentName}. #JustListed #${(listing.city || "Local").replace(/\s+/g, "")} #RealEstate`,
  ].join("\n");

  const emailOpening = {
    budget: "We have a competitively priced new listing that should move quickly with the right exposure.",
    mid_market: "We are launching a balanced new listing that pairs strong fundamentals with broad buyer appeal.",
    upscale: "We are pleased to introduce an upscale listing with finish quality that matches buyer expectations.",
    luxury: "We are debuting a luxury listing with presence, scale, and marketing support aligned to the segment.",
  }[tier];

  const emailPromo = [
    `Subject: New Listing: ${listing.address}${listing.city ? `, ${listing.city}` : ""}`,
    "",
    emailOpening,
    "",
    `Address: ${fullAddress}`,
    `Asking price: ${formatPrice(listing.price)}`,
    `Details: ${stats}.`,
    "",
    userNotes ? `Agent notes: ${userNotes}` : "Description drafting is in progress where notes were not provided at intake.",
    "",
    `Why ${listing.city.trim() || "this market"}: ${cityLine}.`,
    "",
    familyFriendly
      ? "Positioning: highlight flexible bedrooms and shared living space for family-oriented buyers."
      : "Positioning: emphasize efficiency, lifestyle fit, and turnkey readiness.",
    "",
    `For tours or buyer questions: ${listing.agentName} · ${listing.agentEmail}`,
  ].join("\n");

  return {
    listingId: listing.id,
    propertyDescription,
    instagramCaption,
    emailPromo,
  };
}
