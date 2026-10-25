
const DESTINATION_PRICES = {
  Goa: 12999,
  Manali: 14999,
  Jaipur: 9999,
  Kerala: 16999,
  Bali: 24999,
  Dubai: 34999,
  Switzerland: 59999,
  Paris: 49999,
  Maldives: 39999,
  Tokyo: 69999,
  London: 54999,
  "New York": 74999,
  Santorini: 74999,
  Singapore: 59999,
  Rajasthan: 19999,
  Kashmir: 34999,
  Agra: 8999,
  Varanasi: 7999,
  Amritsar: 8999,
  Shimla: 12999,
  Udaipur: 13999,
  "Andaman Islands": 29999,
  Bangkok: 29999,
  Rome: 64999,
  Istanbul: 44999,
  Sydney: 89999,
  Mauritius: 54999,
  Kathmandu: 19999,
  Ooty: 11999,
  Darjeeling: 13999,
};

const PACKAGE_PRICES = {
  "Royal Rajasthan": 38999,
  "Kashmir Paradise": 42999,
  "Goa Beach Escape": 24999,
  "Kerala Backwaters": 36999,
  "Bali Paradise": 55000,
  "Dubai Luxury": 62999,
  "Swiss Alps Experience": 129999,
  "Paris Explorer": 89999,
  "Tokyo Discovery": 99999,
  "Maldives Luxury Retreat": 79999,
  "Manali Mountain Escape": 22999,
  "Andaman Island Adventure": 39999,
  "Singapore City Highlights": 69999,
  "London Heritage Tour": 109999,
  "New York City Explorer": 149999,
  "Egypt Ancient Wonders": 84999,
  "Vietnam Scenic Journey": 64999,
  "Nepal Himalayan Escape": 29999,
  "Mauritius Tropical Retreat": 94999,
  "South Africa Safari": 139999,
};

const DESTINATIONS = [
  ["Goa", "India"],
  ["Manali", "India"],
  ["Jaipur", "India"],
  ["Kerala", "India"],
  ["Bali", "Indonesia"],
  ["Dubai", "UAE"],
  ["Switzerland", "Switzerland"],
  ["Paris", "France"],
  ["Maldives", "Maldives"],
  ["Tokyo", "Japan"],
  ["London", "United Kingdom"],
  ["New York", "USA"],
  ["Santorini", "Greece"],
  ["Singapore", "Singapore"],
  ["Rajasthan", "India"],
  ["Kashmir", "India"],
  ["Agra", "India"],
  ["Varanasi", "India"],
  ["Amritsar", "India"],
  ["Shimla", "India"],
  ["Udaipur", "India"],
  ["Andaman Islands", "India"],
  ["Bangkok", "Thailand"],
  ["Rome", "Italy"],
  ["Istanbul", "Turkey"],
  ["Sydney", "Australia"],
  ["Mauritius", "Mauritius"],
  ["Kathmandu", "Nepal"],
  ["Ooty", "India"],
  ["Darjeeling", "India"],
];

const PACKAGE_DESTINATIONS = {
  "Royal Rajasthan": "Jaipur",
  "Kashmir Paradise": "Kashmir",
  "Goa Beach Escape": "Goa",
  "Kerala Backwaters": "Kerala",
  "Bali Paradise": "Bali",
  "Dubai Luxury": "Dubai",
  "Swiss Alps Experience": "Switzerland",
  "Paris Explorer": "Paris",
  "Tokyo Discovery": "Tokyo",
  "Maldives Luxury Retreat": "Maldives",
  "Manali Mountain Escape": "Manali",
  "Andaman Island Adventure": "Andaman Islands",
  "Singapore City Highlights": "Singapore",
  "London Heritage Tour": "London",
  "New York City Explorer": "New York",
  "Egypt Ancient Wonders": "Cairo, Egypt",
  "Vietnam Scenic Journey": "Vietnam",
  "Nepal Himalayan Escape": "Pokhara, Nepal",
  "Mauritius Tropical Retreat": "Mauritius",
  "South Africa Safari": "Cape Town, South Africa",
};

const HOTEL_MULTIPLIERS = [
  0.85, 0.65, 1.05, 1.2,
  1.35, 0.95, 1.7, 1.45,
];

const HOTEL_SUFFIXES = [
  "Grand Hotel",
  "Comfort Inn",
  "Premium Stay",
  "Boutique Retreat",
  "Family Resort",
  "City View Hotel",
  "Luxury Palace",
  "Signature Resort",
];

const PREMIUM = new Set([
  "France", "Switzerland", "United Kingdom",
  "USA", "Greece", "Italy", "Australia",
  "Singapore", "Japan",
]);

const TROPICAL = new Set([
  "Indonesia", "Thailand", "Maldives",
  "Mauritius", "UAE", "Turkey",
]);

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function findDestination(value) {
  return DESTINATIONS.find(
    ([name]) => normalize(name) === normalize(value)
  );
}

