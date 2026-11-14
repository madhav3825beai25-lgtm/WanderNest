
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const Destination = require("./models/Destination");
const Hotel = require("./models/Hotel");

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const paymentRoutes = require("./routes/payments");
const refundWebhookRoutes = require("./routes/refundWebhook");
const travelRoutes = require("./routes/travel");
const travelPdfRoutes = require("./routes/travelPdf");

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// ======================================
// CORS - ALLOW FRONTEND
// ======================================

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    process.env.FRONTEND_ORIGIN,
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origin is not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================
// RAZORPAY REFUND WEBHOOK
// IMPORTANT: BEFORE express.json()
// ======================================

app.use(
  "/api/webhooks/razorpay",
  express.raw({
    type: "application/json",
    limit: "1mb",
  }),
  refundWebhookRoutes
);

// ======================================
// JSON MIDDLEWARE
// ======================================

app.use(express.json({ limit: "1mb" }));
app.use("/api/travel", travelRoutes);
app.use("/api/documents", travelPdfRoutes);

// ======================================
// HOME
// ======================================

app.get("/", (req, res) => {
  res.send("WanderNest Backend Running");
});

// ======================================
// HEALTH CHECK
// ======================================

app.get("/api/health", (req, res) => {
  const connected =
    mongoose.connection.readyState === 1;

  res.json({
    success: true,
    message: "WanderNest Backend Running",
    database: connected
      ? "connected"
      : "disconnected",
  });
});

// ======================================
// AUTHENTICATION
// ======================================

app.use("/api/auth", authRoutes);

// ======================================
// BOOKINGS
// ======================================

app.use("/api/bookings", bookingRoutes);

// ======================================
// RAZORPAY PAYMENTS
// ======================================

app.use("/api/payments", paymentRoutes);

// ======================================
// HELPER - ESCAPE REGEX
// ======================================

function escapeRegex(value) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

// ======================================
// DESTINATIONS
// ======================================

// GET ALL DESTINATIONS
// Example: /api/destinations?q=bali

app.get(
  "/api/destinations",
  async (req, res, next) => {
    try {
      const query = String(
        req.query.q || ""
      ).trim();

      const filter = query
        ? {
            $or: [
              {
                name: {
                  $regex: escapeRegex(query),
                  $options: "i",
                },
              },
              {
                country: {
                  $regex: escapeRegex(query),
                  $options: "i",
                },
              },
            ],
          }
        : {};

      const destinations =
        await Destination.find(filter)
          .sort({ name: 1 })
          .lean();

      return res.json({
        success: true,
        count: destinations.length,
        data: destinations,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET SINGLE DESTINATION

app.get(
  "/api/destinations/:id",
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid destination ID.",
        });
      }

      const destination =
        await Destination.findOne({
          id,
        }).lean();

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found.",
        });
      }

      const hotelCount =
        await Hotel.countDocuments({
          destinationId: id,
        });

      return res.json({
        success: true,
        data: {
          ...destination,
          hotelCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ======================================
// HOTELS
// ======================================

// GET HOTELS
// Supports destinationId, q, price,
// rating, sorting and limit filters.

app.get(
  "/api/hotels",
  async (req, res, next) => {
    try {
      const filter = {};

      const {
        destinationId,
        minPrice,
        maxPrice,
        minRating,
        q,
        sort,
        limit,
      } = req.query;

      // Destination filter

      if (
        destinationId !== undefined &&
        destinationId !== ""
      ) {
        const parsedId =
          Number(destinationId);

        if (!Number.isInteger(parsedId)) {
          return res.status(400).json({
            success: false,
            message:
              "destinationId must be a number.",
          });
        }

        filter.destinationId = parsedId;
      }

      // Minimum price

      if (
        minPrice !== undefined &&
        minPrice !== ""
      ) {
        const price = Number(minPrice);

        if (
          !Number.isFinite(price) ||
          price < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid minimum price.",
          });
        }

        filter.price = {
          ...filter.price,
          $gte: price,
        };
      }

      // Maximum price

      if (
        maxPrice !== undefined &&
        maxPrice !== ""
      ) {
        const price = Number(maxPrice);

        if (
          !Number.isFinite(price) ||
          price < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid maximum price.",
          });
        }

        filter.price = {
          ...filter.price,
          $lte: price,
        };
      }

      // Minimum rating

      if (
        minRating !== undefined &&
        minRating !== ""
      ) {
        const rating = Number(minRating);

        if (
          !Number.isFinite(rating) ||
          rating < 0 ||
          rating > 5
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid minimum rating.",
          });
        }

        filter.rating = {
          $gte: rating,
        };
      }

      // Search

      const search = String(
        q || ""
      ).trim();

      if (search) {
        const regex = new RegExp(
          escapeRegex(search),
          "i"
        );

        filter.$or = [
          { name: regex },
          { location: regex },
          { destinationName: regex },
          { destinationCountry: regex },
          { room: regex },
          { amenities: regex },
        ];
      }

      // Sorting

      const sortOptions = {
        recommended: {
          rating: -1,
          price: 1,
        },

        rating: {
          rating: -1,
          price: 1,
        },

        priceAsc: {
          price: 1,
        },

        priceDesc: {
          price: -1,
        },

        name: {
          name: 1,
        },
      };

      const selectedSort =
        sortOptions[
          String(sort || "recommended")
        ] || sortOptions.recommended;

      // Result limit

      const requestedLimit = Number(
        limit || 300
      );

      const selectedLimit =
        Number.isFinite(requestedLimit)
          ? Math.min(
              Math.max(
                Math.trunc(requestedLimit),
                1
              ),
              500
            )
          : 300;

      const hotels =
        await Hotel.find(filter)
          .sort(selectedSort)
          .limit(selectedLimit)
          .lean();

      return res.json({
        success: true,
        count: hotels.length,
        data: hotels,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET SINGLE HOTEL

app.get(
  "/api/hotels/:id",
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid hotel ID.",
        });
      }

      const hotel =
        await Hotel.findOne({
          id,
        }).lean();

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found.",
        });
      }

      return res.json({
        success: true,
        data: hotel,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ======================================
// API 404
// ======================================

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// ======================================
// ERROR HANDLER
// ======================================

app.use((error, req, res, next) => {
  console.error(
    "API Error:",
    error.message
  );

  if (
    error.message ===
    "Origin is not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ======================================
// START BACKEND
// ======================================

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI is missing from backend/.env"
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing from backend/.env"
    );
  }

  await mongoose.connect(
    process.env.MONGO_URI,
    {
      dbName:
        process.env.MONGO_DB_NAME ||
        "wandernest",

      serverSelectionTimeoutMS: 10000,
    }
  );

  console.log(
    "MongoDB Connected Successfully"
  );

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error(
    "Backend startup failed:",
    error.message
  );

  process.exit(1);
});
