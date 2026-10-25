import { getDb } from "../lib/server/db.js";
import { escapeRegex, methodNotAllowed, parsePositiveInt, safeError } from "../lib/server/http.js";

const sortOptions = {
  priceAsc: { price: 1, id: 1 },
  priceDesc: { price: -1, id: 1 },
  rating: { rating: -1, id: 1 },
  name: { name: 1 },
  recommended: { rating: -1, price: 1 },
};

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const db = await getDb();
    const page = parsePositiveInt(req.query?.page, 1, 100000);
    const limit = parsePositiveInt(req.query?.limit, 24, 100);
    const skip = (page - 1) * limit;
    const query = {};

    const destinationId = Number(req.query?.destinationId);
    if (Number.isInteger(destinationId) && destinationId > 0) query.destinationId = destinationId;

    const minPrice = Number(req.query?.minPrice);
    if (req.query?.minPrice !== undefined && Number.isFinite(minPrice) && minPrice >= 0) {
      query.price = { ...(query.price || {}), $gte: minPrice };
    }
    const maxPrice = Number(req.query?.maxPrice);
    if (req.query?.maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice >= 0) {
      query.price = { ...(query.price || {}), $lte: maxPrice };
    }
    const minRating = Number(req.query?.minRating);
    if (req.query?.minRating !== undefined && Number.isFinite(minRating)) query.rating = { $gte: minRating };

    const search = String(req.query?.q || "").trim().slice(0, 80);
    if (search) {
      const escaped = escapeRegex(search);
      query.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { location: { $regex: escaped, $options: "i" } },
        { room: { $regex: escaped, $options: "i" } },
        { amenities: { $elemMatch: { $regex: escaped, $options: "i" } } },
      ];
    }

    const sort = sortOptions[String(req.query?.sort || "recommended")] || sortOptions.recommended;
    const collection = db.collection("hotels");
    const [total, results] = await Promise.all([
      collection.countDocuments(query),
      collection.find(query, { projection: { _id: 0 } }).sort(sort).skip(skip).limit(limit).toArray(),
    ]);

    return res.status(200).json({ page, limit, total, totalPages: Math.ceil(total / limit), hotels: results });
  } catch (error) {
    return safeError(res, error, "Unable to retrieve hotels.");
  }
}