function getBaseRoomPrice(id, country) {
  if (country === "India") {
    return 3500 + (id % 5) * 500;
  }

  if (country === "Maldives" || country === "Mauritius") {
    return 12000 + (id % 4) * 1500;
  }

  if (PREMIUM.has(country)) {
    return 9500 + (id % 5) * 1500;
  }

  if (TROPICAL.has(country)) {
    return 5500 + (id % 5) * 1000;
  }

  return 6000 + (id % 4) * 1000;
}

function getHotelPrice(hotelId, destination) {
  const index = DESTINATIONS.findIndex(
    ([name]) => normalize(name) === normalize(destination)
  );

  if (index < 0) {
    throw new Error("Invalid hotel destination.");
  }

  const destinationId = index + 1;
  const numericId = Number(hotelId);
  const profileIndex = numericId - destinationId * 100 - 1;

  if (
    !Number.isInteger(numericId) ||
    !Number.isInteger(profileIndex) ||
    profileIndex < 0 ||
    profileIndex >= HOTEL_MULTIPLIERS.length
  ) {
    throw new Error("Invalid hotel selection.");
  }

  const country = DESTINATIONS[index][1];
  const base = getBaseRoomPrice(destinationId, country);

  const price =
    Math.round(
      (base * HOTEL_MULTIPLIERS[profileIndex]) / 500
    ) * 500;

  return {
    price: Math.max(2000, price),
    hotelName:
      `${DESTINATIONS[index][0]} ${HOTEL_SUFFIXES[profileIndex]}`,
  };
}

function validInteger(value, min, max, field) {
  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < min ||
    number > max
  ) {
    throw new Error(`Invalid ${field}.`);
  }

  return number;
}

function calculateBookingPrice(input) {
  const bookingType = input.bookingType;

  const rooms = validInteger(input.rooms, 1, 5, "rooms");
  const adults = validInteger(input.adults, 1, 8, "adults");
  const children = validInteger(input.children, 0, 6, "children");

  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  if (
    !Number.isFinite(checkIn.getTime()) ||
    !Number.isFinite(checkOut.getTime())
  ) {
    throw new Error("Invalid booking dates.");
  }

  const nights =
    (Date.UTC(
      checkOut.getUTCFullYear(),
      checkOut.getUTCMonth(),
      checkOut.getUTCDate()
    ) -
      Date.UTC(
        checkIn.getUTCFullYear(),
        checkIn.getUTCMonth(),
        checkIn.getUTCDate()
      )) /
    86400000;

  if (!Number.isInteger(nights) || nights < 1) {
    throw new Error("Check-out must be after check-in.");
  }

  let basePrice;
  let destination;
  let packageName = "";
  let hotel = "";
  let hotelId = "";

  if (bookingType === "package") {
    packageName = String(input.packageName || "").trim();

    basePrice = PACKAGE_PRICES[packageName];
    destination = PACKAGE_DESTINATIONS[packageName];

    if (!basePrice || !destination) {
      throw new Error("Invalid holiday package.");
    }

    // Do not accept a mismatched package/destination pair.
    const submittedDestination = normalize(input.destination);

    if (
      submittedDestination !== normalize(destination) &&
      submittedDestination !==
        normalize(destination.split(",")[0])
    ) {
      throw new Error("Package destination mismatch.");
    }
  } else if (bookingType === "hotel") {
    const matched = findDestination(input.destination);

    if (!matched) {
      throw new Error("Invalid destination.");
    }

    destination = matched[0];

    const hotelResult = getHotelPrice(
      input.hotelId,
      destination
    );

    basePrice = hotelResult.price;
    hotel = hotelResult.hotelName;
    hotelId = String(input.hotelId);
  } else if (bookingType === "trip") {
    const matched = findDestination(input.destination);

    if (!matched) {
      throw new Error("Invalid destination.");
    }

    destination = matched[0];
    basePrice = DESTINATION_PRICES[destination];
  } else {
    throw new Error("Invalid booking type.");
  }

  const subtotal =
    bookingType === "hotel"
      ? basePrice * rooms * nights
      : basePrice * (adults + children);

  const coupon = String(input.coupon || "")
    .trim()
    .toUpperCase();

  if (coupon && coupon !== "WELCOME10") {
    throw new Error("Invalid coupon.");
  }

  const discount =
    coupon === "WELCOME10"
      ? Math.round(subtotal * 0.1)
      : 0;

  const taxes = Math.round(
    (subtotal - discount) * 0.05
  );

  const total = subtotal - discount + taxes;

  if (!Number.isSafeInteger(total) || total < 1) {
    throw new Error("Invalid booking total.");
  }

  return {
    destination,
    packageName,
    hotel,
    hotelId,
    nights,
    subtotal,
    discount,
    taxes,
    total,
    coupon,
    pricingVerified: true,
    verifiedAmountPaise: total * 100,
  };
}

module.exports = {
  calculateBookingPrice,
};
