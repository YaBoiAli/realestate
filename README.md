# LocalPRO Listing Flow

LocalPRO Listing Flow is a polished internal workflow demo for real estate operations teams.  
It helps agents and coordinators intake new listings, trigger automated follow-up work, and track each listing from **New Listing** to **Live**.

## Why It Was Designed This Way

- **Fast to demo:** single-page flow with clear sections for intake, board status, and listing details.
- **Low complexity:** local in-memory state and seed data avoid backend setup.
- **Real workflow feel:** each new listing automatically creates tasks, generated marketing assets, and timeline events.
- **5-minute Loom ready:** open dashboard, submit form, show generated outputs, then advance stage.

## Stack

- Next.js
- TypeScript
- Tailwind CSS

## Features

### Dashboard
- Header branded as **LocalPRO Listing Flow**
- Summary cards:
  - Total Listings
  - New Listings
  - In Progress
  - Live
- Pipeline board columns:
  - New Listing
  - Marketing Prep
  - Media Scheduled
  - Ready to Publish
  - Live
- Listing cards show:
  - Address
  - Price
  - Beds/Baths
  - Agent name
  - Created date
- Search/filter by address, city, or agent

### New Listing Intake
- Property address
- City
- State
- ZIP
- Price
- Bedrooms
- Bathrooms
- Square feet
- Listing description
- Agent name
- Agent email

On submit:
1. Listing is added
2. Default status is created as **New Listing**
3. Automations are generated
4. Auto-advanced to **Marketing Prep** for demo flow

### Automation Simulation

For each new listing, the app automatically creates:
1. Team notification task
2. Marketing content package:
   - property description
   - Instagram caption
   - short email promo
3. Media task request

Generated marketing copy is deterministic and based on listing inputs (no external API key needed).

### Listing Details Panel
- Automation tasks with completion state
- Generated assets section
- Activity timeline

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  intake-form.tsx
  listing-detail.tsx
  pipeline-board.tsx
  summary-cards.tsx
lib/
  marketing.ts
  seed-data.ts
  types.ts
```

## Run Locally

```bash
npm install
npm run dev
```

### Optional Slack Automation

To send automation notifications to dedicated Slack channels, add these env vars:

```bash
SLACK_WEBHOOK_TRANSACTION_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
SLACK_WEBHOOK_MARKETING_URL=https://hooks.slack.com/services/AAA/BBB/CCC
```

Then restart `npm run dev`. New listing intake calls `POST /api/slack/notify` with:
- `audience: transaction` for transaction-team alerts
- `audience: marketing` for marketing-team alerts

Open [http://localhost:3000](http://localhost:3000).

## Suggested 5-Minute Demo Flow

1. Open dashboard and summary cards
2. Show seeded listings already in multiple stages
3. Create a new listing through intake form
4. Show generated tasks + marketing assets + timeline
5. Click **Advance Stage** on board cards to move toward **Live**

## What I Would Build Next (Production)

- Persistent database (Postgres)
- Auth and role-based access
- Real event queue/webhooks for automations
- SLA timers and overdue alerts
- Audit logs and reporting
- CRM/MLS integration
- Rich permissions and team assignments
