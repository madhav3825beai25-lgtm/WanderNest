import { randomBytes } from "node:crypto";
import { getDb } from "../lib/server/db.js";
import { requireFirebaseUser } from "../lib/server/firebase.js";
import { methodNotAllowed, parsePrice, safeError } from "../lib/server/http.js";

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function nightsBetween(checkIn, checkOut) {
  return Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000);
}

function reference() {
  return `WN-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) return methodNotAllowed(res, ["GET", "POST"]);

  const user = await requireFirebaseUser(req, res);
  if (!user) return;

  try {
    const db = await getDb();
    const bookings = db.collection("bookings");

    if (req.method === "GET") {
      const records = await bookings.find({ userId: user.uid }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 }).limit(100).toArray();
      return res.status(200).json({ bookings: records });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const bookingType = String(body.bookingType || "hotel");
    if (!["hotel", "trip", "package"].includes(bookingType)) {
      return res.status(400).json({ error: "bookingType must be hotel, trip, or package." });
    }

    const name = String(body.name || body.customer?.name || user.name || "").trim().slice(0, 100);
    const phone = String(body.phone || body.customer?.phone || "").replace(/[^\d+() -]/g, "").trim().slice(0, 30);
    if (name.length < 2) return res.status(400).json({ error: "Enter a valid traveller name." });
    if (phone.replace(/\D/g, "").length < 10) return res.status(400).json({ error: "Enter a valid phone number." });
    if (!user.email) return res.status(400).json({ error: "Your signed-in account must have an email address." });

    const { checkIn, checkOut } = body;
    if (!validDate(checkIn) || !validDate(checkOut)) return res.status(400).json({ error: "Valid check-in and check-out dates are required." });
    const nights = nightsBetween(checkIn, checkOut);
    if (nights < 1 || nights > 60) return res.status(400).json({ error: "Checkout must be after check-in, with a maximum stay of 60 nights." });

    const rooms = Number(body.rooms || 1);
    const adults = Number(body.adults || 1);
    const children = Number(body.children || 0);
    if (!Number.isInteger(rooms) || rooms < 1 || rooms > 10 || !Number.isInteger(adults) || adults < 1 || adults > 20 || !Number.isInteger(children) || children < 0 || children > 20) {
      return res.status(400).json({ error: "Invalid room or traveller count." });
    }

    let destination = null;
    let hotel = null;
    let packageItem = null;
    let basePrice = 0;

    if (bookingType === "hotel") {
      const hotelId = Number(body.hotelId);
      if (!Number.isInteger(hotelId) || hotelId <= 0) return res.status(400).json({ error: "Select a valid hotel." });
      hotel = await db.collection("hotels").findOne({ id: hotelId });
      if (!hotel) return res.status(404).json({ error: "Hotel not found. Refresh the hotel list and try again." });
      destination = await db.collection("destinations").findOne({ id: Number(hotel.destinationId) });
      basePrice = parsePrice(hotel.price);
    } else if (bookingType === "package") {
      const packageId = Number(body.packageId);
      packageItem = Number.isInteger(packageId) && packageId > 0
        ? await db.collection("packages").findOne({ id: packageId })
        : null;
      if (!packageItem) return res.status(400).json({ error: "Select a package from the catalogue." });
      basePrice = parsePrice(packageItem.priceInr ?? packageItem.price);
      destination = packageItem.destinationId
        ? await db.collection("destinations").findOne({ id: Number(packageItem.destinationId) })
        : null;
    } else {
      const destinationId = Number(body.destinationId);
      if (!Number.isInteger(destinationId) || destinationId <= 0) return res.status(400).json({ error: "Select a valid destination." });
      destination = await db.collection("destinations").findOne({ id: destinationId });
      if (!destination) return res.status(404).json({ error: "Destination not found." });
      basePrice = parsePrice(destination.priceInr ?? destination.price);
    }

    if (!basePrice || basePrice < 1) return res.status(400).json({ error: "Current price is unavailable for this item." });

    const travellerCount = adults + children;
    const subtotal = bookingType === "hotel"
      ? basePrice * rooms * nights
      : basePrice * travellerCount;

    const configuredTaxRate = Number(process.env.WANDERNEST_TAX_RATE ?? "0.05");
    const taxRate = Number.isFinite(configuredTaxRate) && configuredTaxRate >= 0 && configuredTaxRate <= 0.3 ? configuredTaxRate : 0.05;
    const taxes = Math.round(subtotal * taxRate);
    const total = subtotal + taxes;

    const record = {
      reference: reference(),
      userId: user.uid,
      customer: { name, email: user.email, phone },
      bookingType,
      destination: destination ? { id: destination.id, name: destination.name, country: destination.country } : null,
      hotel: hotel ? { id: hotel.id, name: hotel.name, room: hotel.room, pricePerRoomPerNight: basePrice } : null,
      package: packageItem ? { id: packageItem.id, title: packageItem.title, pricePerTraveller: basePrice } : null,
      stay: { checkIn, checkOut, nights, rooms, adults, children },
      pricing: { currency: "INR", subtotal, taxRate, taxes, total },
      payment: { provider: "razorpay", status: "not_started" },
      status: "pending_payment",
      createdAt: new Date(),
      updatedAt: new Date(),
      dataType: "catalog-sample-until-live-inventory-is-connected",
    };

    await bookings.insertOne(record);
    const { userId: _userId, ...safeRecord } = record;
    return res.status(201).json({ booking: safeRecord, message: "Booking record created. Payment has not been started yet." });
  } catch (error) {
    if (error?.message?.includes("is not configured")) {
      return res.status(503).json({ error: "Backend environment is not configured yet." });
    }
    return safeError(res, error, "Unable to create or retrieve bookings.");
  }
}
