
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Travel.css';
import '../styles/RoundTrip.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const token = () => sessionStorage.getItem('wandernest_token');

const money = (paise) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(paise || 0) / 100);

const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token() || ''}`,
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function arrival(departure, duration) {
  const parts = String(duration).match(/(\d+)h\s*(\d+)m/);
  if (!parts) return '—';

  const [h, m] = departure.split(':').map(Number);

  const mins =
    h * 60 +
    m +
    Number(parts[1]) * 60 +
    Number(parts[2]);

  return (
    `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:` +
    `${String(mins % 60).padStart(2, '0')}`
  );
}

const scheduleValue = (day, item) =>
  day && item?.departure
    ? `${day.slice(0, 10)}T${item.departure}`
    : '';

const toIstIso = (value) =>
  new Date(`${value}+05:30`).toISOString();

const showIst = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(new Date(toIstIso(value))) + ' IST'
    : 'Choose date';

const showArrivalIst = (value, duration) => {
  if (!value) return '—';

  const match = String(duration).match(/(\d+)h\s*(\d+)m/);
  if (!match) return '—';

  const minutes = Number(match[1]) * 60 + Number(match[2]);

  const end = new Date(
    new Date(toIstIso(value)).getTime() + minutes * 60000
  );

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(end) + ' IST';
};

// =====================================================
// DATE-WISE SIMULATED TRAIN AVAILABILITY
// =====================================================

function stableHash(value) {
  let h = 2166136261;

  for (const char of String(value)) {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
}

function getDateWiseTrains(trains, journeyDate, fromCity, toCity) {
  if (!journeyDate || !trains.length) return trains;

  const dateOnly = journeyDate.slice(0, 10);

  // Group by route so a broad search doesn't
  // incorrectly show only 5-12 trains in total.
  const groups = new Map();

  for (const item of trains) {
    const routeKey = [
      Boolean(item.international),
      String(item.fromCity || '').toLowerCase(),
      String(item.toCity || '').toLowerCase()
    ].join(':');

    if (!groups.has(routeKey)) {
      groups.set(routeKey, []);
    }

    groups.get(routeKey).push(item);
  }

  const output = [];

  for (const [routeKey, routeTrains] of groups) {
    const key = [
      dateOnly,
      routeKey,
      String(fromCity || '').toLowerCase(),
      String(toCity || '').toLowerCase()
    ].join(':');

    const seed = stableHash(key);

    // 5 to 12 options, depending on route and date.
    const count = 5 + (seed % 8);

    const chosen = [...routeTrains]
      .sort((a, b) => {
        const aScore = stableHash(`${key}:${a.id}`);
        const bScore = stableHash(`${key}:${b.id}`);

        return aScore - bScore ||
          String(a.id).localeCompare(String(b.id));
      })
      .slice(0, count);

    output.push(...chosen);
  }

  return output;
}

// =====================================================

const icon = {
  flight: '✈',
  train: '🚆',
  cab: '🚕'
};

const title = {
  flight: 'Find your next flight',
  train: 'Discover your next train journey',
  cab: 'Your ride, your route'
};

const subtitle = {
  flight: 'Explore domestic and international connections with ease.',
  train: 'Compare routes, timings and travel classes in one place.',
  cab: 'Find your pickup and destination, then choose the perfect ride.'
};

export default function Travel() {
  const { kind = 'flight' } = useParams();
  const cab = kind === 'cab';

  const [region, setRegion] = useState('domestic');
  const [items, setItems] = useState([]);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const [tripType, setTripType] = useState('oneway');
  const [returnDate, setReturnDate] = useState('');
  const [returnSelected, setReturnSelected] = useState(null);
  const [returnClass, setReturnClass] = useState('');

  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState('recommended');

  const [selected, setSelected] = useState(null);
  const [travelClass, setTravelClass] = useState('');

  const [passengers, setPassengers] = useState([
    { name: '', age: 25, gender: 'Other' }
  ]);

  const [vehicle, setVehicle] = useState('Sedan');
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [quote, setQuote] = useState(null);

  const [message, setMessage] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  const cityNames = useMemo(
    () => [
      ...new Set(
        items.flatMap(item => [item.fromCity, item.toCity])
      )
    ].filter(Boolean).sort(),
    [items]
  );

  useEffect(() => {
    setSelected(null);
    setReturnSelected(null);
    setSearch(null);
    setMessage('');
    setItems([]);

    if (cab) return;

    let active = true;
    setLoading(true);

    api(`/api/travel/inventory?kind=${kind}&region=${region}`)
      .then(data => {
        if (active) setItems(data.items || []);
      })
      .catch(error => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [kind, region, cab]);

  const results = useMemo(() => {
    if (!search) return [];

    let matching = items.filter(item => {
      const fromMatches =
        !search.from ||
        String(item.fromCity).toLowerCase() ===
          search.from.toLowerCase();

      const toMatches =
        !search.to ||
        String(item.toCity).toLowerCase() ===
          search.to.toLowerCase();

      return fromMatches && toMatches;
    });

    // Only trains vary by date.
    // Flight results remain unchanged.
    if (kind === 'train') {
      matching = getDateWiseTrains(
        matching,
        search.date,
        search.from,
        search.to
      );
    }

    matching = [...matching];

    if (sort === 'price') {
      matching.sort((a, b) => a.fare - b.fare);
    }

    if (sort === 'departure') {
      matching.sort((a, b) =>
        a.departure.localeCompare(b.departure)
      );
    }

    return matching;
  }, [items, search, sort, kind]);

  const returnResults = useMemo(() => {
    if (
      kind !== 'flight' ||
      tripType !== 'roundtrip' ||
      !selected
    ) {
      return [];
    }

    return items
      .filter(item =>
        item.fromCity.toLowerCase() ===
          selected.toCity.toLowerCase() &&
        item.toCity.toLowerCase() ===
          selected.fromCity.toLowerCase()
      )
      .sort((a, b) => a.fare - b.fare);
  }, [kind, tripType, selected, items]);

  function selectItem(item) {
    setSelected(item);
    setReturnSelected(null);
    setTravelClass(item.classes[0]);
    setDate(d => scheduleValue(d, item));
    setMessage('');
    setCheckoutMessage('');
  }

  function selectReturnItem(item) {
    setReturnSelected(item);
    setReturnClass(item.classes[0]);
    setReturnDate(d => scheduleValue(d, item));
    setMessage('');
    setCheckoutMessage('');
  }

  const setPassenger = (index, key, value) => {
    setCheckoutMessage('');
    setPassengers(list =>
      list.map((p, i) =>
        i === index ? { ...p, [key]: value } : p
      )
    );
  };

  async function getQuote() {
    try {
      setBusy(true);
      setMessage('');

      const data = await api('/api/travel/cab/quote', {
        method: 'POST',
        body: JSON.stringify({ pickup, drop, vehicle })
      });

      setQuote(data.quote);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function book() {
    setCheckoutMessage('');

    if (passengers.some(p => !String(p.name || '').trim() || !Number.isFinite(Number(p.age)) || Number(p.age) < 1 || Number(p.age) > 120)) {
      setCheckoutMessage('Please enter a valid full name and age (1-120) for every traveller.');
      return;
    }

    if (cab) {
      const seats = { Mini: 3, Sedan: 4, SUV: 6, Premium: 4 };
      if (passengers.length > seats[vehicle]) {
        setCheckoutMessage(`${vehicle} supports up to ${seats[vehicle]} passengers. Choose a larger cab or reduce travellers.`);
        return;
      }
      if (!pickup || !drop || !quote) {
        setCheckoutMessage('Select pickup and drop, then calculate a fresh fare.');
        return;
      }
    }

    if (!token()) {
      setCheckoutMessage('Please log in to continue with your booking.');
      return;
    }

    if (!date) {
      setCheckoutMessage('Please choose a departure or pickup date and time.');
      return;
    }

    if (
      !cab &&
      (!selected || date !== scheduleValue(date, selected))
    ) {
      setCheckoutMessage(
        'Select a journey to set its scheduled departure time.'
      );
      return;
    }

    if (
      kind === 'flight' &&
      tripType === 'roundtrip' &&
      returnSelected &&
      returnDate !== scheduleValue(returnDate, returnSelected)
    ) {
      setCheckoutMessage(
        'Select a return flight to set its scheduled time.'
      );
      return;
    }

    if (
      kind === 'flight' &&
      tripType === 'roundtrip' &&
      (
        !returnSelected ||
        !returnDate ||
        new Date(toIstIso(returnDate)) <=
          new Date(toIstIso(date))
      )
    ) {
      setCheckoutMessage(
        'Select a return flight and a return date after departure.'
      );
      return;
    }

    if (
      new Date(toIstIso(date)) <= new Date()
    ) {
      setCheckoutMessage('Choose a future date and time.');
      return;
    }

    try {
      setBusy(true);
      setCheckoutMessage('');

      const data = await api('/api/travel/book', {
        method: 'POST',
        body: JSON.stringify({
          itemId: cab ? 'CAB' : selected.id,
          ...(kind === 'flight' && tripType === 'roundtrip'
            ? {
                returnItemId: returnSelected.id,
                returnDate: toIstIso(returnDate),
                returnTravelClass: returnClass
              }
            : {}),
          travelDate: toIstIso(date),
          travelClass,
          passengers,
          pickup,
          drop,
          vehicle,
          quote
        })
      });

      const order = await api(
        `/api/travel/${data.booking._id}/order`,
        { method: 'POST' }
      );

      if (!window.Razorpay) {
        throw new Error(
          'Razorpay checkout did not load. Your unpaid booking is available in Travel Bookings.'
        );
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.order.amount,
        currency: 'INR',
        order_id: order.order.id,
        name: 'WanderNest',
        description: `Travel booking · ${kind} · Test Mode`,

        handler: async payment => {
          try {
            await api(
              `/api/travel/${data.booking._id}/verify`,
              {
                method: 'POST',
                body: JSON.stringify(payment)
              }
            );

            setCheckoutMessage(
              'Payment verified! Your booking and PDF documents are available in Travel Bookings.'
            );
          } catch (error) {
            setCheckoutMessage(
              `Payment verification needs review: ${error.message}`
            );
          } finally {
            setBusy(false);
          }
        },

        modal: {
          ondismiss: () => {
            setBusy(false);
            setCheckoutMessage(
              'Checkout closed. Your unpaid booking remains in Travel Bookings.'
            );
          }
        }
      });

      checkout.open();
    } catch (error) {
      setBusy(false);
      setCheckoutMessage(error.message);
    }
  }

  const trip = kind === 'train' ? 'train' : 'flight';

  return (
    <main className="travel-shell">
      <section className="travel-hero">
        <div className="travel-container">
          <div className="travel-hero-top">
            <span className="travel-kicker">
              WANDERNEST · TRAVEL MADE SIMPLE
            </span>
            <Link
              className="travel-hero-link"
              to="/my-travel-bookings"
            >
              My travel bookings ↗
            </Link>
          </div>

          <h1>{title[kind] || title.flight}</h1>
          <p>{subtitle[kind] || subtitle.flight}</p>
        </div>
      </section>

      <div className="travel-container travel-content">
        <section
          className="travel-search-card"
          aria-label={`${kind} search`}
        >
          {!cab ? (
            <>
              <div className="travel-tabs">
                <button
                  type="button"
                  className={
                    region === 'domestic' ? 'active' : ''
                  }
                  onClick={() => setRegion('domestic')}
                >
                  Domestic
                </button>

                <button
                  type="button"
                  className={
                    region === 'international' ? 'active' : ''
                  }
                  onClick={() => setRegion('international')}
                >
                  International
                </button>

                <span className="travel-search-hint">
                  Explore cities and compare journeys
                </span>
              </div>

              {kind === 'flight' && (
                <div className="wn-trip-switch">
                  <button
                    type="button"
                    className={
                      tripType === 'oneway' ? 'active' : ''
                    }
                    onClick={() => {
                      setTripType('oneway');
                      setReturnSelected(null);
                    }}
                  >
                    ✈ One Way
                  </button>

                  <button
                    type="button"
                    className={
                      tripType === 'roundtrip' ? 'active' : ''
                    }
                    onClick={() => {
                      setTripType('roundtrip');
                      setReturnSelected(null);
                    }}
                  >
                    ⇄ Round Trip
                  </button>
                </div>
              )}

              <form
                onSubmit={e => {
                  e.preventDefault();

                  setSelected(null);
                  setReturnSelected(null);

                  if (!date) {
                    setMessage('Choose a journey date to search.');
                    return;
                  }

                  if (
                    from.trim() &&
                    to.trim() &&
                    from.trim().toLowerCase() ===
                      to.trim().toLowerCase()
                  ) {
                    setMessage(
                      'Departure and destination must be different.'
                    );
                    return;
                  }

                  setMessage('');
                  setSearch({
                    from: from.trim(),
                    to: to.trim(),
                    date: date.slice(0, 10)
                  });
                }}
              >
                <datalist id="wn-from-cities">
                  {cityNames.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>

                <datalist id="wn-to-cities">
                  {cityNames.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>

                <div className="travel-search-grid">
                  <label>
                    FROM
                    <input
                      list="wn-from-cities"
                      placeholder={
                        kind === 'train'
                          ? 'Departure city / station'
                          : 'Departure city'
                      }
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                    />
                  </label>

                  <label>
                    TO
                    <input
                      list="wn-to-cities"
                      placeholder={
                        kind === 'train'
                          ? 'Arrival city / station'
                          : 'Destination city'
                      }
                      value={to}
                      onChange={e => setTo(e.target.value)}
                    />
                  </label>

                  <label>
                    JOURNEY DATE
                    <input
                      type="date"
                      min={today()}
                      value={date.slice(0, 10)}
                      onChange={e => {
                        setDate(
                          e.target.value
                            ? `${e.target.value}T00:00`
                            : ''
                        );
                        setSelected(null);
                        setReturnSelected(null);
                        setSearch(null);
                      }}
                    />
                  </label>

                  {kind === 'flight' &&
                    tripType === 'roundtrip' && (
                      <label>
                        RETURN DATE
                        <input
                          type="date"
                          min={date.slice(0, 10) || today()}
                          value={returnDate.slice(0, 10)}
                          onChange={e => {
                            setReturnDate(
                              e.target.value
                                ? `${e.target.value}T00:00`
                                : ''
                            );
                            setReturnSelected(null);
                          }}
                        />
                      </label>
                    )}

                  <label>
                    TRAVELLERS
                    <select
                      value={passengers.length}
                      onChange={e =>
                        setPassengers(old =>
                          Array.from(
                            { length: Number(e.target.value) },
                            (_, i) =>
                              old[i] || {
                                name: '',
                                age: 25,
                                gender: 'Other'
                              }
                          )
                        )
                      }
                    >
                      {Array.from({ length: 8 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}{' '}
                          {i === 0 ? 'traveller' : 'travellers'}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="travel-search-bottom">
                  <span>
                    ✦ Compare fares, timings and travel classes
                  </span>
                  <button
                    type="submit"
                    className="travel-primary"
                  >
                    Search{' '}
                    {kind === 'train' ? 'Trains' : 'Flights'} →
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="travel-tabs">
                <span className="travel-tab-heading">
                  Plan your ride
                </span>
                <span className="travel-search-hint">
                  Search pickup and drop locations worldwide
                </span>
              </div>

              <div className="travel-cab-grid">
                <OSMPlace
                  label="PICKUP LOCATION"
                  onPick={place => {
                    setPickup(place);
                    setQuote(null);
                  }}
                />

                <OSMPlace
                  label="DROP LOCATION"
                  onPick={place => {
                    setDrop(place);
                    setQuote(null);
                  }}
                />

                <label>
                  CAB TYPE
                  <select
                    value={vehicle}
                    onChange={e => {
                      setVehicle(e.target.value);
                      setQuote(null);
                    }}
                  >
                    {['Mini', 'Sedan', 'SUV', 'Premium'].map(
                      v => <option key={v}>{v}</option>
                    )}
                  </select>
                </label>
              </div>

              <div className="travel-search-bottom">
                <span>
                  Driving distance and estimated fare via OpenStreetMap and OSRM
                </span>
                <button
                  type="button"
                  className="travel-primary"
                  onClick={getQuote}
                  disabled={!pickup || !drop || busy}
                >
                  {busy
                    ? 'Calculating...'
                    : 'Get fare & route →'}
                </button>
              </div>
            </>
          )}
        </section>

        {message && (
          <div className="travel-alert" role="status">
            {message}
          </div>
        )}

        {!cab && (
          <section className="travel-listing">
            <div className="travel-section-head">
              <div>
                <span className="travel-eyebrow">
                  EXPLORE YOUR OPTIONS
                </span>

                <h2>
                  {search
                    ? `${results.length} ${trip}${
                        results.length === 1 ? '' : 's'
                      } found`
                    : 'Ready for takeoff?'}
                </h2>

                <p>
                  {search
                    ? `Simulated routes${
                        search.from
                          ? ` from ${search.from}`
                          : ''
                      }${
                        search.to
                          ? ` to ${search.to}`
                          : ''
                      }${
                        kind === 'train'
                          ? ` on ${search.date}.`
                          : '.'
                      }`
                    : `Enter your route and search to explore ${region} ${trip} options.`}
                </p>
              </div>

              {search && (
                <label className="travel-sort">
                  SORT BY
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                  >
                    <option value="recommended">
                      Recommended
                    </option>
                    <option value="price">
                      Lowest price
                    </option>
                    <option value="departure">
                      Earliest departure
                    </option>
                  </select>
                </label>
              )}
            </div>

            {loading && (
              <div className="travel-empty">
                Loading available routes...
              </div>
            )}

            {!loading && search && !results.length && (
              <div className="travel-empty">
                <strong>No matching journeys found</strong>
                <p>
                  Choose a city from the suggestions,
                  or clear From/To to explore supported
                  routes. Live availability is not connected.
                </p>
              </div>
            )}

            {!loading && !search && (
              <div className="travel-empty travel-empty-welcome">
                <span>{icon[kind]}</span>
                <strong>
                  Find a journey that fits your plans
                </strong>
                <p>
                  Search by origin, destination and date.
                  We’ll show routes and fares below.
                </p>
              </div>
            )}

            <div className="travel-result-list">
              {results.map(item => (
                <article
                  key={item.id}
                  className={`travel-result-card ${
                    selected?.id === item.id
                      ? 'is-selected'
                      : ''
                  }`}
                >
                  <div className="travel-provider">
                    <div className="travel-provider-avatar">
                      {kind === 'flight' ? '✈' : '🚆'}
                    </div>

                    <div>
                      <strong>
                        {String(item.provider || '')
                          .replace(/\s+Demo\b/gi, '')}
                      </strong>
                      <span>
                        {item.number} · {item.classes[0]}
                      </span>
                    </div>
                  </div>

                  <div className="travel-timeline">
                    <div>
                      <strong>{item.departure}</strong>
                      <span>{item.fromCity}</span>
                    </div>

                    <div className="travel-route-line">
                      <small>{item.duration}</small>
                      <div className="travel-line">
                        <i></i>
                        <b></b>
                        <i></i>
                      </div>
                      <small>Sample schedule · IST</small>
                    </div>

                    <div>
                      <strong>
                        {arrival(
                          item.departure,
                          item.duration
                        )}
                      </strong>
                      <span>{item.toCity}</span>
                    </div>
                  </div>

                  <div className="travel-price">
                    <small>Starting from</small>
                    <strong>
                      {money(item.fare * 100)}
                    </strong>
                    <span>per traveller</span>
                    <button
                      type="button"
                      className="travel-outline"
                      onClick={() => selectItem(item)}
                    >
                      {selected?.id === item.id
                        ? 'Selected ✓'
                        : 'Select journey →'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {kind === 'flight' &&
          tripType === 'roundtrip' &&
          selected && (
            <section className="travel-listing wn-return-section">
              <div className="travel-section-head">
                <div>
                  <span className="travel-eyebrow">
                    STEP 2 OF 2
                  </span>
                  <h2>Choose your return flight</h2>
                  <p>
                    {selected.toCity} → {selected.fromCity}
                    {' · '}
                    {returnDate
                      ? new Date(
                          toIstIso(returnDate)
                        ).toLocaleDateString('en-IN', {
                          timeZone: 'Asia/Kolkata'
                        })
                      : 'Select return date above'}
                  </p>
                </div>
              </div>

              {returnResults.length ? (
                <div className="travel-result-list">
                  {returnResults.map(item => (
                    <article
                      key={item.id}
                      className={`travel-result-card ${
                        returnSelected?.id === item.id
                          ? 'is-selected'
                          : ''
                      }`}
                    >
                      <div className="travel-provider">
                        <div className="travel-provider-avatar">
                          ✈
                        </div>
                        <div>
                          <strong>
                            {String(item.provider || '')
                              .replace(/\s+Demo\b/gi, '')}
                          </strong>
                          <span>{item.number}</span>
                        </div>
                      </div>

                      <div className="travel-timeline">
                        <div>
                          <strong>{item.departure}</strong>
                          <span>{item.fromCity}</span>
                        </div>

                        <div className="travel-route-line">
                          <small>{item.duration}</small>
                          <div className="travel-line">
                            <i></i>
                            <b></b>
                            <i></i>
                          </div>
                        </div>

                        <div>
                          <strong>
                            {arrival(
                              item.departure,
                              item.duration
                            )}
                          </strong>
                          <span>{item.toCity}</span>
                        </div>
                      </div>

                      <div className="travel-price">
                        <small>From</small>
                        <strong>
                          {money(item.fare * 100)}
                        </strong>
                        <span>per traveller</span>
                        <button
                          type="button"
                          className="travel-outline"
                          onClick={() => selectReturnItem(item)}
                        >
                          {returnSelected?.id === item.id
                            ? 'Return selected ✓'
                            : 'Select return →'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="travel-empty">
                  No reverse route available for this pair
                  in the sample inventory. Try another route.
                </div>
              )}
            </section>
          )}

        {cab && (
          <section className="travel-listing">
            <div className="travel-section-head">
              <div>
                <span className="travel-eyebrow">
                  PRIVATE TRANSFERS
                </span>
                <h2>Comfort at every turn</h2>
                <p>
                  Choose a cab, get an estimated fare and
                  enjoy a seamless booking experience.
                </p>
              </div>
            </div>

            <div className="travel-vehicle-grid">
              {[
                {
                  name: 'Mini',
                  symbol: '🚗',
                  desc: 'Smart & economical',
                  seats: 'Up to 3 passengers'
                },
                {
                  name: 'Sedan',
                  symbol: '🚘',
                  desc: 'Everyday comfort',
                  seats: 'Up to 4 passengers'
                },
                {
                  name: 'SUV',
                  symbol: '🚙',
                  desc: 'Extra space for groups',
                  seats: 'Up to 6 passengers'
                },
                {
                  name: 'Premium',
                  symbol: '🚖',
                  desc: 'A more refined ride',
                  seats: 'Up to 4 passengers'
                }
              ].map(v => (
                <button
                  type="button"
                  key={v.name}
                  className={`travel-vehicle ${
                    vehicle === v.name ? 'active' : ''
                  }`}
                  onClick={() => {
                    setVehicle(v.name);
                    setQuote(null);
                  }}
                >
                  <span className="travel-vehicle-icon">
                    {v.symbol}
                  </span>
                  <strong>{v.name}</strong>
                  <small>{v.desc}</small>
                  <span>{v.seats}</span>
                </button>
              ))}
            </div>

            {quote && (
              <div className="travel-quote">
                <div>
                  <span className="travel-eyebrow">
                    YOUR ROUTE ESTIMATE
                  </span>
                  <h3>
                    {pickup?.address} → {drop?.address}
                  </h3>
                  <p>
                    {Number(quote.distanceKm).toFixed(1)} km
                    {' · '}
                    {quote.durationText}
                    {' · '}
                    {vehicle}
                  </p>
                  <a
                    href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${pickup.lat}%2C${pickup.lon}%3B${drop.lat}%2C${drop.lon}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View route on OpenStreetMap ↗
                  </a>
                </div>

                <strong>
                  {money(quote.amountPaise)}
                </strong>
              </div>
            )}
          </section>
        )}

        {(
          (cab && quote) ||
          (
            !cab &&
            selected &&
            (
              kind !== 'flight' ||
              tripType !== 'roundtrip' ||
              returnSelected
            )
          )
        ) && (
          <section
            className="travel-checkout"
            id="travel-checkout"
          >
            <div className="travel-section-head">
              <div>
                <span className="travel-eyebrow">
                  COMPLETE YOUR JOURNEY
                </span>
                <h2>Traveller & booking details</h2>
                <p>
                  Review your selection and enter passenger
                  information.
                </p>
              </div>
            </div>

            <div className="travel-checkout-grid">
              <div className="travel-checkout-form">
                {!cab && (
                  <label>
                    Travel class
                    <select
                      value={travelClass}
                      onChange={e =>
                        setTravelClass(e.target.value)
                      }
                    >
                      {selected.classes.map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                )}

                {kind === 'flight' &&
                  tripType === 'roundtrip' &&
                  returnSelected && (
                    <label>
                      Return class
                      <select
                        value={returnClass}
                        onChange={e =>
                          setReturnClass(e.target.value)
                        }
                      >
                        {returnSelected.classes.map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  )}

                {cab ? (
                  <label>
                    Pickup date & time
                    <input
                      type="datetime-local"
                      value={date}
                      min={`${today()}T00:00`}
                      onChange={e => setDate(e.target.value)}
                    />
                  </label>
                ) : (
                  <>
                    <label>
                      Departure date & time (IST)
                      <input
                        readOnly
                        type="text"
                        value={showIst(date)}
                      />
                    </label>

                    <label>
                      Arrival date & time (IST)
                      <input
                        readOnly
                        type="text"
                        value={showArrivalIst(
                          date,
                          selected.duration
                        )}
                      />
                    </label>

                    {kind === 'flight' &&
                      tripType === 'roundtrip' &&
                      returnSelected && (
                        <>
                          <label>
                            Return departure (IST)
                            <input
                              readOnly
                              type="text"
                              value={showIst(returnDate)}
                            />
                          </label>
                          <label>
                            Return arrival (IST)
                            <input
                              readOnly
                              type="text"
                              value={showArrivalIst(
                                returnDate,
                                returnSelected.duration
                              )}
                            />
                          </label>
                        </>
                      )}
                  </>
                )}

                <h3>Passenger details</h3>

                {passengers.map((p, i) => (
                  <div
                    className="travel-person"
                    key={i}
                  >
                    <strong>Traveller {i + 1}</strong>

                    <div className="travel-person-grid">
                      <label>
                        Full name
                        <input
                          placeholder="Name as on ID"
                          value={p.name}
                          onChange={e =>
                            setPassenger(
                              i,
                              'name',
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Age
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={p.age}
                          onChange={e =>
                            setPassenger(
                              i,
                              'age',
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Gender
                        <select
                          value={p.gender}
                          onChange={e =>
                            setPassenger(
                              i,
                              'gender',
                              e.target.value
                            )
                          }
                        >
                          <option>Other</option>
                          <option>Female</option>
                          <option>Male</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="travel-summary">
                <span className="travel-eyebrow">
                  YOUR BOOKING
                </span>

                <h3>
                  {cab
                    ? `${vehicle} cab transfer`
                    : `${selected.fromCity} → ${selected.toCity}`}
                </h3>

                <p>
                  {cab
                    ? `${Number(
                        quote.distanceKm
                      ).toFixed(1)} km · ${quote.durationText}`
                    : `${selected.provider} · ${selected.number} · ${travelClass}`}
                </p>

                {kind === 'flight' &&
                  tripType === 'roundtrip' &&
                  returnSelected && (
                    <>
                      <p>
                        Return: {returnSelected.fromCity}
                        {' → '}
                        {returnSelected.toCity}
                        {' · '}
                        {returnSelected.provider}
                        {' · '}
                        {returnSelected.departure}
                        {' · '}
                        {returnClass}
                      </p>

                      <div className="travel-summary-line">
                        <span>Onward fare</span>
                        <strong>
                          {money(
                            selected.fare *
                            (
                              selected.classes.indexOf(
                                travelClass
                              ) + 1
                            ) *
                            100 *
                            passengers.length
                          )}
                        </strong>
                      </div>

                      <div className="travel-summary-line">
                        <span>Return fare</span>
                        <strong>
                          {money(
                            returnSelected.fare *
                            (
                              returnSelected.classes.indexOf(
                                returnClass
                              ) + 1
                            ) *
                            100 *
                            passengers.length
                          )}
                        </strong>
                      </div>
                    </>
                  )}

                <div className="travel-summary-line">
                  <span>Travellers</span>
                  <strong>{passengers.length}</strong>
                </div>

                <div className="travel-summary-line">
                  <span>Travel date</span>
                  <strong>
                    {date
                      ? (
                          cab
                            ? new Date(
                                date
                              ).toLocaleDateString('en-IN')
                            : showIst(date)
                        )
                      : 'Choose date'}
                  </strong>
                </div>

                <div className="travel-summary-total">
                  <span>Total Fare</span>
                  <strong>
                    {cab
                      ? money(quote.amountPaise)
                      : money(
                          (
                            selected.fare *
                            (
                              selected.classes.indexOf(
                                travelClass
                              ) + 1
                            ) +
                            (
                              kind === 'flight' &&
                              tripType === 'roundtrip' &&
                              returnSelected
                                ? returnSelected.fare *
                                  (
                                    returnSelected.classes.indexOf(
                                      returnClass
                                    ) + 1
                                  )
                                : 0
                            )
                          ) *
                          100 *
                          passengers.length
                        )}
                  </strong>
                </div>

                <p className="travel-disclosure">
                  Simulated travel booking for demonstration
                  only. Razorpay uses Test Mode; no real
                  ticket or reservation is issued.
                </p>

                {checkoutMessage && (
                  <div className="travel-alert" role="alert" aria-live="polite">
                    {checkoutMessage}
                  </div>
                )}

                <button
                  type="button"
                  className="travel-primary travel-pay"
                  onClick={book}
                  disabled={busy}
                >
                  {busy
                    ? 'Processing...'
                    : 'Proceed to Payment →'}
                </button>
              </aside>
            </div>
          </section>
        )}

        <div className="travel-footer-link">
          <Link to="/my-travel-bookings">
            View your flight, train & cab bookings →
          </Link>
        </div>
      </div>
    </main>
  );
}

// =====================================================
// OPENSTREETMAP LOCATION SEARCH - CAB
// Button-triggered search; no public Nominatim autocomplete
// =====================================================

function OSMPlace({ label, onPick }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [addressDetail, setAddressDetail] = useState('');
  const [error, setError] = useState('');
  const requestId = useRef(0);

  useEffect(() => () => { requestId.current += 1; }, []);

  async function searchPlace() {
    const q = query.trim();
    if (q.length < 3) {
      setError('Enter at least 3 characters.');
      return;
    }
    if (!token()) {
      setError('Please log in to search locations.');
      return;
    }

    const id = ++requestId.current;
    setBusy(true);
    setError('');
    setSuggestions([]);
    setChosen(false);
    setSelectedPlace(null);
    setAddressDetail('');
    onPick(null);

    try {
      const data = await api(`/api/travel/cab/locations?q=${encodeURIComponent(q)}`);
      if (id !== requestId.current) return;
      const items = data.items || [];
      setSuggestions(items);
      if (!items.length) setError('Exact building not mapped. Search a nearby locality/city instead, select it, then enter your building and street below.');
    } catch (err) {
      if (id === requestId.current) setError(err.message || 'Location search failed.');
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }

  return (
    <div className="travel-place">
      <label>
        {label}
        <input
          autoComplete="off"
          placeholder="Search nearby city or locality (e.g. Mullanpur)"
          value={query}
          onChange={e => {
            requestId.current += 1;
            setBusy(false);
            setQuery(e.target.value);
            setChosen(false);
            setSelectedPlace(null);
            setAddressDetail('');
            setSuggestions([]);
            setError('');
            onPick(null);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!busy) searchPlace();
            }
          }}
        />
      </label>

      <button
        type="button"
        className="travel-outline"
        style={{ marginTop: 10 }}
        disabled={busy || query.trim().length < 3}
        onClick={searchPlace}
      >
        {busy ? 'Searching...' : 'Search Location'}
      </button>

      {chosen && (
        <small className="travel-place-hint" style={{ display: 'block', marginTop: 8 }}>
          ✓ Location selected
        </small>
      )}

      {chosen && selectedPlace && (
        <label style={{ display: 'block', marginTop: 10 }}>
          BUILDING / SOCIETY / STREET (OPTIONAL)
          <input
            autoComplete="off"
            placeholder="e.g. Ambika Florence Park, Sector 14"
            value={addressDetail}
            maxLength={180}
            onChange={e => {
              const detail = e.target.value;
              setAddressDetail(detail);
              onPick({
                placeId: selectedPlace.placeId,
                address: detail.trim()
                  ? `${detail.trim()}, ${selectedPlace.address}`
                  : selectedPlace.address,
                lat: Number(selectedPlace.lat),
                lon: Number(selectedPlace.lon)
              });
            }}
          />
          <small className="travel-place-hint">
            Route uses the selected mapped location, not the exact building entrance.
          </small>
        </label>
      )}

      {error && (
        <small className="travel-place-hint" role="alert" style={{ display: 'block', marginTop: 8, color: '#b91c1c' }}>
          {error}
        </small>
      )}

      {suggestions.length > 0 && (
        <div className="travel-suggestions">
          {suggestions.map(place => (
            <button
              type="button"
              key={place.placeId}
              onClick={() => {
                requestId.current += 1;
                setQuery(place.address);
                setChosen(true);
                setSelectedPlace(place);
                setAddressDetail('');
                setSuggestions([]);
                setError('');
                onPick({
                  placeId: place.placeId,
                  address: place.address,
                  lat: Number(place.lat),
                  lon: Number(place.lon)
                });
              }}
            >
              📍 {place.address}
            </button>
          ))}
        </div>
      )}

      <small className="travel-place-hint" style={{ display: 'block', marginTop: 10 }}>
        Location data © OpenStreetMap contributors
      </small>
    </div>
  );
}
