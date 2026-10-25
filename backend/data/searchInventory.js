
// WanderNest - Simulated Travel Inventory
// College project demonstration only.
// Airline and train service names are used for illustration.
// Flights, trains, fares, schedules and tickets are simulated.
// All departure timings are treated as IST (Asia/Kolkata).

// Preserve original inventory and existing booking IDs.
const original = require('./travelInventory.json');

// =====================================================
// FLIGHTS - EXISTING WORKING LOGIC
// =====================================================

const domesticCities = [
  ...new Set(
    original
      .filter(x => x.kind === 'flight' && !x.international)
      .flatMap(x => [x.fromCity, x.toCity])
  )
].sort();

const overseasCities = [
  ...new Set(
    original
      .filter(x => x.kind === 'flight' && x.international)
      .flatMap(x => [x.fromCity, x.toCity])
  )
].sort();

const hubs = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad',
  'Kochi'
];

// Real airline names, simulated flights.
const domesticAirlines = [
  'IndiGo',
  'Air India',
  'Akasa Air',
  'SpiceJet'
];

const internationalAirlines = [
  'Air India',
  'Emirates',
  'Qatar Airways',
  'Etihad Airways',
  'Singapore Airlines',
  'Lufthansa',
  'British Airways'
];

const FLIGHTS_PER_ROUTE = 10;

// Keep original flight routes and add simulated connections.
const routes = new Map();

function routeKey(fromCity, toCity, international) {
  return (
    `${Boolean(international)}:` +
    `${String(fromCity).toLowerCase()}:` +
    `${String(toCity).toLowerCase()}`
  );
}

function addRoute(fromCity, toCity, international) {
  if (!fromCity || !toCity || fromCity === toCity) return;

  const key = routeKey(fromCity, toCity, international);

  if (!routes.has(key)) {
    routes.set(key, {
      fromCity,
      toCity,
      international: Boolean(international)
    });
  }
}

// Include routes already present in original inventory.
for (const item of original) {
  if (item.kind === 'flight') {
    addRoute(
      item.fromCity,
      item.toCity,
      item.international
    );
  }
}

// Domestic flight connections.
for (const fromCity of domesticCities) {
  for (const toCity of domesticCities) {
    addRoute(fromCity, toCity, false);
  }
}

// International flight connections in both directions.
for (const fromCity of hubs) {
  for (const toCity of overseasCities) {
    addRoute(fromCity, toCity, true);
    addRoute(toCity, fromCity, true);
  }
}

