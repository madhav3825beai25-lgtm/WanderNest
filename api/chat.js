import destinations from "../src/data/destinations.js";
import packages from "../src/data/packages.js";

const catalog = {
  destinations: destinations.map(({ id, name, country, duration }) => ({
    name,
    country,
    duration,
    page: `/destinations/${id}`,
  })),
  packages: packages.map(({ id, title, location, duration, includes }) => ({
    title,
    location,
    duration,
    includes,
    page: `/packages/${id}`,
  })),
};

const instructions = [
  "You are Ask WanderNest, the AI travel assistant for the WanderNest website.",
  "Help visitors explore destinations, compare packages, and plan itineraries.",
  "Reply in the visitor's language. Use concise plain text.",
  "Use the catalog below for WanderNest listings. You may include relevant page paths from it.",
  "Never invent live availability, prices, or booking details.",
  "For account, booking, and payment issues direct visitors to /contact.",
  "Never ask for passwords, card details, or OTPs.",
  `WanderNest catalog: ${JSON.stringify(catalog)}`,
].join("\n");

const requests = new Map();
let cleanupAt = 0;

function isRateLimited(ip) {
  const now = Date.now();

  if (now >= cleanupAt) {
    for (const [key, entry] of requests) {
      if (entry.expiresAt <= now) requests.delete(key);
    }
    cleanupAt = now + 60_000;
  }

  const entry = requests.get(ip);

  if (!entry || entry.expiresAt <= now) {
    requests.set(ip, { count: 1, expiresAt: now + 60_000 });
    return false;
  }

  if (entry.count >= 10) return true;

  entry.count += 1;
  return false;
}

export default async function chat(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for chat messages." });
  }

  const messages = req.body?.messages;
  const validMessages =
    Array.isArray(messages) &&
    messages.length >= 1 &&
    messages.length <= 9 &&
    messages.length % 2 === 1 &&
    messages.every((message, index) => {
      const isUser = index % 2 === 0;
      return (
        message?.role === (isUser ? "user" : "assistant") &&
        typeof message.text === "string" &&
        message.text.trim().length > 0 &&
        message.text.length <= (isUser ? 1000 : 4000)
      );
    });

  if (!validMessages) {
    return res.status(400).json({
      error: "Enter a travel question of up to 1,000 characters.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

  if (!apiKey) {
    return res.status(503).json({
      error: "The travel assistant is currently unavailable.",
    });
  }

  const ip =
    req.ip ||
    (process.env.VERCEL && req.headers?.["x-vercel-forwarded-for"]) ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({
      error: "Too many messages. Try again in a minute.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instructions }] },
          contents: messages.map(({ role, text }) => ({
            role: role === "assistant" ? "model" : "user",
            parts: [{ text: text.trim() }],
          })),
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini chat HTTP status:", response.status);
      return res.status(503).json({
        error: "The travel assistant is temporarily unavailable. Try again shortly.",
      });
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const reply = parts
      .filter((part) => !part.thought && typeof part.text === "string")
      .map((part) => part.text)
      .join("")
      .trim()
      .slice(0, 4000);

    if (!reply) {
      return res.status(422).json({
        error: "Try rephrasing your travel question.",
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini chat request failed:", error.name);
    return res.status(503).json({
      error: "The travel assistant is temporarily unavailable. Try again shortly.",
    });
  }
}