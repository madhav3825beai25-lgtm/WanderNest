import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Booking.css";

function Booking() {
  const [searchParams] = useSearchParams();

  const selectedDestination = searchParams.get("destination") || "";
  const selectedPackage = searchParams.get("package") || "";

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    destination: selectedDestination,
    packageName: selectedPackage,
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) {
      return 0;
    }

    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);

    const difference =
      checkOutDate.getTime() - checkInDate.getTime();

    const nights = difference / (1000 * 60 * 60 * 24);

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!booking.destination) {
      setMessage("Please select a destination.");
      return;
    }

    if (nights <= 0) {
      setMessage(
        "Please select a valid check-in and check-out date."
      );
      return;
    }

    setMessage(
      `🎉 Booking confirmed! ${booking.name}, your trip to ${booking.destination} has been booked successfully for ${nights} nights.`
    );
  };

  return (
    <section className="booking-page">
      <div className="booking-header">
        <h1>Book Your Trip</h1>
        <p>
          Plan your perfect journey with WanderNest and make
          unforgettable memories.
        </p>
      </div>

      <div className="booking-container">
        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >
          <h2>Booking Details</h2>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={booking.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={booking.email}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={booking.phone}
            onChange={handleChange}
            required
          />

          <label>Destination</label>

          <select
            name="destination"
            value={booking.destination}
            onChange={handleChange}
            required
          >
            <option value="">Select destination</option>

            <option value="Paris, France">
              Paris, France
            </option>

            <option value="Bali, Indonesia">
              Bali, Indonesia
            </option>

            <option value="Dubai, UAE">
              Dubai, UAE
            </option>

            <option value="Switzerland">
              Switzerland
            </option>

            <option value="Maldives">
              Maldives
            </option>

            <option value="Tokyo, Japan">
              Tokyo, Japan
            </option>

            <option value="London, UK">
              London, UK
            </option>

            <option value="New York, USA">
              New York, USA
            </option>

            <option value="Santorini, Greece">
              Santorini, Greece
            </option>

            <option value="Singapore">
              Singapore
            </option>

            <option value="Rajasthan, India">
              Rajasthan, India
            </option>

            <option value="Kashmir, India">
              Kashmir, India
            </option>

            <option value="Goa, India">
              Goa, India
            </option>

            <option value="Kerala, India">
              Kerala, India
            </option>
          </select>

          {booking.packageName && (
            <>
              <label>Selected Package</label>

              <input
                type="text"
                value={booking.packageName}
                readOnly
              />
            </>
          )}

          <div className="date-row">
            <div>
              <label>Check-in Date</label>

              <input
                type="date"
                name="checkIn"
                value={booking.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Check-out Date</label>

              <input
                type="date"
                name="checkOut"
                value={booking.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Number of Guests</label>

          <select
            name="guests"
            value={booking.guests}
            onChange={handleChange}
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5 Guests</option>
            <option value="6">6 Guests</option>
            <option value="7">7 Guests</option>
            <option value="8">8 Guests</option>
          </select>

          {nights > 0 && (
            <div className="booking-summary">
              <h3>Trip Summary</h3>

              <p>
                <strong>Destination:</strong>{" "}
                {booking.destination}
              </p>

              {booking.packageName && (
                <p>
                  <strong>Package:</strong>{" "}
                  {booking.packageName}
                </p>
              )}

              <p>
                <strong>Check-in:</strong>{" "}
                {booking.checkIn}
              </p>

              <p>
                <strong>Check-out:</strong>{" "}
                {booking.checkOut}
              </p>

              <p>
                <strong>Number of nights:</strong>{" "}
                {nights}
              </p>

              <p>
                <strong>Guests:</strong>{" "}
                {booking.guests}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="booking-button"
          >
            Confirm Booking
          </button>

          {message && (
            <div className="booking-message">
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Booking;