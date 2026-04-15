import { NextResponse } from "next/server";

interface SlackNotifyRequest {
  listingId: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  stage: string;
  agentName: string;
  taskTitle: string;
  audience: "transaction" | "marketing";
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SlackNotifyRequest;
    const webhookByAudience: Record<SlackNotifyRequest["audience"], string | undefined> = {
      transaction: process.env.SLACK_WEBHOOK_TRANSACTION_URL,
      marketing: process.env.SLACK_WEBHOOK_MARKETING_URL,
    };
    const webhookUrl = webhookByAudience[body.audience];

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: true,
          skipped: true,
          reason: `Webhook not configured for ${body.audience}. Set ${
            body.audience === "transaction" ? "SLACK_WEBHOOK_TRANSACTION_URL" : "SLACK_WEBHOOK_MARKETING_URL"
          }.`,
        },
        { status: 200 }
      );
    }

    const location = [body.city, body.state].filter(Boolean).join(", ");
    const isMarketing = body.audience === "marketing";

    const headerTitle = isMarketing
      ? "This listing is ready for marketing"
      : "This listing is live";

    const previewText = isMarketing
      ? `Ready for marketing: ${body.address}`
      : `Listing is live: ${body.address}`;

    const introLine = isMarketing
      ? "_Creative, MLS, and campaign work can start from this handoff._"
      : "_Transaction team: coordinate contract, disclosures, and closing next steps._";

    const message = {
      text: previewText,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: headerTitle,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              `${introLine}\n\n` +
              `*Property:* ${body.address}\n` +
              `*Location:* ${location || "N/A"}\n` +
              `*Price:* ${currencyFormatter.format(body.price)}\n` +
              `*Layout:* ${body.bedrooms}bd / ${body.bathrooms}ba\n` +
              `*Stage:* ${body.stage}\n` +
              `*Agent:* ${body.agentName}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Source: ${body.taskTitle}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json({ ok: false, error: details || "Slack webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, audience: body.audience });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected Slack notify error" },
      { status: 500 }
    );
  }
}
