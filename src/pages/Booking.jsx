import { useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import destinations from "../data/destinations";
import {
  getHotelsByDestination,
  formatHotelPrice,
} from "../data/hotels";

import "../styles/Booking.css";

function getAmount(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const amount = Number(
    String(value || "").replace(/[^0-9.]/g, "")
  );

  return Number.isFinite(amount) ? amount : 0;
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[,.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findDestination(value) {
  const search = normalize(value);

  if (!search) return null;

  const exact = destinations.find((destination) => {
    const name = normalize(destination.name);
    const country = normalize(destination.country);
    const fullName = normalize(
      `${destination.name}, ${destination.country}`
    );

    return (
      search === name ||
      search === fullName ||
      search === country
    );
  });

  if (exact) return exact;

  return (
    destinations.find((destination) => {
      const name = normalize(destination.name);
      return search.startsWith(`${name} `);
    }) || null
  );
}

function getBookingDestination(booking, trustedPackage) {
  const matched = findDestination(booking.destination);

  if (matched) return matched;

  // A package destination may not exist in destinations.js.
  // Only allow this fallback for a package selected from the site.
  if (
    booking.bookingType === "package" &&
    trustedPackage &&
    booking.packageName === trustedPackage.packageName &&
    booking.destination === trustedPackage.destination
  ) {
    return {
      id: null,
      name: booking.destination,
      country: "",
      price: 0,
    };
  }

  return null;
}

function createReference() {
  return `WN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.querySelector('script[data-razorpay-checkout="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Razorpay Checkout.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

async function readApiResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }
  return data;
}

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selected = location.state || {};

  const initialDestination =
    selected.destination ||
    searchParams.get("destination") ||
    "";

  const initialPackage =
    selected.packageName ||
    searchParams.get("package") ||
    "";

  const initialHotel =
    selected.hotel ||
    searchParams.get("hotel") ||
    "";

  const initialPrice =
    selected.price ??
    searchParams.get("price") ??
    0;

  const initialType =
    selected.bookingType ||
    searchParams.get("type") ||
    (initialHotel
      ? "hotel"
      : initialPackage
        ? "package"
        : "trip");

  const trustedPackage =
    selected.bookingType === "package" &&
    selected.packageName &&
    selected.destination
      ? {
          packageName: selected.packageName,
          destination: selected.destination,
          image: selected.image || "",
        }
      : null;

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    destination: initialDestination,
    bookingType: initialType,
    packageName: initialPackage,
    hotel: initialHotel,
    hotelId:
      selected.hotelId ||
      searchParams.get("hotelId") ||
      "",
    duration:
      selected.duration ||
      searchParams.get("duration") ||
      "",
    checkIn: "",
    checkOut: "",
    rooms: "1",
    adults: "2",
    children: "0",
    payment: "UPI",
    coupon: "",
  });

  const [routePrice, setRoutePrice] = useState(
    () => getAmount(initialPrice)
  );

  const [message, setMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const selectedDestination = useMemo(
    () => getBookingDestination(booking, trustedPackage),
    [
      booking.destination,
      booking.bookingType,
      booking.packageName,
    ]
  );

  const destinationHotels = useMemo(() => {
    if (!selectedDestination?.id) return [];

    return getHotelsByDestination(selectedDestination.id);
  }, [selectedDestination]);

  const selectedHotel = useMemo(() => {
    if (booking.hotelId) {
      const matched = destinationHotels.find(
        (hotel) =>
          String(hotel.id) === String(booking.hotelId)
      );

      if (matched) return matched;
    }

    if (booking.hotel) {
      return (
        destinationHotels.find(
          (hotel) =>
            normalize(hotel.name) ===
            normalize(booking.hotel)
        ) || null
      );
    }

    return null;
  }, [booking.hotel, booking.hotelId, destinationHotels]);

  const basePrice = useMemo(() => {
    if (booking.bookingType === "hotel") {
      return getAmount(selectedHotel?.price) || routePrice;
    }

    if (routePrice > 0) return routePrice;

    return getAmount(selectedDestination?.price);
  }, [
    booking.bookingType,
    selectedHotel,
    routePrice,
    selectedDestination,
  ]);

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;

    const start = new Date(`${booking.checkIn}T00:00:00`);
    const end = new Date(`${booking.checkOut}T00:00:00`);

    return Math.round(
      (end.getTime() - start.getTime()) / 86400000
    );
  }, [booking.checkIn, booking.checkOut]);

  const rooms = Number(booking.rooms);
  const adults = Number(booking.adults);
  const children = Number(booking.children);
  const travellers = adults + children;

  const subtotal = useMemo(() => {
    if (basePrice <= 0) return 0;

    if (booking.bookingType === "hotel") {
      return basePrice * rooms * Math.max(nights, 1);
    }

    return basePrice * Math.max(travellers, 1);
  }, [
    basePrice,
    booking.bookingType,
    rooms,
    nights,
    travellers,
  ]);

  const discount =
    couponApplied &&
    booking.coupon.trim().toUpperCase() === "WELCOME10"
      ? Math.round(subtotal * 0.1)
      : 0;

  const taxes = Math.round((subtotal - discount) * 0.05);

  const total = Math.max(
    0,
    subtotal - discount + taxes
  );

  const packageImage =
    booking.bookingType === "package" &&
    trustedPackage &&
    booking.packageName === trustedPackage.packageName &&
    booking.destination === trustedPackage.destination
      ? trustedPackage.image
      : "";

  const summaryImage =
    booking.bookingType === "hotel"
      ? selectedHotel?.image || ""
      : packageImage;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMessage("");

    if (name === "coupon") {
      setCouponApplied(false);
    }

    if (name === "destination") {
      const matched = findDestination(value);

      const firstHotel =
        booking.bookingType === "hotel" && matched
          ? getHotelsByDestination(matched.id)[0]
          : null;

      setRoutePrice(0);

      setBooking((previous) => ({
        ...previous,
        destination: value,
        hotel: firstHotel?.name || "",
        hotelId: firstHotel?.id || "",
        packageName: "",
        duration: matched?.duration || "",
      }));

      return;
    }

    if (name === "bookingType") {
      const matched = findDestination(booking.destination);

      const firstHotel =
        value === "hotel" && matched
          ? getHotelsByDestination(matched.id)[0]
          : null;

      setRoutePrice(0);

      setBooking((previous) => ({
        ...previous,
        bookingType: value,
        hotel: firstHotel?.name || "",
        hotelId: firstHotel?.id || "",
        packageName:
          value === "package" ? previous.packageName : "",
        duration: matched?.duration || previous.duration,
      }));

      return;
    }

    if (name === "hotelId") {
      const hotel = destinationHotels.find(
        (item) => String(item.id) === value
      );

      setRoutePrice(0);

      setBooking((previous) => ({
        ...previous,
        hotelId: hotel ? String(hotel.id) : "",
        hotel: hotel?.name || "",
      }));

      return;
    }

    setBooking((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "hotel" || name === "packageName") {
      setRoutePrice(0);
    }
  };

  const applyCoupon = () => {
    if (
      booking.coupon.trim().toUpperCase() === "WELCOME10"
    ) {
      setCouponApplied(true);
      setMessage(
        "Coupon applied successfully! You saved 10%."
      );
    } else {
      setCouponApplied(false);
      setMessage("Invalid coupon. Try WELCOME10.");
    }
  };

  const payOnline = async (savedBooking, token) => {
    if (!savedBooking?._id) {
      setPaymentMessage("Booking ID missing. Please check My Bookings.");
      return;
    }
    if (paymentBusy) return;
    setPaymentBusy(true);
    setPaymentMessage("");
    try {
      await loadRazorpayCheckout();
      const orderResponse = await fetch(
        `${API_BASE}/api/payments/${savedBooking._id}/order`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { keyId, order } = await readApiResponse(orderResponse);
      if (!keyId || !order?.id || !Number.isSafeInteger(order.amount)) {
        throw new Error("Invalid Razorpay order response.");
      }
      if (order.amount !== savedBooking.verifiedAmountPaise) {
        throw new Error("Payment amount mismatch. Please contact support.");
      }
      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "WanderNest",
        description: `Booking ${savedBooking.reference}`,
        prefill: {
          name: savedBooking.name,
          email: savedBooking.email,
          contact: savedBooking.phone,
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: () => {
            setPaymentBusy(false);
            setPaymentMessage("Payment window closed. Your booking is still pending. You can retry payment.");
          },
        },
        handler: async (result) => {
          try {
            setPaymentMessage("Verifying payment with the server...");
            const verifyResponse = await fetch(
              `${API_BASE}/api/payments/${savedBooking._id}/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(result),
              }
            );
            const verified = await readApiResponse(verifyResponse);
            setConfirmedBooking((previous) => ({
              ...previous,
              ...verified.booking,
            }));
            setPaymentMessage("Payment verified successfully!");
          } catch (error) {
            setPaymentMessage(
              `Payment verification pending: ${error.message} Check My Bookings before trying again.`
            );
          } finally {
            setPaymentBusy(false);
          }
        },
      });
      checkout.on("payment.failed", (result) => {
        setPaymentBusy(false);
        setPaymentMessage(result.error?.description || "Payment failed. You can retry.");
      });
      checkout.open();
    } catch (error) {
      setPaymentBusy(false);
      setPaymentMessage(error.message || "Unable to open Razorpay Checkout.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (isSubmitting) return;

    if (!booking.name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!booking.email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (booking.phone.replace(/\D/g, "").length < 10) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    if (!selectedDestination) {
      setMessage(
        "Please select a valid destination from the suggestions."
      );
      return;
    }

    if (
      booking.bookingType === "hotel" &&
      !selectedHotel
    ) {
      setMessage(
        "Please select a hotel for your destination."
      );
      return;
    }

    if (
      booking.bookingType === "package" &&
      !booking.packageName.trim()
    ) {
      setMessage("Please select a travel package.");
      return;
    }

    if (
      !booking.checkIn ||
      !booking.checkOut ||
      nights <= 0
    ) {
      setMessage(
        "Please select valid check-in and check-out dates."
      );
      return;
    }

    if (basePrice <= 0) {
      setMessage(
        "The price is unavailable for this selection."
      );
      return;
    }

    const token = sessionStorage.getItem(
      "wandernest_token"
    );

    if (!token) {
      navigate("/login", {
        state: {
          message:
            "Please log in before creating a booking.",
        },
      });

      return;
    }

    const payload = {
      name: booking.name.trim(),
      email: booking.email.trim(),
      phone: booking.phone.trim(),
      destination: selectedDestination.name,
      bookingType: booking.bookingType,
      packageName: booking.packageName,
      hotel: selectedHotel?.name || booking.hotel,
      hotelId: selectedHotel
        ? String(selectedHotel.id)
        : "",
      duration: booking.duration,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      rooms,
      adults,
      children,
      payment: booking.payment,
      coupon: couponApplied
        ? booking.coupon.trim().toUpperCase()
        : "",
      reference: createReference(),
      nights,
      subtotal,
      discount,
      taxes,
      total,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          sessionStorage.removeItem(
            "wandernest_token"
          );

          navigate("/login", {
            state: {
              message:
                "Your session has expired. Please log in again.",
            },
          });

          return;
        }

        setMessage(
          data.message ||
            "Unable to save your booking. Please try again."
        );

        return;
      }

      const savedBooking = data.booking || {};

      setConfirmedBooking({
        ...payload,
        ...savedBooking,
        destination:
          savedBooking.destination || payload.destination,
        hotel: savedBooking.hotel || payload.hotel,
        confirmedAt:
          savedBooking.createdAt ||
          new Date().toISOString(),
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      if (savedBooking.payment !== "Cash on Arrival") {
        await payOnline(savedBooking, token);
      }
    } catch (error) {
      console.error(
        "Booking request failed:",
        error
      );

      setMessage(
        "Cannot connect to the booking server. Please check that the backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    const confirmation = confirmedBooking;

    return (
      <section className="booking-page confirmation-page">
        <div className="confirmation-card">
          <div
            className="success-icon"
            aria-label={confirmation.paymentStatus === "paid" ? "Confirmed" : "Pending"}
          >
            {confirmation.paymentStatus === "paid" ? "✓" : "⌛"}
          </div>

          <p className="brand-label">WANDERNEST</p>

          <h1>
            {confirmation.paymentStatus === "paid"
              ? "Booking Confirmed"
              : "Booking Saved — Payment Pending"}
          </h1>

          <p className="confirmation-greeting">
            Thank you, {confirmation.name}. Here is your
            trip summary.
          </p>

          <div className="reference-box">
            <span>Reference</span>
            <strong>
              {confirmation.reference}
            </strong>
          </div>

          <div className="trip-summary">
            <h2>Your trip summary</h2>

            <div className="summary-row">
              <span>Destination</span>
              <strong>
                {confirmation.destination}
              </strong>
            </div>

            {confirmation.bookingType === "hotel" &&
              confirmation.hotel && (
                <div className="summary-row">
                  <span>Hotel</span>
                  <strong>
                    {confirmation.hotel}
                  </strong>
                </div>
              )}

            {confirmation.packageName && (
              <div className="summary-row">
                <span>Package</span>
                <strong>
                  {confirmation.packageName}
                </strong>
              </div>
            )}

            <div className="summary-row">
              <span>Check-in</span>
              <strong>
                {String(confirmation.checkIn).slice(
                  0,
                  10
                )}
              </strong>
            </div>

            <div className="summary-row">
              <span>Check-out</span>
              <strong>
                {String(confirmation.checkOut).slice(
                  0,
                  10
                )}
              </strong>
            </div>

            <div className="summary-row">
              <span>Duration</span>
              <strong>
                {confirmation.nights} night
                {Number(confirmation.nights) === 1
                  ? ""
                  : "s"}
              </strong>
            </div>

            {confirmation.bookingType === "hotel" && (
              <div className="summary-row">
                <span>Rooms</span>
                <strong>
                  {confirmation.rooms}
                </strong>
              </div>
            )}

            <div className="summary-row">
              <span>Travellers</span>
              <strong>
                {confirmation.adults} adult
                {Number(confirmation.adults) === 1
                  ? ""
                  : "s"}
                {Number(confirmation.children) > 0
                  ? `, ${confirmation.children} child${
                      Number(confirmation.children) === 1
                        ? ""
                        : "ren"
                    }`
                  : ""}
              </strong>
            </div>

            {Number(confirmation.discount) > 0 && (
              <div className="summary-row">
                <span>Coupon discount</span>
                <strong>
                  -
                  {formatPrice(
                    confirmation.discount
                  )}
                </strong>
              </div>
            )}

            <div className="summary-row">
              <span>Taxes and fees</span>
              <strong>
                {formatPrice(confirmation.taxes)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Total</span>
              <strong>
                {formatPrice(confirmation.total)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Payment preference</span>
              <strong>
                {confirmation.payment}
              </strong>
            </div>

            <div className="summary-row">
              <span>Booking status</span>
              <strong>
                {confirmation.status || "pending"}
              </strong>
            </div>
          </div>

          <div className="summary-row">
            <span>Payment status</span>
            <strong>{confirmation.paymentStatus || "unpaid"}</strong>
          </div>

          <p className="confirmation-note">
            {confirmation.paymentStatus === "paid"
              ? "Payment verified. Keep your booking reference for future enquiries."
              : confirmation.payment === "Cash on Arrival"
                ? "Cash on Arrival selected. Payment has not been collected; your booking remains pending."
                : "Booking saved, but payment is not confirmed. Please complete or retry payment."}
          </p>

          {paymentMessage && (
            <p className="booking-message" role="status">{paymentMessage}</p>
          )}

          {confirmation.payment !== "Cash on Arrival" &&
            confirmation.paymentStatus !== "paid" &&
            confirmation.status !== "cancelled" && (
              <button
                type="button"
                className="primary-button"
                disabled={paymentBusy}
                onClick={() => {
                  const token = sessionStorage.getItem("wandernest_token");
                  if (!token) {
                    navigate("/login");
                    return;
                  }
                  payOnline(confirmation, token);
                }}
              >
                {paymentBusy
                  ? "Processing Payment..."
                  : `Pay Now · ${formatPrice(confirmation.total)}`}
              </button>
            )}

          <div className="confirmation-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/destinations")
              }
            >
              Explore More
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => window.print()}
            >
              Print Summary
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <header className="booking-header">
        <p className="brand-label">
          WANDERNEST
        </p>

        <h1>Complete Your Booking</h1>

        <p>
          Plan your next journey with comfort,
          confidence and ease.
        </p>
      </header>

      <div className="booking-layout">
        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >
          <h2>Traveller Details</h2>

          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            value={booking.name}
            onChange={handleChange}
            required
          />

          <div className="form-grid">
            <div>
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={booking.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="10-digit phone number"
                autoComplete="tel"
                value={booking.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h2 className="form-section-title">
            Your Journey
          </h2>

          <label htmlFor="bookingType">
            Booking Type
          </label>

          <select
            id="bookingType"
            name="bookingType"
            value={booking.bookingType}
            onChange={handleChange}
          >
            <option value="trip">
              Destination Trip
            </option>

            <option value="package">
              Holiday Package
            </option>

            <option value="hotel">
              Hotel Stay
            </option>
          </select>

          <label htmlFor="destination">
            Destination
          </label>

          <input
            id="destination"
            name="destination"
            type="text"
            list="destination-options"
            placeholder="Type a destination"
            value={booking.destination}
            onChange={handleChange}
            autoComplete="off"
            required
          />

          <datalist id="destination-options">
            {destinations.map((destination) => (
              <option
                key={destination.id}
                value={destination.name}
              >
                {destination.country}
              </option>
            ))}
          </datalist>

          {selectedDestination ? (
            <p className="booking-lookup-status booking-lookup-success">
              ✓ Destination found:{" "}
              {selectedDestination.name}
              {selectedDestination.country
                ? `, ${selectedDestination.country}`
                : ""}
            </p>
          ) : (
            <p className="booking-lookup-status">
              Select a destination from the
              suggestions to load its price.
            </p>
          )}

          {booking.bookingType === "hotel" && (
            <>
              <label htmlFor="hotelId">
                Select Hotel
              </label>

              <select
                id="hotelId"
                name="hotelId"
                value={
                  selectedHotel
                    ? String(selectedHotel.id)
                    : ""
                }
                onChange={handleChange}
                disabled={
                  !selectedDestination ||
                  destinationHotels.length === 0
                }
              >
                <option value="">
                  {!selectedDestination
                    ? "Select a destination first"
                    : "Choose a hotel"}
                </option>

                {destinationHotels.map((hotel) => (
                  <option
                    key={hotel.id}
                    value={hotel.id}
                  >
                    {hotel.name} —{" "}
                    {formatHotelPrice(hotel.price)}{" "}
                    / night
                  </option>
                ))}
              </select>

              {selectedHotel && (
                <div className="selected-hotel-panel">
                  <img
                    src={selectedHotel.image}
                    alt={selectedHotel.name}
                  />

                  <div>
                    <strong>
                      {selectedHotel.name}
                    </strong>

                    <p>{selectedHotel.room}</p>

                    <span>
                      ⭐{" "}
                      {Number(
                        selectedHotel.rating || 0
                      ).toFixed(1)}{" "}
                      ·{" "}
                      {formatHotelPrice(
                        selectedHotel.price
                      )}{" "}
                      / night
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {booking.bookingType === "package" && (
            <>
              <label htmlFor="packageName">
                Selected Package
              </label>

              <input
                id="packageName"
                name="packageName"
                type="text"
                placeholder="Enter package name"
                value={booking.packageName}
                onChange={handleChange}
              />
            </>
          )}

          {booking.duration && (
            <p className="duration-hint">
              <span>Trip duration:</span>{" "}
              {booking.duration}
            </p>
          )}

          <div className="form-grid">
            <div>
              <label htmlFor="checkIn">
                Check-in Date
              </label>

              <input
                id="checkIn"
                name="checkIn"
                type="date"
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                value={booking.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="checkOut">
                Check-out Date
              </label>

              <input
                id="checkOut"
                name="checkOut"
                type="date"
                min={
                  booking.checkIn ||
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                value={booking.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid three-columns">
            <div>
              <label htmlFor="rooms">
                Rooms
              </label>

              <select
                id="rooms"
                name="rooms"
                value={booking.rooms}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map(
                  (number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}{" "}
                      {number === 1
                        ? "Room"
                        : "Rooms"}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label htmlFor="adults">
                Adults
              </label>

              <select
                id="adults"
                name="adults"
                value={booking.adults}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                  (number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label htmlFor="children">
                Children
              </label>

              <select
                id="children"
                name="children"
                value={booking.children}
                onChange={handleChange}
              >
                {[0, 1, 2, 3, 4, 5, 6].map(
                  (number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <h2 className="form-section-title">
            Payment Preference
          </h2>

          <label htmlFor="payment">
            Choose Payment Method
          </label>

          <select
            id="payment"
            name="payment"
            value={booking.payment}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>

            <option value="Credit/Debit Card">
              Credit/Debit Card
            </option>

            <option value="Net Banking">
              Net Banking
            </option>

            <option value="Cash on Arrival">
              Cash on Arrival
            </option>
          </select>

          <div className="coupon-row">
            <div>
              <label htmlFor="coupon">
                Coupon Code
              </label>

              <input
                id="coupon"
                name="coupon"
                type="text"
                placeholder="Try WELCOME10"
                value={booking.coupon}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className="coupon-button"
              onClick={applyCoupon}
            >
              Apply
            </button>
          </div>

          {message && (
            <p
              className={
                couponApplied &&
                message.includes("successfully")
                  ? "booking-message success-message"
                  : "booking-message"
              }
              role="status"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-button submit-booking"
            disabled={
              basePrice <= 0 || isSubmitting
            }
          >
            {isSubmitting
              ? "Saving Booking..."
              : `Continue · ${formatPrice(total)}`}
          </button>

          <p className="secure-note">
            Final amount is verified by the server.
            Online payment opens securely in Razorpay Test Mode
            after your booking is saved.
          </p>
        </form>

        <aside className="price-card">
          <h2>Booking Summary</h2>

          <div className="selected-item">
            {summaryImage ? (
              <img
                src={summaryImage}
                alt={
                  booking.packageName ||
                  selectedHotel?.name ||
                  booking.destination
                }
                className="booking-package-image"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <span className="summary-icon">
                {booking.bookingType === "hotel"
                  ? "🏨"
                  : "✈️"}
              </span>
            )}

            <div>
              <strong>
                {selectedDestination?.name ||
                  booking.destination ||
                  "Your Destination"}
              </strong>

              <p>
                {booking.bookingType === "hotel"
                  ? selectedHotel?.name ||
                    "Select a hotel"
                  : booking.packageName ||
                    (selectedDestination
                      ? "Destination trip"
                      : "Select a destination")}
              </p>
            </div>
          </div>

          <div className="price-row">
            <span>
              {booking.bookingType === "hotel"
                ? "Price per room / night"
                : "Starting price per traveller"}
            </span>

            <strong>
              {basePrice > 0
                ? formatPrice(basePrice)
                : "Select destination"}
            </strong>
          </div>

          {booking.bookingType === "hotel" ? (
            <>
              <div className="price-row">
                <span>Rooms</span>
                <strong>{rooms}</strong>
              </div>

              <div className="price-row">
                <span>Nights</span>
                <strong>
                  {nights > 0
                    ? nights
                    : "Choose dates"}
                </strong>
              </div>
            </>
          ) : (
            <div className="price-row">
              <span>Travellers</span>
              <strong>{travellers}</strong>
            </div>
          )}

          <div className="price-row">
            <span>Subtotal</span>
            <strong>
              {formatPrice(subtotal)}
            </strong>
          </div>

          {discount > 0 && (
            <div className="price-row discount-row">
              <span>Discount</span>
              <strong>
                -{formatPrice(discount)}
              </strong>
            </div>
          )}

          <div className="price-row">
            <span>
              Taxes and fees (sample estimate)
            </span>

            <strong>
              {formatPrice(taxes)}
            </strong>
          </div>

          <div className="price-total">
            <span>Total Amount</span>

            <strong>
              {formatPrice(total)}
            </strong>
          </div>

          <ul className="booking-benefits">
            <li>
              ✓ Destination-based price lookup
            </li>

            <li>
              ✓ Hotel selection for your destination
            </li>

            <li>
              ✓ Automatic price calculation
            </li>
          </ul>

          <button
            type="button"
            className="secondary-button full-width"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Booking;