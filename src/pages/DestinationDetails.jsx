
import { Link, useNavigate, useParams } from "react-router-dom";
import destinations from "../data/destinations";
import {
  getHotelsByDestination,
  formatHotelPrice,
} from "../data/hotels";
import "../styles/DestinationDetails.css";

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const destination = destinations.find(
    (item) => item.id === Number(id)
  );

  if (!destination) {
    return (
      <section className="destination-details">
        <div className="destination-not-found">
          <h1>Destination Not Found</h1>
          <p>Sorry, this destination does not exist.</p>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/destinations")}
          >
            ← Back to Destinations
          </button>
        </div>
      </section>
    );
  }

  // Same shared hotel data is used on Hotels and HotelDetails pages.
  const hotels = getHotelsByDestination(destination.id);
  const places = destination.places || [];

  // Package booking
  const bookTrip = () => {
    navigate("/booking", {
      state: {
        bookingType: "trip",
        destination: destination.name,
        packageName: destination.packageName || "",
        price: destination.packagePrice || 0,
        duration: destination.duration || "",
      },
    });
  };

  // Hotel booking
  const bookHotel = (hotel) => {
    navigate("/booking", {
      state: {
        bookingType: "hotel",
        destination: destination.name,
        hotel: hotel.name,
        hotelId: hotel.id,
        price: hotel.price,
        room: hotel.room,
      },
    });
  };

  return (
    <section className="destination-details">
      {/* Back Button */}
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/destinations")}
      >
        ← Back to Destinations
      </button>

      {/* Destination Hero */}
      <div className="destination-hero">
        <img
          src={destination.image}
          alt={destination.name}
        />

        <div className="destination-hero-content">
          <span className="destination-tag">
            ✈️ Explore Destination
          </span>

          <h1>{destination.name}</h1>

          <p className="destination-country">
            📍 {destination.country}
          </p>

          <p className="destination-description">
            {destination.description}
          </p>
        </div>
      </div>

      {/* Destination Information */}
      <div className="destination-info">
        <div className="info-card">
          <h2>📅 Trip Information</h2>

          <div className="info-row">
            <strong>Duration</strong>
            <span>{destination.duration || "Flexible"}</span>
          </div>

          <div className="info-row">
            <strong>Package</strong>
            <span>
              {destination.packageName || "Custom Trip"}
            </span>
          </div>

          <div className="info-row">
            <strong>Package Price</strong>
            <span className="highlight-price">
              {destination.packagePrice || "Contact for price"}
            </span>
          </div>

          <div className="info-row">
            <strong>Hotels Available</strong>
            <span>{hotels.length} Hotels</span>
          </div>
        </div>

        {/* Places to Visit */}
        <div className="info-card">
          <h2>📍 Places to Visit</h2>

          {places.length > 0 ? (
            <ul className="places-list">
              {places.map((place, index) => (
                <li key={`${place}-${index}`}>
                  📌 {place}
                </li>
              ))}
            </ul>
          ) : (
            <p>Places to visit will be updated soon.</p>
          )}
        </div>
      </div>

      {/* Available Hotels */}
      <div className="hotels-section">
        <div className="section-heading">
          <div>
            <h2>🏨 Hotels in {destination.name}</h2>
            <p>
              Explore {hotels.length} accommodation options
              for your stay in {destination.name}.
            </p>
          </div>
        </div>

        {hotels.length > 0 ? (
          <div className="hotel-list">
            {hotels.map((hotel) => (
              <article
                className="hotel-item"
                key={hotel.id}
              >
                <div className="hotel-top">
                  <h3>{hotel.name}</h3>

                  <span className="hotel-rating">
                    ⭐ {Number(hotel.rating).toFixed(1)}
                  </span>
                </div>

                <p>
                  📍 <strong>Location:</strong>{" "}
                  {hotel.location}
                </p>

                <p>
                  🛏️ <strong>Room:</strong>{" "}
                  {hotel.room}
                </p>

                <p>
                  🕑 <strong>Check-in:</strong>{" "}
                  {hotel.checkIn}
                </p>

                <p>
                  🕛 <strong>Check-out:</strong>{" "}
                  {hotel.checkOut}
                </p>

                <p>
                  🌙 <strong>Stay:</strong>{" "}
                  {hotel.nights || destination.duration || "Flexible"}
                </p>

                <div className="hotel-price">
                  {formatHotelPrice(hotel.price)}
                  <span> / room / night</span>
                </div>

                <div className="destination-hotel-actions">
                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="hotel-button destination-view-hotel"
                  >
                    View Hotel →
                  </Link>

                  <button
                    type="button"
                    className="hotel-button"
                    onClick={() => bookHotel(hotel)}
                  >
                    Book This Hotel →
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-hotels">
            <h3>No hotels available</h3>
            <p>
              We currently have no hotel listings for this destination.
            </p>

            <Link to="/hotels" className="hotel-button">
              Explore All Hotels
            </Link>
          </div>
        )}
      </div>

      {/* Package Details */}
      <div className="package-card">
        <div className="package-icon">🎒</div>

        <div className="package-content">
          <h2>
            {destination.packageName || "Custom Travel Package"}
          </h2>

          <p className="package-duration">
            📅 {destination.duration || "Flexible duration"}
          </p>

          <p>
            Enjoy a travel experience including accommodation,
            sightseeing and memorable experiences in{" "}
            {destination.name}.
          </p>

          <p className="package-price">
            {destination.packagePrice || "Contact for price"}
          </p>

          <button
            type="button"
            className="book-trip-button"
            onClick={bookTrip}
          >
            Book This Package →
          </button>
        </div>
      </div>

      {/* Final Booking Section */}
      <div className="booking-section">
        <h2>Ready to Explore {destination.name}?</h2>

        <p>
          Plan your next adventure with WanderNest and
          discover memorable places around the world.
        </p>

        <button
          type="button"
          className="book-trip-button"
          onClick={bookTrip}
        >
          Book This Trip →
        </button>
      </div>
    </section>
  );
}

export default DestinationDetails;
