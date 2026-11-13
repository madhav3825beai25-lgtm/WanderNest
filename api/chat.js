import destinations from "../src/data/destinations.js";
import packages from "../src/data/packages.js";
import { methodNotAllowed } from "../lib/server/http.js";

const catalog = JSON.stringify({
  destinations: destinations.map(({ name, country, duration }) => ({ name, country, duration })),
  packages: packages.map(({ title, location, duration, includes }) => ({ title, location, duration, includes })),
});

const instruction = [
  "You are the WanderNest travel assistant. Help with destinations, suggested itineraries, packages, and site navigation.",
  "Answer in the visitor's language when possible. Use concise plain text and ask one focused follow-up if useful.",
  "Use the reference catalog below for WanderNest listings. Direct visitors to /destinations, /packages, /hotels, or /contact as appropriate.",
  "You have no live prices, availability, booking records, or ability to make changes. Never invent those details or ask for credentials, payment details, or other sensitive information.",
  "Reference catalog: " + catalog,
].join("\n");

const limits = new Map();
let nextCleanup = 0;

function allowRequest(clientIp) {
  const now = Date.now();
  if (now >= nextCleanup) {
    for (const [ip, window] of limits) {
      if (window.expires <= now) limits.delete(ip);
    }
    nextCleanup = now + 60_000;
  }
  const window = limits.get(clientIp);
  if (!window || window.expires <= now) {
    limits.set(clientIp, { count: 1, expires: now + 60_000 });
    return true;
  }
  if (window.count >= 10) return false;
  window.count += 1;
  return true;
}

export default async function chat(req, res, options = {}) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  res.setHeader("Cache-Control", "no-store");
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 9 ||
      messages.length % 2 === 0 || messages.some((message, index) =>
        message?.role !== (index % 2 === 0 ? "user" : "assistant") ||
        typeof message.text !== "string" || !message.text.trim() ||
        message.text.length > (index % 2 === 0 ? 1000 : 4000))) {
    return res.status(400).json({ error: "Send a message of up to 1,000 characters." });
  }

  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
  const model = options.model || process.env.GEMINI_MODEL || "gemini-3.8-flash";
  if (!apiKey) {
    return res.status(503).json({ error: "The travel assistant is currently unavailable." });
  }
  const clientIp = options.clientIp || req.headers?.["x-vercel-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!allowRequest(clientIp)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many messages. Try again in a minute." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instruction }] },
          contents: messages.map(({ role, text }) => ({
            role: role === "assistant" ? "model" : "user",
            parts: [{ text: text.trim() }],
          })),
          generationConfig: { maxOutputTokens: 1024, thinkingConfig: { thinkingLevel: "MINIMAL" } },
        }),
      }
    );
    if (!response.ok) {
      console.error("Gemini chat returned HTTP", response.status);
      return res.status(503).json({ error: "The travel assistant is temporarily unavailable. Try again shortly." });
    }
    const result = await response.json();
    const reply = result.candidates?.[0]?.content?.parts
      ?.filter((part) => !part.thought && typeof part.text === "string")
      .map((part) => part.text).join("").trim().slice(0, 4000);
    if (!reply) {
      return res.status(422).json({ error: "I couldn't answer that. Try rephrasing your travel question." });
    }
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini chat request failed:", error.name);
    return res.status(503).json({ error: "The travel assistant is temporarily unavailable. Try again shortly." });
  }
}
