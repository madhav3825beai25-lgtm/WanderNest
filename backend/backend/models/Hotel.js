const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    destinationId: { type: Number, required: true, index: true },
    destinationName: { type: String, required: true, index: true },
    destinationCountry: { type: String, required: true, default: "" },
    name: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingIsSample: { type: Boolean, default: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    room: { type: String, default: "Standard Room" },
    nights: { type: String, default: "3 Nights" },
    checkIn: { type: String, default: "2:00 PM" },
    checkOut: { type: String, default: "12:00 PM" },
    image: { type: String, default: "" },
    roomImage: { type: String, default: "" },
    secondRoomImage: { type: String, default: "" },
    poolImage: { type: String, default: "" },
    description: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    dataType: { type: String, default: "sample", index: true },
  },
  { timestamps: true }
);

hotelSchema.index({ name: "text", location: "text", room: "text" });
hotelSchema.index({ destinationId: 1, price: 1 });
hotelSchema.index({ destinationId: 1, rating: -1 });

module.exports = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
