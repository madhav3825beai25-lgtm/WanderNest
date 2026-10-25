import { getDb } from "../lib/server/db.js";
import { escapeRegex, methodNotAllowed, safeError } from "../lib/server/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const db = await getDb();
    const queryText = String(req.query?.q || "").trim().slice(0, 80);
    const query = queryText
      ? { $or: [
          { name: { $regex: escapeRegex(queryText), $options: "i" } },
          { country: { $regex: escapeRegex(queryText), $options: "i" } },
        ] }
      : {};

    const destinations = await db.collection("destinations")
      .find(query, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ count: destinations.length, destinations });
  } catch (error) {
    return safeError(res, error, "Unable to retrieve destinations.");
  }
}
