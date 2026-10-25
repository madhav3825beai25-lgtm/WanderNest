const path = require("node:path");
const { pathToFileURL } = require("node:url");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const Hotel = require("../models/Hotel");

const hotelProfiles = [
  { suffix: "Grand Hotel", room: "Deluxe Room", multiplier: 0.85, rating: 4.6, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80", amenities: ["Free Wi-Fi", "Air Conditioning", "Restaurant", "Room Service", "24/7 Reception"], highlights: ["Comfortable rooms", "Professional hospitality", "Convenient stay"] },
  { suffix: "Comfort Inn", room: "Standard Room", multiplier: 0.65, rating: 4.2, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80", amenities: ["Free Wi-Fi", "Daily Housekeeping", "Air Conditioning", "Front Desk", "Laundry"], highlights: ["Budget-friendly sample rate", "Essential facilities", "Simple accommodation"] },
  { suffix: "Premium Stay", room: "Premium Room", multiplier: 1.05, rating: 4.5, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", amenities: ["Free Wi-Fi", "Premium Room", "Restaurant", "Room Service", "Breakfast Option"], highlights: ["Premium-style room", "Modern interiors", "Comfort-focused stay"] },
  { suffix: "Boutique Retreat", room: "Boutique Room", multiplier: 1.2, rating: 4.8, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80", amenities: ["Free Wi-Fi", "Boutique Interiors", "Restaurant", "Room Service", "Lounge"], highlights: ["Boutique-inspired interiors", "Relaxed atmosphere", "Distinct room style"] },
  { suffix: "Family Resort", room: "Family Suite", multiplier: 1.35, rating: 4.4, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80", amenities: ["Family Suite", "Free Wi-Fi", "Restaurant", "Lounge", "Front Desk"], highlights: ["Family-sized room type", "Shared relaxation spaces", "Multiple guest capacity"] },
  { suffix: "City View Hotel", room: "City View Room", multiplier: 0.95, rating: 4.3, image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", amenities: ["Free Wi-Fi", "City View Room", "Air Conditioning", "Restaurant", "Housekeeping"], highlights: ["City-inspired stay", "Modern-style rooms", "Convenient accommodation"] },
  { suffix: "Luxury Palace", room: "Luxury Suite", multiplier: 1.7, rating: 4.9, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", amenities: ["Luxury Suite", "Free Wi-Fi", "Restaurant", "Room Service", "Lounge", "Premium Interiors"], highlights: ["Luxury-style accommodation", "Spacious suite", "Premium interiors"] },
  { suffix: "Signature Resort", room: "Signature Room", multiplier: 1.45, rating: 4.7, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1400&q=80", roomImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80", secondRoomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80", poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", amenities: ["Free Wi-Fi", "Signature Room", "Restaurant", "Room Service", "Relaxation Area"], highlights: ["Resort-inspired stay", "Signature room style", "Relaxation-focused experience"] },
];

const premiumCountries = new Set(["France", "Switzerland", "United Kingdom", "USA", "Greece", "Italy", "Australia", "Singapore", "Japan"]);
const tropicalCountries = new Set(["Indonesia", "Thailand", "Maldives", "Mauritius", "UAE", "Turkey"]);

function getBaseRoomPrice(destination) {
  if (destination.country === "India") return 3500 + (destination.id % 5) * 500;
  if (["Maldives", "Mauritius"].includes(destination.country)) return 12000 + (destination.id % 4) * 1500;
  if (premiumCountries.has(destination.country)) return 9500 + (destination.id % 5) * 1500;
  if (tropicalCountries.has(destination.country)) return 5500 + (destination.id % 5) * 1000;
  return 6000 + (destination.id % 4) * 1000;
}

function numericPrice(value) {
  const amount = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function createHotel(destination, profile, index) {
  const roundedPrice = Math.round((getBaseRoomPrice(destination) * profile.multiplier) / 500) * 500;
  const nights = String(destination.duration || "").match(/\d+\s*Nights?/i);
  const location = `${destination.name}, ${destination.country}`;
  return {
    id: Number(destination.id) * 100 + index + 1,
    destinationId: Number(destination.id),
    destinationName: destination.name,
    destinationCountry: destination.country || "",
    name: `${destination.name} ${profile.suffix}`,
    location,
    room: profile.room,
    rating: profile.rating,
    ratingIsSample: true,
    price: Math.max(2000, roundedPrice),
    currency: "INR",
    nights: nights ? nights[0] : "3 Nights",
    checkIn: index === 5 ? "3:00 PM" : "2:00 PM",
    checkOut: index === 5 ? "11:00 AM" : "12:00 PM",
    image: profile.image,
    roomImage: profile.roomImage,
    secondRoomImage: profile.secondRoomImage,
    poolImage: profile.poolImage,
    description: `${profile.suffix} is a sample accommodation option for ${destination.name}. It features a ${profile.room.toLowerCase()} category and illustrative amenities for this website project.`,
    amenities: profile.amenities,
    highlights: profile.highlights,
    dataType: "sample",
  };
}

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in backend/.env");
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || "wandernest" });

  const root = path.resolve(__dirname, "../..");
  const destinationModulePath = path.join(root, "src", "data", "destinations.js");
  const { default: destinations } = await import(pathToFileURL(destinationModulePath).href);

  if (!Array.isArray(destinations) || destinations.length === 0) {
    throw new Error("No destinations were exported from src/data/destinations.js");
  }

  const destinationOperations = destinations.map((destination) => ({
    updateOne: {
      filter: { id: Number(destination.id) },
      update: {
        $set: {
          id: Number(destination.id),
          name: destination.name,
          country: destination.country || "",
          price: destination.price || destination.packagePrice || "",
          priceAmount: numericPrice(destination.price || destination.packagePrice),
          image: destination.image || "",
          description: destination.description || "",
          duration: destination.duration || "",
          places: destination.places || [],
          packageName: destination.packageName || "",
          packagePrice: destination.packagePrice || destination.price || "",
        },
      },
      upsert: true,
    },
  }));

  const hotels = destinations.flatMap((destination) =>
    hotelProfiles.map((profile, index) => createHotel(destination, profile, index))
  );

  const hotelOperations = hotels.map((hotel) => ({
    updateOne: {
      filter: { id: hotel.id },
      update: { $set: hotel },
      upsert: true,
    },
  }));

  await Destination.bulkWrite(destinationOperations, { ordered: false });
  await Hotel.bulkWrite(hotelOperations, { ordered: false });

  console.log(`Seed complete: ${destinations.length} destinations; ${hotels.length} sample hotel listings.`);
  console.log("Note: these are sample listings and rates, not live verified hotel inventory.");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Seed failed:", error.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
