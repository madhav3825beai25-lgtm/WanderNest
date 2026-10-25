import { getDb } from "../lib/server/db.js";
import { methodNotAllowed } from "../lib/server/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return res.status(200).json({
      ok: true,
      service: "WanderNest API",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed.", error);
    return res.status(503).json({
      ok: false,
      service: "WanderNest API",
      database: "unavailable",
      message: "Configure MongoDB connection and check the server logs.",
    });
  }
}
