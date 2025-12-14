import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import type { RawPageExtraction } from "@/types/documents";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are a freight brokerage data entry clerk. Read the attached freight page image and return ONLY JSON with the following shape:
{
  "document_type": "BOL" | "POD" | "RATE_CONFIRMATION" | "UNKNOWN",
  "shipper_name": string | null,
  "shipper_address": string | null,
  "consignee_name": string | null,
  "consignee_address": string | null,
  "bill_to_name": string | null,
  "bill_to_address": string | null,
  "bol_number": string | null,
  "pro_number": string | null,
  "po_number": string | null,
  "pickup_date": string | null,
  "delivery_date": string | null,
  "total_weight_lbs": number | null,
  "quantity": number | null,
  "pieces": number | null,
  "handwritten_notes": string | null
}

Rules:
- Missing or illegible fields MUST be null.
- Document types: look for headers such as "Bill of Lading", "Proof of Delivery", "Rate Confirmation".
- Shipper, Consignee, and Bill To are distinct parties. Use the labels on the page.
- Handwritten notes should be captured verbatim.
- Do not guess or infer data across pages. Use only the visible page.
- Output JSON only. No markdown, no prose.
`.trim();

const createClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  return new Anthropic({ apiKey });
};

const parseResponse = (content: Array<{ type: string; text?: string }>) => {
  const textBlock = content.find((entry) => entry.type === "text" && entry.text);
  if (!textBlock) {
    throw new Error("Claude response did not include text content.");
  }
  try {
    return JSON.parse(textBlock.text as string) as RawPageExtraction;
  } catch (error) {
    throw new Error("Claude response was not valid JSON.");
  }
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      page: number;
      image: string;
      contentType: string;
    };

    if (!body?.image || !body?.contentType) {
      return NextResponse.json(
        { error: "Missing image payload or content type." },
        { status: 400 },
      );
    }

    const client = createClient();
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 600,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract freight fields from this page image." },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: body.contentType,
                data: body.image,
              },
            },
          ],
        },
      ],
    });

    const parsed = parseResponse(response.content);

    return NextResponse.json({
      page: body.page ?? 1,
      ...parsed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Extraction failed." },
      { status: 500 },
    );
  }
}
