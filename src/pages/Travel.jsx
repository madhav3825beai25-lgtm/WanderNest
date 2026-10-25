
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/Travel.css';
import '../styles/RoundTrip.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const token = () => sessionStorage.getItem('wandernest_token');

const money = (paise) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(paise || 0) / 100);

const today = () => new Date().toLocaleDateString('en-CA');

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token() || ''}`,
      ...(options.headers || {}),
    },
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
    h * 60 + m + Number(parts[1]) * 60 + Number(parts[2]);

  return `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(
    mins % 60
  ).padStart(2, '0')}`;
}

const icon = {
  flight: '✈',
  train: '🚆',
  cab: '🚕',
};

const title = {
  flight: 'Find your next flight',
  train: 'Discover your next train journey',
  cab: 'Your ride, your route',
};

const subtitle = {
  flight: 'Explore domestic and international connections with ease.',
  train: 'Compare routes, timings and travel classes in one place.',
  cab: 'Find your pickup and destination, then choose the perfect ride.',
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
    { name: '', age: 25, gender: 'Other' },
  ]);

  const [vehicle, setVehicle] = useState('Sedan');
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

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
      .then((data) => {
        if (active) setItems(data.items || []);
      })
      .catch((error) => {
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

    const matching = items.filter(
      (item) =>
        (!search.from ||
          item.fromCity
            .toLowerCase()
            .includes(search.from.toLowerCase())) &&
        (!search.to ||
          item.toCity
            .toLowerCase()
            .includes(search.to.toLowerCase()))
    );

    if (sort === 'price') {
      matching.sort((a, b) => a.fare - b.fare);
    }

    if (sort === 'departure') {
      matching.sort((a, b) =>
        a.departure.localeCompare(b.departure)
      );
    }

    return matching;
  }, [items, search, sort]);

  const returnResults = useMemo(() => {
    if (
      kind !== 'flight' ||
      tripType !== 'roundtrip' ||
      !selected
    ) {
      return [];
    }

    const back = items.filter(
      (item) =>
        item.fromCity.toLowerCase() ===
          selected.toCity.toLowerCase() &&
        item.toCity.toLowerCase() ===
          selected.fromCity.toLowerCase()
    );

    return back.sort((a, b) => a.fare - b.fare);
  }, [kind, tripType, selected, items]);

  const selectItem = (item) => {
    setSelected(item);
    setReturnSelected(null);
    setTravelClass(item.classes[0]);
    setMessage('');
  };

  const setPassenger = (index, key, value) => {
    setPassengers((list) =>
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
        body: JSON.stringify({
          pickup,
          drop,
          vehicle,
        }),
      });

      setQuote(data.quote);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function book() {
    if (!token()) {
      setMessage('Please log in to continue with your booking.');
      return;
    }

    if (!date) {
      setMessage('Please choose a departure or pickup date and time.');
      return;
    }

    if (
      kind === 'flight' &&
      tripType === 'roundtrip' &&
      (!returnSelected ||
        !returnDate ||
        new Date(returnDate) <= new Date(date))
    ) {
      setMessage(
        'Select a return flight and a return date after departure.'
      );
      return;
    }

    if (new Date(date) <= new Date()) {
      setMessage('Choose a future date and time.');
      return;
    }

    try {
      setBusy(true);
      setMessage('');

      const data = await api('/api/travel/book', {
        method: 'POST',
        body: JSON.stringify({
          itemId: cab ? 'CAB' : selected.id,

          ...(kind === 'flight' && tripType === 'roundtrip'
            ? {
                returnItemId: returnSelected.id,
                returnDate: new Date(returnDate).toISOString(),
                returnTravelClass: returnClass,
              }
            : {}),

          travelDate: new Date(date).toISOString(),
          travelClass,
          passengers,
          pickup,
          drop,
          vehicle,
          quote,
        }),
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

        description: `WanderNest ${
          kind === 'flight'
            ? 'Flight'
            : kind === 'train'
            ? 'Train'
            : 'Cab'
        } Booking (Test Payment)`,

        handler: async (payment) => {
          try {
            await api(
              `/api/travel/${data.booking._id}/verify`,
              {
                method: 'POST',
                body: JSON.stringify(payment),
              }
            );

            setMessage(
              'Payment verified! Your booking and PDF documents are available in Travel Bookings.'
            );
          } catch (error) {
            setMessage(
              `Payment verification needs review: ${error.message}`
            );
          } finally {
            setBusy(false);
          }
        },

        modal: {
          ondismiss: () => {
            setBusy(false);
            setMessage(
              'Checkout closed. Your unpaid booking remains in Travel Bookings.'
            );
          },
        },
      });

      checkout.open();
    } catch (error) {
      setBusy(false);
      setMessage(error.message);
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
                  className={region === 'domestic' ? 'active' : ''}
                  onClick={() => setRegion('domestic')}
                >
                  Domestic
                </button>

                <button
                  className={
                    region === 'international' ? 'active' : ''
                  }
                  onClick={() => setRegion('international')}
                >
                  International
                </button>

                <span className="travel-search-hint">
                  Explore routes, compare fares and plan your journey
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
                onSubmit={(e) => {
                  e.preventDefault();
                  setSelected(null);
                  setReturnSelected(null);
                  setSearch({
                    from: from.trim(),
                    to: to.trim(),
                  });
                }}
              >
                <div className="travel-search-grid">
                  <label>
                    FROM
                    <input
                      placeholder={
                        kind === 'train'
                          ? 'Departure city / station'
                          : 'Departure city'
                      }
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                  </label>

                  <label>
                    TO
                    <input
                      placeholder={
                        kind === 'train'
                          ? 'Arrival city / station'
                          : 'Destination city'
                      }
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </label>

                  <label>
                    JOURNEY DATE
                    <input
                      type="date"
                      min={today()}
                      value={date.slice(0, 10)}
                      onChange={(e) =>
                        setDate(
                          e.target.value
                            ? `${e.target.value}T09:00`
                            : ''
                        )
                      }
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
                          onChange={(e) =>
                            setReturnDate(
                              e.target.value
                                ? `${e.target.value}T09:00`
                                : ''
                            )
                          }
                        />
                      </label>
                    )}

                  <label>
                    TRAVELLERS
                    <select
                      value={passengers.length}
                      onChange={(e) =>
                        setPassengers((old) =>
                          Array.from(
                            { length: Number(e.target.value) },
                            (_, i) =>
                              old[i] || {
                                name: '',
                                age: 25,
                                gender: 'Other',
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
                  Worldwide Google Maps-supported driving routes
                </span>
              </div>

              <div className="travel-cab-grid">
                <GooglePlace
                  label="PICKUP LOCATION"
                  onPick={(place) => {
                    setPickup(place);
                    setQuote(null);
                  }}
                />

                <GooglePlace
                  label="DROP LOCATION"
                  onPick={(place) => {
                    setDrop(place);
                    setQuote(null);
                  }}
                />

                <label>
                  CAB TYPE
                  <select
                    value={vehicle}
                    onChange={(e) => {
                      setVehicle(e.target.value);
                      setQuote(null);
                    }}
                  >
                    {['Mini', 'Sedan', 'SUV', 'Premium'].map(
                      (v) => (
                        <option key={v}>{v}</option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <div className="travel-search-bottom">
                <span>
                  Route and fare calculated from supported Google
                  driving directions
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
                    ? `Available sample routes${
                        search.from
                          ? ` from ${search.from}`
                          : ''
                      }${
                        search.to ? ` to ${search.to}` : ''
                      }.`
                    : `Enter your route and search to explore ${region} ${trip} options.`}
                </p>
              </div>

              {search && (
                <label className="travel-sort">
                  SORT BY
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
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

            {!loading &&
              search &&
              !results.length && (
                <div className="travel-empty">
                  <strong>No matching routes found</strong>
                  <p>
                    Try another city, or leave From/To blank
                    to explore the full catalogue.
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
              {results.map((item) => (
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
                        {item.provider.replace(
                          /\s+Demo\b/gi,
                          ''
                        )}
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
                      <small>Scheduled route</small>
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
                      className="travel-outline"
                      onClick={() =>
                        selectItem(item)
                      }
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
                    {selected.toCity} →{' '}
                    {selected.fromCity} ·{' '}
                    {returnDate
                      ? new Date(
                          returnDate
                        ).toLocaleDateString('en-IN')
                      : 'Select return date above'}
                  </p>
                </div>
              </div>

              {returnResults.length ? (
                <div className="travel-result-list">
                  {returnResults.map((item) => (
                    <article
                      className={`travel-result-card ${
                        returnSelected?.id === item.id
                          ? 'is-selected'
                          : ''
                      }`}
                      key={item.id}
                    >
                      <div className="travel-provider">
                        <div className="travel-provider-avatar">
                          ✈
                        </div>

                        <div>
                          <strong>
                            {item.provider.replace(
                              /\s+Demo\b/gi,
                              ''
                            )}
                          </strong>
                          <span>{item.number}</span>
                        </div>
                      </div>

                      <div className="travel-timeline">
                        <div>
                          <strong>
                            {item.departure}
                          </strong>
                          <span>
                            {item.fromCity}
                          </span>
                        </div>

                        <div className="travel-route-line">
                          <small>
                            {item.duration}
                          </small>
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
                          <span>
                            {item.toCity}
                          </span>
                        </div>
                      </div>

                      <div className="travel-price">
                        <small>From</small>
                        <strong>
                          {money(item.fare * 100)}
                        </strong>
                        <span>per traveller</span>

                        <button
                          className="travel-outline"
                          onClick={() => {
                            setReturnSelected(item);
                            setReturnClass(
                              item.classes[0]
                            );
                            setMessage('');
                          }}
                        >
                          {returnSelected?.id ===
                          item.id
                            ? 'Return selected ✓'
                            : 'Select return →'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="travel-empty">
                  No reverse route available for this
                  pair in the sample inventory.
                  Try another route.
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
                  Choose a cab, get an estimated fare
                  and enjoy a seamless booking experience.
                </p>
              </div>
            </div>

            <div className="travel-vehicle-grid">
              {[
                {
                  name: 'Mini',
                  symbol: '🚗',
                  desc: 'Smart & economical',
                  seats: 'Up to 3 passengers',
                },
                {
                  name: 'Sedan',
                  symbol: '🚘',
                  desc: 'Everyday comfort',
                  seats: 'Up to 4 passengers',
                },
                {
                  name: 'SUV',
                  symbol: '🚙',
                  desc: 'Extra space for groups',
                  seats: 'Up to 6 passengers',
                },
                {
                  name: 'Premium',
                  symbol: '🚖',
                  desc: 'A more refined ride',
                  seats: 'Up to 4 passengers',
                },
              ].map((v) => (
                <button
                  key={v.name}
                  className={`travel-vehicle ${
                    vehicle === v.name
                      ? 'active'
                      : ''
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
                    {pickup?.address} →{' '}
                    {drop?.address}
                  </h3>

                  <p>
                    {Number(
                      quote.distanceKm
                    ).toFixed(1)}{' '}
                    km · {quote.durationText} ·{' '}
                    {vehicle}
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                      pickup.address
                    )}&destination=${encodeURIComponent(
                      drop.address
                    )}&travelmode=driving`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open route in Google Maps ↗
                  </a>
                </div>

                <strong>
                  {money(quote.amountPaise)}
                </strong>
              </div>
            )}
          </section>
        )}

        {((cab && quote) ||
          (!cab &&
            selected &&
            (kind !== 'flight' ||
              tripType !== 'roundtrip' ||
              returnSelected))) && (
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
                  Review your selection and enter
                  passenger information.
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
                      onChange={(e) =>
                        setTravelClass(
                          e.target.value
                        )
                      }
                    >
                      {selected.classes.map(
                        (c) => (
                          <option key={c}>
                            {c}
                          </option>
                        )
                      )}
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
                        onChange={(e) =>
                          setReturnClass(
                            e.target.value
                          )
                        }
                      >
                        {returnSelected.classes.map(
                          (c) => (
                            <option key={c}>
                              {c}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  )}

                <label>
                  {cab
                    ? 'Pickup date & time'
                    : 'Departure date & time'}

                  <input
                    type="datetime-local"
                    value={date}
                    min={`${today()}T00:00`}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                  />
                </label>

                {kind === 'flight' &&
                  tripType === 'roundtrip' && (
                    <label>
                      Return date & time

                      <input
                        type="datetime-local"
                        min={date}
                        value={returnDate}
                        onChange={(e) =>
                          setReturnDate(
                            e.target.value
                          )
                        }
                      />
                    </label>
                  )}

                <h3>Passenger details</h3>

                {passengers.map((p, i) => (
                  <div
                    className="travel-person"
                    key={i}
                  >
                    <strong>
                      Traveller {i + 1}
                    </strong>

                    <div className="travel-person-grid">
                      <label>
                        Full name
                        <input
                          placeholder="Name as on ID"
                          value={p.name}
                          onChange={(e) =>
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
                          onChange={(e) =>
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
                          onChange={(e) =>
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
                      ).toFixed(1)} km · ${
                        quote.durationText
                      }`
                    : `${selected.provider.replace(
                        /\s+Demo\b/gi,
                        ''
                      )} · ${selected.number} · ${
                        travelClass
                      }`}
                </p>

                {kind === 'flight' &&
                  tripType === 'roundtrip' &&
                  returnSelected && (
                    <>
                      <p>
                        Return:{' '}
                        {returnSelected.fromCity} →{' '}
                        {returnSelected.toCity} ·{' '}
                        {returnSelected.provider.replace(
                          /\s+Demo\b/gi,
                          ''
                        )}{' '}
                        · {returnSelected.departure} ·{' '}
                        {returnClass}
                      </p>

                      <div className="travel-summary-line">
                        <span>Onward fare</span>
                        <strong>
                          {money(
                            selected.fare *
                              (selected.classes.indexOf(
                                travelClass
                              ) +
                                1) *
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
                              (returnSelected.classes.indexOf(
                                returnClass
                              ) +
                                1) *
                              100 *
                              passengers.length
                          )}
                        </strong>
                      </div>
                    </>
                  )}

                <div className="travel-summary-line">
                  <span>Travellers</span>
                  <strong>
                    {passengers.length}
                  </strong>
                </div>

                <div className="travel-summary-line">
                  <span>Travel date</span>
                  <strong>
                    {date
                      ? new Date(
                          date
                        ).toLocaleDateString(
                          'en-IN'
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
                          (selected.fare *
                            (selected.classes.indexOf(
                              travelClass
                            ) +
                              1) +
                            (kind === 'flight' &&
                            tripType === 'roundtrip' &&
                            returnSelected
                              ? returnSelected.fare *
                                (returnSelected.classes.indexOf(
                                  returnClass
                                ) +
                                  1)
                              : 0)) *
                            100 *
                            passengers.length
                        )}
                  </strong>
                </div>

                <p className="travel-disclosure">
                  This is a simulated travel booking for
                  demonstration purposes. Payments are
                  processed in Razorpay Test Mode. No real
                  travel ticket or reservation will be issued.
                </p>

                <button
                  className="travel-primary travel-pay"
                  onClick={book}
                  disabled={
                    busy ||
                    !date ||
                    passengers.some(
                      (p) =>
                        !p.name.trim() ||
                        Number(p.age) < 1
                    )
                  }
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

