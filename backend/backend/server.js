
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Destination = require("./models/Destination");
const Hotel = require("./models/Hotel");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Frontend ports: Vite may use 5173 or 5174.
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, e.g. curl/Postman.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

// Authentication routes
app.use("/api/auth", authRoutes);

// Home route
app.get("/", (_req, res) => {
  res.send("WanderNest Backend Running");
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "WanderNest Backend Running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// GET /api/destinations?q=bal
app.get("/api/destinations", async (req, res, next) => {
  try {
    const query = String(req.query.q || "").trim();

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

    const results = await Destination.find(filter)
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/destinations/5
app.get("/api/destinations/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Destination ID must be a number.",
      });
    }

    const destination = await Destination.findOne({ id }).lean();

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const hotelCount = await Hotel.countDocuments({
      destinationId: id,
    });

    res.json({
      success: true,
      data: {
        ...destination,
        hotelCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hotels?destinationId=5&q=hotel&minPrice=5000
// Optional filters: maxPrice, minRating, sort, limit
app.get("/api/hotels", async (req, res, next) => {
  try {
    const filter = {};
    const destinationId = req.query.destinationId;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const minRating = req.query.minRating;
    const query = String(req.query.q || "").trim();

    if (destinationId !== undefined) {
      const parsedId = Number(destinationId);

      if (!Number.isInteger(parsedId)) {
        return res.status(400).json({
          success: false,
          message: "destinationId must be a number.",
        });
      }

      filter.destinationId = parsedId;
    }

    filter.price = {};

    if (minPrice !== undefined && minPrice !== "") {
      const value = Number(minPrice);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "minPrice must be a valid non-negative number.",
        });
      }

      filter.price.$gte = value;
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const value = Number(maxPrice);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "maxPrice must be a valid non-negative number.",
        });
      }

      filter.price.$lte = value;
    }

    if (Object.keys(filter.price).length === 0) {
      delete filter.price;
    }

    if (minRating !== undefined && minRating !== "") {
      const value = Number(minRating);

      if (!Number.isFinite(value) || value < 0 || value > 5) {
        return res.status(400).json({
          success: false,
          message: "minRating must be between 0 and 5.",
        });
      }

      filter.rating = { $gte: value };
    }

    if (query) {
      const regex = new RegExp(escapeRegex(query), "i");

      filter.$or = [
        { name: regex },
        { location: regex },
        { destinationName: regex },
        { destinationCountry: regex },
        { room: regex },
        { amenities: regex },
      ];
    }

    const sortMap = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      rating: { rating: -1, price: 1 },
      name: { name: 1 },
      recommended: { rating: -1, price: 1 },
    };

    const sort =
      sortMap[String(req.query.sort || "recommended")] ||
      sortMap.recommended;

    const requestedLimit = Number(req.query.limit || 300);

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 500)
      : 300;

    const results = await Hotel.find(filter)
      .sort(sort)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/hotels/501
app.get("/api/hotels/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Hotel ID must be a number.",
      });
    }

    const hotel = await Hotel.findOne({ id }).lean();

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found.",
      });
    }

    res.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("API error:", err.message);

  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// Escape special regex characters
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Start server
async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from backend/.env");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "wandernest",
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Connected Successfully");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Backend startup failed:", error.message);
  process.exit(1);
});
