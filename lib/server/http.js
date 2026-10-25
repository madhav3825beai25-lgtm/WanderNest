export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return res.status(405).json({ error: `Method not allowed. Use ${allowed.join(" or ")}.` });
}

export function safeError(res, error, message = "An unexpected server error occurred.") {
  // Log full diagnostics to server logs only; never send secrets or stack traces to clients.
  console.error(message, error);
  return res.status(500).json({ error: message });
}

export function parsePositiveInt(value, fallback, max = 1000000) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) return fallback;
  return parsed;
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parsePrice(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const amount = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}