function GooglePlace({ label, onPick }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [chosen, setChosen] = useState(false);

  const key =
    import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY;

  useEffect(() => {
    if (
      !key ||
      chosen ||
      query.trim().length < 3
    ) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setBusy(true);

        const response = await fetch(
          'https://places.googleapis.com/v1/places:autocomplete',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': key,
            },
            body: JSON.stringify({
              input: query,
            }),
          }
        );

        const data = await response.json();

        if (!cancelled) {
          setSuggestions(
            data.suggestions || []
          );
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, chosen, key]);

  return (
    <div className="travel-place">
      <label>
        {label}

        <input
          autoComplete="off"
          placeholder={
            key
              ? 'Search city, airport or address'
              : 'Configure Google Maps browser key'
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setChosen(false);
            onPick(null);
          }}
        />
      </label>

      {busy && (
        <small className="travel-place-hint">
          Searching locations...
        </small>
      )}

      {!key && (
        <small className="travel-place-hint">
          Set VITE_GOOGLE_MAPS_BROWSER_KEY
          in frontend .env
        </small>
      )}

      {suggestions.length > 0 && (
        <div className="travel-suggestions">
          {suggestions.map(
            (item, index) => {
              const place =
                item.placePrediction;

              if (!place) return null;

              return (
                <button
                  type="button"
                  key={
                    place.placeId || index
                  }
                  onClick={() => {
                    const address =
                      place.text?.text ||
                      query;

                    setQuery(address);
                    setChosen(true);
                    setSuggestions([]);
                    onPick({
                      placeId:
                        place.placeId,
                      address,
                    });
                  }}
                >
                  📍 {place.text?.text}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
