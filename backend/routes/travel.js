const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const auth = require("../middleware/authMiddleware");
const Travel = require("../models/TravelBooking");
const inventory = require("../data/searchInventory");
const { client } = require("../services/razorpayClient");

const router = express.Router();

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const safe = value =>
  typeof value === "string" ? value.trim() : "";

const idOk = mongoose.isValidObjectId;

// Flight/train schedules use IST in this demo.
function matchesIstSchedule(value, hhmm) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(hhmm || ""))) {
    return false;
  }

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return false;

  const ist = new Date(date.getTime() + 330 * 60000);

  return (
    `${String(ist.getUTCHours()).padStart(2, "0")}:` +
    `${String(ist.getUTCMinutes()).padStart(2, "0")}`
  ) === hhmm;
}

// =======================================
// OPENSTREETMAP + OSRM
// =======================================

const locationCache = new Map();
const cabQuotes = new Map();

let nominatimQueue = Promise.resolve();
let lastNominatimRequest = 0;

const vehicleRates = {
  Mini: 14,
  Sedan: 19,
  SUV: 27,
  Premium: 40
};

const cabSeats = {
  Mini: 3,
  Sedan: 4,
  SUV: 6,
  Premium: 4
};

function validPlace(place) {
  if (
    !place ||
    typeof place.address !== "string" ||
    !place.address.trim()
  ) {
    return false;
  }

  const lat = Number(place.lat);
  const lon = Number(place.lon);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

function placeKey(place) {
  return (
    `${Number(place.lat).toFixed(6)},` +
    `${Number(place.lon).toFixed(6)}`
  );
}

async function mapJson(url, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    15000
  );

  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `Map service HTTP ${response.status}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// =======================================
// CAB LOCATION SEARCH
// =======================================

router.get("/cab/locations", auth, async (req, res) => {
  const q = safe(req.query.q);

  if (q.length < 3 || q.length > 150) {
    return fail(
      res,
      400,
      "Enter 3 to 150 characters"
    );
  }

  const email = safe(process.env.OSM_CONTACT_EMAIL);

  if (!email) {
    return fail(
      res,
      503,
      "Set OSM_CONTACT_EMAIL in backend .env"
    );
  }

  try {
    const key = q.toLowerCase();
    const cached = locationCache.get(key);

    if (cached && cached.expires > Date.now()) {
      return res.json({
        success: true,
        items: cached.items
      });
    }

    const job = nominatimQueue.then(async () => {
      const existing = locationCache.get(key);

      if (existing && existing.expires > Date.now()) {
        return existing.items;
      }

      const wait = Math.max(
        0,
        1100 - (Date.now() - lastNominatimRequest)
      );

      if (wait) {
        await new Promise(resolve =>
          setTimeout(resolve, wait)
        );
      }

      lastNominatimRequest = Date.now();

      const params = new URLSearchParams({
        q,
        format: "jsonv2",
        limit: "5",
      });

      const result = await mapJson(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          "User-Agent":
            `WanderNestCollegeDemo/1.0 (${email})`,
          "Accept-Language": "en"
        }
      );

      const items = (
        Array.isArray(result) ? result : []
      )
        .filter(
          place =>
            place.display_name &&
            Number.isFinite(Number(place.lat)) &&
            Number.isFinite(Number(place.lon))
        )
        .map(place => ({
          placeId:
            `osm:${place.osm_type}:${place.osm_id}`,
          address: place.display_name,
          lat: Number(place.lat),
          lon: Number(place.lon)
        }));

      if (locationCache.size >= 200) {
        locationCache.delete(
          locationCache.keys().next().value
        );
      }

      locationCache.set(key, {
        items,
        expires: Date.now() + 86400000
      });

      return items;
    });

    nominatimQueue = job.catch(() => {});

    return res.json({
      success: true,
      items: await job
    });
  } catch (error) {
    console.error(
      "OSM location search:",
      error.message
    );

    return fail(
      res,
      503,
      "Location search temporarily unavailable"
    );
  }
});

// =======================================
// INVENTORY
// =======================================

router.get("/inventory", (req, res) => {
  const kind = safe(req.query.kind);
  const from = safe(req.query.from).toLowerCase();
  const to = safe(req.query.to).toLowerCase();
  const region = safe(req.query.region);

  const results = inventory.filter(
    item =>
      (!kind || item.kind === kind) &&
      (!from ||
        item.fromCity.toLowerCase().includes(from)) &&
      (!to ||
        item.toCity.toLowerCase().includes(to)) &&
      (!region ||
        (region === "international") ===
          item.international)
  );

  res.json({
    success: true,
    items: results
  });
});

// =======================================
// MY BOOKINGS
// =======================================

router.get("/mine", auth, async (req, res, next) => {
  try {
    const bookings = await Travel.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    next(error);
  }
});

// =======================================
// CREATE BOOKING
// =======================================

router.post("/book", auth, async (req, res, next) => {
  try {
    const {
      itemId,
      travelDate,
      travelClass,
      passengers,
      pickup,
      drop,
      vehicle,
      returnItemId,
      returnDate,
      returnTravelClass
    } = req.body || {};

    const item = inventory.find(
      x => x.id === itemId
    );

    const kind =
      item?.kind ||
      (itemId === "CAB" ? "cab" : null);

    if (!kind) {
      return fail(res, 400, "Invalid service");
    }

    const date = new Date(travelDate);

    if (
      !Number.isFinite(date.getTime()) ||
      date.getTime() < Date.now() - 3600000
    ) {
      return fail(
        res,
        400,
        "Invalid future departure"
      );
    }

    if (
      item &&
      !matchesIstSchedule(
        travelDate,
        item.departure
      )
    ) {
      return fail(
        res,
        400,
        "Departure time must match selected journey schedule (IST)"
      );
    }

    if (
      !Array.isArray(passengers) ||
      passengers.length < 1 ||
      passengers.length > 8 ||
      passengers.some(
        person =>
          !safe(person.name) ||
          !Number.isInteger(Number(person.age)) ||
          Number(person.age) < 1 ||
          Number(person.age) > 120
      )
    ) {
      return fail(
        res,
        400,
        "Valid passenger details required"
      );
    }

    let amountPaise;
    let details = {};

    if (kind === "cab") {
      const quote = req.body.quote;

      if (
        !validPlace(pickup) ||
        !validPlace(drop) ||
        !safe(vehicle) ||
        !quote?.quoteId
      ) {
        return fail(
          res,
          400,
          "Valid cab route quote required"
        );
      }

      if (
        !cabSeats[vehicle] ||
        passengers.length > cabSeats[vehicle]
      ) {
        return fail(
          res,
          400,
          "Passenger count exceeds selected cab capacity"
        );
      }

      const stored = cabQuotes.get(
        quote.quoteId
      );

      if (
        !stored ||
        stored.expires < Date.now() ||
        stored.pickup !== placeKey(pickup) ||
        stored.drop !== placeKey(drop) ||
        stored.vehicle !== vehicle ||
        stored.userId !== String(req.user.id)
      ) {
        return fail(
          res,
          409,
          "Fare quote expired. Search route again"
        );
      }

      amountPaise = stored.amountPaise;

      // Keep user-entered society/building details in the booking.
      // Route and fare remain tied to the verified mapped coordinates.
      details = {
        fromCity: safe(pickup.address).slice(0, 300),
        toCity: safe(drop.address).slice(0, 300),
        pickup: {
          ...stored.pickupLocation,
          address: safe(pickup.address).slice(0, 300)
        },
        drop: {
          ...stored.dropLocation,
          address: safe(drop.address).slice(0, 300)
        },
        distanceKm: stored.distanceKm,
        durationText: stored.durationText,
        vehicle,
        provider: "WanderNest Demo Cabs"
      };

    } else {
      if (!item.classes.includes(travelClass)) {
        return fail(
          res,
          400,
          "Invalid class"
        );
      }

      const factor =
        item.classes.indexOf(travelClass) + 1;

      amountPaise =
        item.fare *
        factor *
        passengers.length *
        100;

      details = {
        itemId: item.id,
        fromCity: item.fromCity,
        toCity: item.toCity,
        provider: item.provider,
        travelTime: item.departure,
        travelClass,
        onwardAmountPaise: amountPaise,
        tripType: "oneway"
      };

      if (returnItemId) {
        if (kind !== "flight") {
          return fail(
            res,
            400,
            "Round trip is available for flights only"
          );
        }

        const back = inventory.find(
          x =>
            x.id === returnItemId &&
            x.kind === "flight"
        );

        if (
          !back ||
          back.fromCity.trim().toLowerCase() !==
            item.toCity.trim().toLowerCase() ||
          back.toCity.trim().toLowerCase() !==
            item.fromCity.trim().toLowerCase()
        ) {
          return fail(
            res,
            400,
            "Return flight must reverse the onward route"
          );
        }

        if (
          !back.classes.includes(returnTravelClass)
        ) {
          return fail(
            res,
            400,
            "Invalid return travel class"
          );
        }

        const retDate = new Date(returnDate);

        if (
          !matchesIstSchedule(
            returnDate,
            back.departure
          )
        ) {
          return fail(
            res,
            400,
            "Return departure time must match selected flight schedule (IST)"
          );
        }

        if (
          !Number.isFinite(retDate.getTime()) ||
          retDate.getTime() <= date.getTime() ||
          retDate.getTime() < Date.now()
        ) {
          return fail(
            res,
            400,
            "Return date must be after departure"
          );
        }

        const retAmount =
          back.fare *
          (
            back.classes.indexOf(
              returnTravelClass
            ) + 1
          ) *
          passengers.length *
          100;

        if (
          !Number.isSafeInteger(retAmount) ||
          retAmount < 100
        ) {
          return fail(
            res,
            400,
            "Invalid return fare"
          );
        }

        amountPaise += retAmount;

        details = {
          ...details,
          tripType: "roundtrip",
          returnDate: retDate,
          returnItemId: back.id,
          returnFromCity: back.fromCity,
          returnToCity: back.toCity,
          returnProvider: back.provider,
          returnTravelTime: back.departure,
          returnTravelClass,
          returnAmountPaise: retAmount
        };
      }
    }

    if (
      !Number.isSafeInteger(amountPaise) ||
      amountPaise < 100
    ) {
      return fail(
        res,
        400,
        "Invalid price"
      );
    }

    const booking = await Travel.create({
      user: req.user.id,
      kind,
      travelDate: date,
      passengers: passengers.map(person => ({
        name: safe(person.name).slice(0, 80),
        age: Number(person.age),
        gender: safe(person.gender).slice(0, 20)
      })),
      amountPaise,
      reference:
        "WN" +
        crypto
          .randomBytes(7)
          .toString("hex")
          .toUpperCase(),
      ...details
    });

    if (kind === "cab") {
      cabQuotes.delete(req.body.quote.quoteId);
    }

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
});

// =======================================
// RAZORPAY ORDER
// =======================================

router.post("/:id/order", auth, async (req, res, next) => {
  try {
    if (!idOk(req.params.id)) {
      return fail(
        res,
        400,
        "Invalid ID"
      );
    }

    const booking = await Travel.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return fail(res, 404, "Not found");
    }

    if (
      booking.status === "cancelled" ||
      booking.cancellationStatus !== "none"
    ) {
      return fail(
        res,
        409,
        "Cancellation in progress"
      );
    }

    if (booking.paymentStatus === "paid") {
      return fail(
        res,
        409,
        "Already paid"
      );
    }

    if (booking.razorpayOrderId) {
      const order = await client().orders.fetch(
        booking.razorpayOrderId
      );

      if (order.amount !== booking.amountPaise) {
        return fail(
          res,
          409,
          "Amount mismatch"
        );
      }

      return res.json({
        success: true,
        order,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    }

    const claimed = await Travel.findOneAndUpdate(
      {
        _id: booking._id,
        user: req.user.id,
        paymentStatus: "unpaid",
        status: "pending",
        razorpayOrderId: {
          $in: [null, ""]
        },
        cancellationStatus: "none"
      },
      {
        $set: {
          paymentStatus: "pending"
        }
      },
      { new: true }
    );

    if (!claimed) {
      return fail(
        res,
        409,
        "Booking changed"
      );
    }

    const order = await client().orders.create({
      amount: booking.amountPaise,
      currency: "INR",
      receipt: booking.reference
    });

    await Travel.updateOne(
      {
        _id: booking._id,
        paymentStatus: "pending",
        cancellationStatus: "none"
      },
      {
        $set: {
          razorpayOrderId: order.id
        }
      }
    );

    res.json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
});

// =======================================
// VERIFY PAYMENT
// =======================================

router.post("/:id/verify", auth, async (req, res, next) => {
  try {
    const booking = await Travel.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return fail(res, 404, "Not found");
    }

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    } = req.body || {};

    if (
      typeof signature !== "string" ||
      !/^[a-f0-9]{64}$/i.test(signature) ||
      booking.razorpayOrderId !== orderId
    ) {
      return fail(
        res,
        400,
        "Invalid payment verification"
      );
    }

    const expected = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || ""
      )
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expected, "hex")
      )
    ) {
      return fail(
        res,
        400,
        "Invalid signature"
      );
    }

    const payment = await client().payments.fetch(
      paymentId
    );

    if (
      payment.order_id !== orderId ||
      payment.amount !== booking.amountPaise ||
      payment.currency !== "INR" ||
      payment.status !== "captured"
    ) {
      return fail(
        res,
        409,
        "Payment mismatch"
      );
    }

    const updated = await Travel.findOneAndUpdate(
      {
        _id: booking._id,
        user: req.user.id,
        status: "pending",
        cancellationStatus: "none",
        razorpayOrderId: orderId,
        paymentStatus: "pending"
      },
      {
        $set: {
          paymentStatus: "paid",
          status: "confirmed",
          razorpayPaymentId: paymentId,
          paidAt: new Date()
        }
      },
      { new: true }
    );

    if (!updated) {
      const latest = await Travel.findById(
        booking._id
      );

      if (
        latest?.razorpayPaymentId === paymentId
      ) {
        return res.json({
          success: true,
          booking: latest
        });
      }

      return fail(
        res,
        409,
        "Booking changed"
      );
    }

    res.json({
      success: true,
      booking: updated
    });
  } catch (error) {
    next(error);
  }
});

// =======================================
// CANCELLATION POLICY
// =======================================

function percent(booking) {
  const hours =
    (
      new Date(booking.travelDate).getTime() -
      Date.now()
    ) / 3600000;

  if (hours < 0) return null;

  if (booking.kind === "cab") {
    return hours >= 24
      ? 100
      : hours >= 6
        ? 50
        : 0;
  }

  return hours >= 168
    ? 100
    : hours >= 72
      ? 50
      : 0;
}

router.get("/:id/quote", auth, async (req, res, next) => {
  try {
    const booking = await Travel.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return fail(res, 404, "Not found");
    }

    const pct = percent(booking);

    res.json({
      success: true,
      eligible:
        pct !== null &&
        booking.status !== "cancelled" &&
        booking.cancellationStatus === "none",
      percentage: pct,
      refundAmountPaise:
        booking.paymentStatus === "paid" &&
        pct !== null
          ? Math.floor(
              booking.amountPaise * pct / 100
            )
          : 0
    });
  } catch (error) {
    next(error);
  }
});

// =======================================
// CANCEL BOOKING
// =======================================

router.patch("/:id/cancel", auth, async (req, res, next) => {
  try {
    const booking = await Travel.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return fail(res, 404, "Not found");
    }

    const pct = percent(booking);

    if (
      pct === null ||
      booking.status === "cancelled"
    ) {
      return fail(
        res,
        409,
        "Cancellation unavailable"
      );
    }

    const claimed = await Travel.findOneAndUpdate(
      {
        _id: booking._id,
        user: req.user.id,
        status: {
          $in: ["pending", "confirmed"]
        },
        cancellationStatus: "none"
      },
      {
        $set: {
          cancellationStatus: "processing"
        }
      },
      { new: true }
    );

    if (!claimed) {
      return fail(
        res,
        409,
        "Cancellation already started"
      );
    }

    const review = async message => {
      await Travel.updateOne(
        {
          _id: booking._id,
          cancellationStatus: "processing"
        },
        {
          $set: {
            cancellationStatus: "review_required",
            refundStatus: "review_required"
          }
        }
      );

      return fail(
        res,
        409,
        message +
          " Check Razorpay manually; do not retry."
      );
    };

    try {
      let payment = null;

      if (claimed.razorpayOrderId) {
        const order = await client().orders.fetch(
          claimed.razorpayOrderId
        );

        if (
          order.amount !== claimed.amountPaise
        ) {
          return review(
            "Order amount mismatch"
          );
        }

        const result =
          await client().orders.fetchPayments(
            claimed.razorpayOrderId
          );

        if (
          result.count >
          (result.items || []).length
        ) {
          return review(
            "Incomplete payments"
          );
        }

        if (
          (result.items || []).some(item =>
            [
              "authorized",
              "pending",
              "created"
            ].includes(item.status)
          )
        ) {
          return review(
            "Payment is still in progress"
          );
        }

        const paid = (
          result.items || []
        ).filter(item =>
          [
            "captured",
            "refunded"
          ].includes(item.status)
        );

        if (paid.length > 1) {
          return review(
            "Multiple captured payments"
          );
        }

        if (paid.length === 1) {
          payment =
            await client().payments.fetch(
              paid[0].id
            );

          if (
            payment.status !== "captured" ||
            payment.amount !== claimed.amountPaise ||
            payment.order_id !==
              claimed.razorpayOrderId ||
            payment.amount_refunded > 0
          ) {
            return review(
              "Payment mismatch or existing refund"
            );
          }
        }
      } else if (
        claimed.razorpayPaymentId ||
        claimed.paymentStatus === "paid"
      ) {
        return review(
          "Missing order for paid booking"
        );
      }

      const actualPct = percent(claimed);

      if (actualPct === null) {
        return review(
          "Departure already passed"
        );
      }

      const amount = payment
        ? Math.floor(
            payment.amount * actualPct / 100
          )
        : 0;

      await Travel.updateOne(
        {
          _id: booking._id,
          cancellationStatus: "processing"
        },
        {
          $set: {
            refundPercentage: actualPct,
            refundAmountPaise: amount,
            razorpayPaymentId:
              payment?.id || "",
            refundStatus: amount
              ? "review_required"
              : "not_applicable"
          }
        }
      );

      if (!amount) {
        const updated =
          await Travel.findOneAndUpdate(
            {
              _id: booking._id,
              cancellationStatus: "processing"
            },
            {
              $set: {
                status: "cancelled",
                cancelledAt: new Date(),
                cancellationStatus: "completed"
              }
            },
            { new: true }
          );

        return res.json({
          success: true,
          booking: updated
        });
      }

      let refund;

      try {
        refund =
          await client().payments.refund(
            payment.id,
            {
              amount,
              speed: "normal",
              notes: {
                bookingId: String(booking._id),
                kind: booking.kind
              }
            }
          );
      } catch (error) {
        return review(
          "Refund result uncertain"
        );
      }

      if (
        refund.payment_id !== payment.id ||
        refund.amount !== amount ||
        !refund.id
      ) {
        return review(
          "Refund response mismatch"
        );
      }

      const processed =
        refund.status === "processed";

      const updated =
        await Travel.findOneAndUpdate(
          {
            _id: booking._id,
            cancellationStatus: "processing"
          },
          {
            $set: {
              status: "cancelled",
              cancelledAt: new Date(),
              cancellationStatus: "completed",
              razorpayRefundId: refund.id,
              refundStatus: processed
                ? "processed"
                : "pending",
              refundProcessedAt: processed
                ? new Date()
                : null,
              paymentStatus: processed
                ? amount === payment.amount
                  ? "refunded"
                  : "partially_refunded"
                : "paid"
            }
          },
          { new: true }
        );

      res.json({
        success: true,
        booking: updated
      });
    } catch (error) {
      return review(
        "Cancellation reconciliation uncertain"
      );
    }
  } catch (error) {
    next(error);
  }
});

// =======================================
// REFUND STATUS
// =======================================

router.get(
  "/:id/refund-status",
  auth,
  async (req, res, next) => {
    try {
      const booking = await Travel.findOne({
        _id: req.params.id,
        user: req.user.id
      });

      if (!booking) {
        return fail(res, 404, "Not found");
      }

      if (
        !booking.razorpayRefundId ||
        booking.status !== "cancelled"
      ) {
        return fail(
          res,
          409,
          "No refund reference"
        );
      }

      const refund =
        await client().refunds.fetch(
          booking.razorpayRefundId
        );

      if (
        refund.payment_id !==
          booking.razorpayPaymentId ||
        refund.amount !==
          booking.refundAmountPaise ||
        refund.id !==
          booking.razorpayRefundId
      ) {
        return fail(
          res,
          409,
          "Refund mismatch"
        );
      }

      const status =
        refund.status === "processed"
          ? "processed"
          : refund.status === "failed"
            ? "failed"
            : "pending";

      if (
        booking.refundStatus === "processed" &&
        status !== "processed"
      ) {
        return fail(
          res,
          409,
          "Conflicting refund state"
        );
      }

      const updated =
        await Travel.findOneAndUpdate(
          {
            _id: booking._id,
            user: req.user.id,
            razorpayRefundId: refund.id,
            refundStatus: {
              $ne: "processed"
            }
          },
          {
            $set: {
              refundStatus: status,
              ...(status === "processed"
                ? {
                    refundProcessedAt:
                      new Date(),
                    paymentStatus:
                      booking.refundAmountPaise ===
                      booking.amountPaise
                        ? "refunded"
                        : "partially_refunded"
                  }
                : {})
            }
          },
          { new: true }
        );

      res.json({
        success: true,
        booking:
          updated ||
          (await Travel.findById(
            booking._id
          ))
      });
    } catch (error) {
      next(error);
    }
  }
);

// =======================================
// CAB QUOTE USING OSRM
// =======================================

router.post("/cab/quote", auth, async (req, res) => {
  try {
    const {
      pickup,
      drop,
      vehicle
    } = req.body || {};

    if (
      !validPlace(pickup) ||
      !validPlace(drop) ||
      !Object.prototype.hasOwnProperty.call(
        vehicleRates,
        vehicle
      )
    ) {
      return fail(
        res,
        400,
        "Select valid pickup, drop and vehicle"
      );
    }

    if (
      placeKey(pickup) === placeKey(drop)
    ) {
      return fail(
        res,
        400,
        "Pickup and drop must be different"
      );
    }

    const coordinates =
      `${Number(pickup.lon)},${Number(pickup.lat)};` +
      `${Number(drop.lon)},${Number(drop.lat)}`;

    const url =
      "https://router.project-osrm.org/route/v1/driving/" +
      coordinates +
      "?overview=false&alternatives=false&steps=false";

    const data = await mapJson(url);
    const route = data.routes?.[0];

    if (
      data.code !== "Ok" ||
      !route ||
      !Number.isFinite(route.distance) ||
      !Number.isFinite(route.duration) ||
      route.distance <= 0
    ) {
      return fail(
        res,
        422,
        "Driving route unavailable for selected locations"
      );
    }

    const distanceKm =
      route.distance / 1000;

    const totalMinutes = Math.max(
      1,
      Math.round(route.duration / 60)
    );

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    const durationText = hours
      ? `${hours} hr${
          minutes
            ? ` ${minutes} min`
            : ""
        }`
      : `${minutes} min`;

    const amountPaise = Math.round(
      (
        150 +
        distanceKm * vehicleRates[vehicle]
      ) * 100
    );

    if (
      !Number.isSafeInteger(amountPaise) ||
      amountPaise < 100
    ) {
      return fail(
        res,
        422,
        "Invalid route fare"
      );
    }

    for (const [id, stored] of cabQuotes) {
      if (stored.expires < Date.now()) {
        cabQuotes.delete(id);
      }
    }

    const quoteId = crypto
      .randomBytes(18)
      .toString("hex");

    const cleanPlace = place => ({
      placeId: safe(place.placeId),
      address: safe(place.address).slice(0, 300),
      lat: Number(place.lat),
      lon: Number(place.lon)
    });

    cabQuotes.set(quoteId, {
      userId: String(req.user.id),
      pickup: placeKey(pickup),
      drop: placeKey(drop),
      pickupAddress:
        safe(pickup.address).slice(0, 300),
      dropAddress:
        safe(drop.address).slice(0, 300),
      pickupLocation: cleanPlace(pickup),
      dropLocation: cleanPlace(drop),
      vehicle,
      amountPaise,
      distanceKm,
      durationText,
      expires: Date.now() + 600000
    });

    return res.json({
      success: true,
      quote: {
        quoteId,
        amountPaise,
        distanceKm,
        durationText,
        vehicle,
        expiresInSeconds: 600
      }
    });
  } catch (error) {
    console.error(
      "OSRM cab quote:",
      error.message
    );

    return fail(
      res,
      503,
      "Driving route service unavailable. Try again"
    );
  }
});

module.exports = router;