// Stable hash ensures the same results after server restart.
function hash(text) {
  let h = 2166136261;

  for (const c of String(text)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
}

const generated = [];

// Preserve original IDs and avoid duplicates.
const originalIds = new Set(
  original.map(item => item.id)
);

// Count existing flights per route.
const originalCounts = new Map();

for (const item of original) {
  if (item.kind !== 'flight') continue;

  const key = routeKey(
    item.fromCity,
    item.toCity,
    item.international
  );

  originalCounts.set(
    key,
    (originalCounts.get(key) || 0) + 1
  );
}

// Generate enough flights to reach 10 per route.
for (const [key, route] of routes) {
  const existingCount = originalCounts.get(key) || 0;

  const needed = Math.max(
    0,
    FLIGHTS_PER_ROUTE - existingCount
  );

  for (let i = 0; i < needed; i++) {
    const seed = hash(`${key}:${i}`);

    const airlines = route.international
      ? internationalAirlines
      : domesticAirlines;

    const provider = airlines[
      (seed + i) % airlines.length
    ];

    // Spread departures through the day.
    const departureMinutes =
      (5 * 60 + i * 105 + (seed % 45)) % (24 * 60);

    const hour = Math.floor(departureMinutes / 60);
    const minute = departureMinutes % 60;

    const durationMinutes = route.international
      ? 150 + (seed % 610)
      : 55 + (seed % 175);

    const baseFare = route.international
      ? 11500
      : 2300;

    const variation = route.international
      ? 24500
      : 6900;

    const fare =
      baseFare + (seed % variation) + i * 75;

    const id =
      `SIM${seed.toString(36).toUpperCase()}_${i}`;

    if (originalIds.has(id)) continue;

    generated.push({
      id,
      kind: 'flight',
      international: route.international,

      fromCity: route.fromCity,
      toCity: route.toCity,

      provider,

      // SIM indicates an illustrative flight number.
      number: `SIM${1000 + (seed % 9000)}`,

      departure:
        `${String(hour).padStart(2, '0')}:` +
        `${String(minute).padStart(2, '0')}`,

      duration:
        `${Math.floor(durationMinutes / 60)}h ` +
        `${String(durationMinutes % 60).padStart(2, '0')}m`,

      fare,

      classes: [
        'Economy',
        'Premium Economy',
        'Business'
      ],

      currency: 'INR',
      simulated: true
    });
  }
}

// =====================================================
// NORMALIZE ORIGINAL PROVIDER NAMES
// =====================================================

const airlineNameMap = {
  'WanderNest Air': 'IndiGo',
  'SkyLink': 'Air India',
  'BlueWings': 'Akasa Air'
};

function removeDemo(name) {
  return String(name || '')
    .replace(/\s+Demo\b/gi, '')
    .trim();
}

// Keep original IDs, times, fares and routes.
// Remove "Demo" from provider names without editing JSON.
const normalizedOriginal = original.map(item => {
  if (item.kind === 'flight') {
    const cleanedName = removeDemo(item.provider);

    return {
      ...item,
      provider:
        airlineNameMap[cleanedName] || cleanedName
    };
  }

  if (item.kind === 'train') {
    return {
      ...item,
      provider: removeDemo(item.provider)
    };
  }

  return item;
});

// =====================================================
// TRAINS - DOMESTIC + INTERNATIONAL
// =====================================================

// Maximum pool target per route.
// Travel.jsx will show 5-12 trains based on journey date.
const TRAINS_PER_ROUTE = 12;

// Indian train service categories.
// These are simulated options, not verified real schedules.
const domesticTrainServices = [
  {
    name: 'Vande Bharat Express',
    classes: ['Chair Car', 'Executive Chair Car'],
    baseFare: 950
  },
  {
    name: 'Rajdhani Express',
    classes: ['3AC', '2AC', '1AC'],
    baseFare: 1250
  },
  {
    name: 'Shatabdi Express',
    classes: ['Chair Car', 'Executive Chair Car'],
    baseFare: 850
  },
  {
    name: 'Duronto Express',
    classes: ['Sleeper', '3AC', '2AC', '1AC'],
    baseFare: 700
  },
  {
    name: 'Garib Rath Express',
    classes: ['3AC'],
    baseFare: 550
  },
  {
    name: 'Superfast Express',
    classes: ['Sleeper', '3AC', '2AC'],
    baseFare: 400
  },
  {
    name: 'Intercity Express',
    classes: ['Second Sitting', 'Chair Car'],
    baseFare: 180
  },
  {
    name: 'Jan Shatabdi Express',
    classes: ['Second Sitting', 'Chair Car'],
    baseFare: 280
  },
  {
    name: 'Humsafar Express',
    classes: ['3AC'],
    baseFare: 800
  },
  {
    name: 'Tejas Express',
    classes: ['Chair Car', 'Executive Chair Car'],
    baseFare: 1050
  },
  {
    name: 'Sampark Kranti Express',
    classes: ['Sleeper', '3AC', '2AC'],
    baseFare: 450
  },
  {
    name: 'Double Decker Express',
    classes: ['Chair Car'],
    baseFare: 500
  }
];

// International train service categories.
// Original international routes remain unchanged.
const internationalTrainServices = [
  {
    name: 'Eurostar',
    classes: [
      'Standard',
      'Standard Premier',
      'Business Premier'
    ],
    baseFare: 5500
  },
  {
    name: 'TGV INOUI',
    classes: ['Second Class', 'First Class'],
    baseFare: 3200
  },
  {
    name: 'ICE',
    classes: ['Second Class', 'First Class'],
    baseFare: 2900
  },
  {
    name: 'Shinkansen',
    classes: ['Ordinary', 'Green Car'],
    baseFare: 4600
  },
  {
    name: 'Thalys',
    classes: ['Standard', 'Comfort', 'Premium'],
    baseFare: 3800
  },
  {
    name: 'Frecciarossa',
    classes: ['Standard', 'Premium', 'Business'],
    baseFare: 3300
  },
  {
    name: 'AVE',
    classes: ['Standard', 'Comfort'],
    baseFare: 3100
  },
  {
    name: 'Railjet',
    classes: ['Economy', 'First Class', 'Business'],
    baseFare: 2700
  },
  {
    name: 'Intercity Express',
    classes: ['Second Class', 'First Class'],
    baseFare: 2400
  },
  {
    name: 'Al Boraq',
    classes: ['Second Class', 'First Class'],
    baseFare: 2600
  },
  {
    name: 'KTX',
    classes: ['Standard', 'First Class'],
    baseFare: 3000
  },
  {
    name: 'Airport Express',
    classes: ['Standard', 'First Class'],
    baseFare: 2100
  }
];

// =====================================================
// TRAIN ROUTE MANAGEMENT
// =====================================================

const trainRoutes = new Map();

function trainRouteKey(fromCity, toCity, international) {
  return (
    `${Boolean(international)}:` +
    `${String(fromCity).trim().toLowerCase()}:` +
    `${String(toCity).trim().toLowerCase()}`
  );
}

function addTrainRoute(fromCity, toCity, international) {
  const from = String(fromCity || '').trim();
  const to = String(toCity || '').trim();

  if (!from || !to) return;

  if (from.toLowerCase() === to.toLowerCase()) {
    return;
  }

  const key = trainRouteKey(
    from,
    to,
    international
  );

  if (!trainRoutes.has(key)) {
    trainRoutes.set(key, {
      fromCity: from,
      toCity: to,
      international: Boolean(international)
    });
  }
}

// =====================================================
// STEP 1: PRESERVE ALL ORIGINAL TRAIN ROUTES
// =====================================================

// Keep original domestic and international train routes.
for (const item of original) {
  if (item.kind !== 'train') continue;

  addTrainRoute(
    item.fromCity,
    item.toCity,
    item.international
  );
}

// =====================================================
// STEP 2: GENERATE ADDITIONAL DOMESTIC TRAIN ROUTES
// =====================================================

// Collect Indian cities from domestic train + flight data.
// Never include international cities in domestic generation.
const indianTrainCitiesMap = new Map();

for (const item of original) {
  if (
    item.international ||
    (item.kind !== 'train' && item.kind !== 'flight')
  ) {
    continue;
  }

  for (const rawCity of [
    item.fromCity,
    item.toCity
  ]) {
    const city = String(rawCity || '').trim();

    if (
      city &&
      !indianTrainCitiesMap.has(city.toLowerCase())
    ) {
      indianTrainCitiesMap.set(
        city.toLowerCase(),
        city
      );
    }
  }
}

// Explicitly ensure Chandigarh -> Delhi is supported.
for (const city of [
  'Chandigarh',
  'Delhi'
]) {
  if (!indianTrainCitiesMap.has(city.toLowerCase())) {
    indianTrainCitiesMap.set(
      city.toLowerCase(),
      city
    );
  }
}

const indianTrainCities = [
  ...indianTrainCitiesMap.values()
].sort();

// Generate routes between all supported Indian cities.
// Both directions are included automatically.
//
// Example:
// Chandigarh -> Delhi
// Delhi -> Chandigarh
// Delhi -> Mumbai
// Mumbai -> Pune
//
// These are simulated city connections, not verified
// Indian Railways route availability.

for (const fromCity of indianTrainCities) {
  for (const toCity of indianTrainCities) {
    addTrainRoute(
      fromCity,
      toCity,
      false
    );
  }
}

// =====================================================
// STEP 3: KEEP INTERNATIONAL ROUTES AS BEFORE
// =====================================================

// No new international train city pairs are created.
// Existing international routes from JSON are already
// included in STEP 1.

// =====================================================
// STEP 4: COUNT EXISTING TRAINS PER ROUTE
// =====================================================

const originalTrainCounts = new Map();

for (const item of original) {
  if (item.kind !== 'train') continue;

  const key = trainRouteKey(
    item.fromCity,
    item.toCity,
    item.international
  );

  originalTrainCounts.set(
    key,
    (originalTrainCounts.get(key) || 0) + 1
  );
}

// =====================================================
// STEP 5: GENERATE TRAINS TO REACH 12 PER ROUTE
// =====================================================

const generatedTrains = [];

const usedIds = new Set([
  ...original.map(item => item.id),
  ...generated.map(item => item.id)
]);

function formatTrainTime(totalMinutes) {
  const normalized =
    ((totalMinutes % 1440) + 1440) % 1440;

  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;

  return (
    `${String(hour).padStart(2, '0')}:` +
    `${String(minute).padStart(2, '0')}`
  );
}

function formatTrainDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    `${hours}h ` +
    `${String(minutes).padStart(2, '0')}m`
  );
}

