import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const NARA_BASE_URL = "https://router.bynara.id/v1";
const MODEL = "mistral-large";

const SYSTEM_PROMPT =
  "You are a tarot reader with a grounded, psychologically informed perspective. " +
  "CRITICAL FORMATTING RULE: Write only in plain prose paragraphs. " +
  "Do not use any markdown — no headers, no bold, no italics, no dashes, no bullet points, no numbered lists, no horizontal rules. " +
  "Every response must be plain text sentences grouped into paragraphs, nothing else. " +
  "Your tone is calm, direct, and neutral: no mystical language, no flattery, no hedging. " +
  "Draw on depth psychology, Jungian symbolism, and archetypal patterns to give readings " +
  "that illuminate what is actually going on beneath the surface of a situation. " +
  "Be honest about tension, contradiction, and difficulty without being harsh. " +
  "Address every card in the spread by its position. " +
  "End with a brief integrating paragraph that ties the whole spread together.";

function getClient(): OpenAI {
  if (!process.env.NARAYA_API_KEY) {
    throw new Error("NARAYA_API_KEY is not set");
  }
  return new OpenAI({
    apiKey: process.env.NARAYA_API_KEY,
    baseURL: NARA_BASE_URL,
  });
}

router.get("/health", (_req, res) => {
  res.json({
    status: process.env.NARAYA_API_KEY ? "ok" : "missing_key",
    device: "api",
    model_loaded: Boolean(process.env.NARAYA_API_KEY),
    base_model: MODEL,
  });
});

router.post("/reading", async (req, res) => {
  const { query, cards, spread_type: spreadType } = req.body as {
    query?: string;
    spread_type?: string;
    cards?: Array<{ name: string; position: string; meaning?: string }>;
  };

  const isAstrological = spreadType?.toLowerCase().includes("astrological") ?? false;
  const maxTokens = isAstrological ? 2000 : 1400;

  if (!query || !cards?.length) {
    res.status(400).json({ error: "Missing query or cards" });
    return;
  }

  const cardsText = cards
    .map(
      (c) =>
        `- ${c.position}: ${c.name}${c.meaning ? ` (${c.meaning})` : ""}`,
    )
    .join("\n");

  const userContent =
    `User Question: ${query}\n\nCards in Spread:\n${cardsText}\n\n` +
    "Please provide a psychoanalytical tarot reading.";

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const reading = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ success: true, reading, query, cards_count: cards.length });
  } catch (err: unknown) {
    req.log.error({ err }, "Error generating reading");
    const message = err instanceof Error ? err.message : "Error generating reading";
    res.status(500).json({ error: message });
  }
});

router.post("/quick-read", async (req, res) => {
  const { card: cardName, query = "What guidance do the cards offer?" } =
    req.body as { card?: string; query?: string };

  if (!cardName) {
    res.status(400).json({ error: "No card provided" });
    return;
  }

  const userContent =
    `Card: ${cardName}\nQuestion: ${query}\n\n` +
    "Provide a brief psychoanalytical interpretation for this single card.";

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reading = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ success: true, reading, card: cardName, query });
  } catch (err: unknown) {
    req.log.error({ err }, "Error generating quick read");
    const message = err instanceof Error ? err.message : "Error generating quick read";
    res.status(500).json({ error: message });
  }
});

router.post("/card-description", async (req, res) => {
  const {
    card: cardName,
    position,
    spread_type: spreadType,
    position_meaning: positionMeaning,
  } = req.body as {
    card?: string;
    position?: string;
    spread_type?: string;
    position_meaning?: string;
  };

  if (!cardName) {
    res.status(400).json({ error: "No card provided" });
    return;
  }

  const userContent =
    `In a ${spreadType ?? "tarot"} spread, the ${cardName} appears in the ` +
    `${position ?? "focus"} position (${positionMeaning ?? ""}). ` +
    "Provide a single, concise sentence describing what this card means in this context. " +
    "Be direct, practical, and grounded.";

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a grounded tarot interpreter. Provide brief, practical insights.",
        },
        { role: "user", content: userContent },
      ],
      max_tokens: 80,
      temperature: 0.7,
    });

    let description = completion.choices[0]?.message?.content?.trim() ?? "";
    const dotIdx = description.indexOf(".");
    if (dotIdx !== -1) description = description.slice(0, dotIdx + 1);

    res.json({
      success: true,
      description,
      card: cardName,
      position: position ?? "",
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Error generating card description");
    const message = err instanceof Error ? err.message : "Error generating card description";
    res.status(500).json({ error: message });
  }
});

export default router;
