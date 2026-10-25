import destinations from "./destinations.js";

// These profiles generate sample listings for UI development only.
// They are not connected to hotel inventory or live availability.
const hotelProfiles = [
  { suffix: "Grand Hotel", room: "Deluxe Room", multiplier: 0.85, rating: 4.6,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Restaurant", "Room Service", "24/7 Reception"],
    highlights: ["Comfortable rooms", "Professional hospitality", "Convenient stay"] },
  { suffix: "Comfort Inn", room: "Standard Room", multiplier: 0.65, rating: 4.2,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Free Wi-Fi", "Daily Housekeeping", "Air Conditioning", "Front Desk", "Laundry"],
    highlights: ["Budget-style sample rate", "Essential facilities", "Simple accommodation"] },
  { suffix: "Premium Stay", room: "Premium Room", multiplier: 1.05, rating: 4.5,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Free Wi-Fi", "Premium Room", "Restaurant", "Room Service", "Breakfast Option"],
    highlights: ["Premium-style room", "Modern interiors", "Comfort-focused stay"] },
  { suffix: "Boutique Retreat", room: "Boutique Room", multiplier: 1.2, rating: 4.8,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Free Wi-Fi", "Boutique Interiors", "Restaurant", "Room Service", "Lounge"],
    highlights: ["Boutique-inspired interiors", "Relaxed atmosphere", "Distinct room style"] },
  { suffix: "Family Resort", room: "Family Suite", multiplier: 1.35, rating: 4.4,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Family Suite", "Free Wi-Fi", "Restaurant", "Lounge", "Front Desk"],
    highlights: ["Family-sized room type", "Shared relaxation spaces", "Multiple guest capacity"] },
  { suffix: "City View Hotel", room: "City View Room", multiplier: 0.95, rating: 4.3,
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Free Wi-Fi", "City View Room", "Air Conditioning", "Restaurant", "Housekeeping"],
    highlights: ["City-inspired stay", "Modern-style rooms", "Convenient accommodation"] },
  { suffix: "Luxury Palace", room: "Luxury Suite", multiplier: 1.7, rating: 4.9,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Luxury Suite", "Free Wi-Fi", "Restaurant", "Room Service", "Lounge", "Premium Interiors"],
    highlights: ["Luxury-style accommodation", "Spacious suite", "Premium interiors"] },
  { suffix: "Signature Resort", room: "Signature Room", multiplier: 1.45, rating: 4.7,
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1400&q=80",
    roomImage: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    secondRoomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    poolImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Free Wi-Fi", "Signature Room", "Restaurant", "Room Service", "Relaxation Area"],
    highlights: ["Resort-inspired stay", "Signature room style", "Relaxation-focused experience"] },
];

const premiumCountries = new Set(["France", "Switzerland", "United Kingdom", "USA", "Greece", "Italy", "Australia", "Singapore", "Japan"]);
const tropicalCountries = new Set(["Indonesia", "Thailand", "Maldives", "Mauritius", "UAE", "Turkey"]);

function getBaseRoomPrice(destination) {
  const country = String(destination.country || "").trim();
  if (country === "India") return 3500 + (destination.id % 5) * 500;
  if (country === "Maldives" || country === "Mauritius") return 12000 + (destination.id % 4) * 1500;
  if (premiumCountries.has(country)) return 9500 + (destination.id % 5) * 1500;
  if (tropicalCountries.has(country)) return 5500 + (destination.id % 5) * 1000;
  return 6000 + (destination.id % 4) * 1000;
}

function getNights(duration = "") {
  const match = String(duration).match(/(\d+)\s*Nights?/i);
  return match ? `${match[1]} Nights` : "3 Nights";
}

function createHotel(destination, profile, profileIndex) {
  const amount = Math.round((getBaseRoomPrice(destination) * profile.multiplier) / 500) * 500;
  return {
    id: Number(destination.id) * 100 + profileIndex + 1,
    destinationId: Number(destination.id),
    destinationName: destination.name,
    destinationCountry: destination.country,
    name: `${destination.name} ${profile.suffix}`,
    location: `${destination.name}, ${destination.country}`,
    room: profile.room,
    rating: profile.rating,
    ratingIsSample: true,
    price: Math.max(2000, amount),
    currency: "INR",
    nights: getNights(destination.duration),
    checkIn: profileIndex === 5 ? "3:00 PM" : "2:00 PM",
    checkOut: profileIndex === 5 ? "11:00 AM" : "12:00 PM",
    image: profile.image,
    roomImage: profile.roomImage,
    secondRoomImage: profile.secondRoomImage,
    poolImage: profile.poolImage,
    description: `${profile.suffix} is a sample accommodation listing for ${destination.name}. Room information, images, ratings and prices are illustrative and not live inventory.`,
    amenities: [...profile.amenities],
    highlights: [...profile.highlights],
    dataType: "sample",
  };
}

const hotels = destinations.flatMap((destination) =>
  hotelProfiles.map((profile, index) => createHotel(destination, profile, index))
);

export function formatHotelPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

export function getHotelsByDestination(destinationId) {
  return hotels.filter((hotel) => hotel.destinationId === Number(destinationId));
}

export default hotels;