// Generate enough additional trains to make
// at least 12 options on each route.
for (const [key, route] of trainRoutes) {
  const existingCount =
    originalTrainCounts.get(key) || 0;

  const needed = Math.max(
    0,
    TRAINS_PER_ROUTE - existingCount
  );

  const services = route.international
    ? internationalTrainServices
    : domesticTrainServices;

  for (let i = 0; i < needed; i++) {
    const seed = hash(
      `TRAIN:${key}:${i}`
    );

    const service = services[
      (existingCount + i) % services.length
    ];

    // Spread train departures throughout the day.
    const departureMinutes =
      (
        4 * 60 +
        (existingCount + i) * 105 +
        (seed % 35)
      ) % 1440;

    const durationMinutes = route.international
      ? 90 + (seed % 900)
      : 120 + (seed % 960);

    const fareVariation = route.international
      ? 2500
      : 650;

    const fare =
      service.baseFare +
      (seed % fareVariation) +
      i * 35;

    const id =
      `TRSIM${seed.toString(36).toUpperCase()}_${i}`;

    if (usedIds.has(id)) continue;

    usedIds.add(id);

    generatedTrains.push({
      id,
      kind: 'train',
      international: route.international,

      fromCity: route.fromCity,
      toCity: route.toCity,

      provider: service.name,

      // Simulated number, not a real train number.
      number: `TRSIM${10000 + (seed % 90000)}`,

      departure: formatTrainTime(
        departureMinutes
      ),

      duration: formatTrainDuration(
        durationMinutes
      ),

      fare,

      classes: [...service.classes],

      currency: 'INR',
      simulated: true
    });
  }
}

// =====================================================
// FINAL INVENTORY
// =====================================================

// Original inventory stays untouched on disk.
// All original IDs remain available.
// Flight generation remains unchanged.
// Domestic train routes are expanded.
// International train routes are preserved.
// "Demo" is removed from provider display names.

module.exports = [
  ...normalizedOriginal,
  ...generated,
  ...generatedTrains
];
