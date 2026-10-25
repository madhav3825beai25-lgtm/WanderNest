const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, trim: true, index: true },
    price: { type: String, default: "" },
    priceAmount: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    places: { type: [String], default: [] },
    packageName: { type: String, default: "" },
    packagePrice: { type: String, default: "" },
  },
  { timestamps: true }
);

destinationSchema.index({ name: "text", country: "text", description: "text" });

module.exports = mongoose.models.Destination || mongoose.model("Destination", destinationSchema);
