
import { useNavigate, useParams, Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import hotels, { formatHotelPrice } from "../data/hotels";
import "../styles/HotelDetails.css";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const hotel = hotels.find((item) => item.id === Number(id));

  if (!hotel) {
    return (
      <section className="hotel-not-found">
        <h1>Hotel Not Found</h1>
        <p>Sorry, this hotel could not be found.</p>

        <button
          type="button"
          onClick={() => navigate("/hotels")}
          className="back-hotel-button"
        >
          ← Back to Hotels
        </button>
      </section>
    );
  }

  const saved = isInWishlist(hotel.id);

  const handleBooking = () => {
    navigate("/booking", {
      state: {
        bookingType: "hotel",
        destination: hotel.location,
        hotel: hotel.name,
        hotelId: hotel.id,
        price: hotel.price,
        room: hotel.room,
      },
    });
  };

  const handleWishlist = () => {
    toggleWishlist(hotel);
  };

  return (
    <section className="hotel-details-page">
      <Link to="/hotels" className="back-hotel-link">
        ← Back to Hotels
      </Link>

      <div className="hotel-details-hero">
        <img src={hotel.image} alt={hotel.name} />

        <div className="hotel-hero-overlay">
          <span className="hotel-tag">WanderNest Stays</span>
          <h1>{hotel.name}</h1>
          <p>📍 {hotel.location}</p>
          <div className="hero-rating">
            ★ {hotel.rating.toFixed(1)} / 5
          </div>
        </div>

        <button
          type="button"
          className={`details-wishlist-button ${
            saved ? "details-wishlist-active" : ""
          }`}
          onClick={handleWishlist}
          aria-pressed={saved}
        >
          {saved ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
        </button>
      </div>

      <div className="hotel-details-container">
        <div className="hotel-main-content">
          <section className="hotel-intro">
            <h2>About {hotel.name}</h2>
            <p>{hotel.description}</p>
          </section>

          <section className="hotel-section">
            <h2>🛏️ Rooms & Accommodation</h2>
            <p className="section-description">
              Explore the available room style and property facilities.
            </p>

            <div className="room-gallery">
              <div className="room-image-card">
                <img src={hotel.roomImage} alt={hotel.room} />
                <div className="room-image-label">{hotel.room}</div>
              </div>

              <div className="room-image-card">
                <img
                  src={hotel.secondRoomImage}
                  alt={`${hotel.name} accommodation`}
                  loading="lazy"
                />
                <div className="room-image-label">
                  Accommodation
                </div>
              </div>

              <div className="room-image-card">
                <img
                  src={hotel.poolImage}
                  alt={`${hotel.name} facilities`}
                  loading="lazy"
                />
                <div className="room-image-label">
                  Property facilities
                </div>
              </div>
            </div>
          </section>

          <section className="room-information">
            <h2>Room Information</h2>

            <div className="room-info-grid">
              <div>
                <strong>🛏️ Room Type</strong>
                <span>{hotel.room}</span>
              </div>

              <div>
                <strong>🌙 Example Stay</strong>
                <span>{hotel.nights}</span>
              </div>

              <div>
                <strong>🕐 Check-in</strong>
                <span>{hotel.checkIn}</span>
              </div>

              <div>
                <strong>🕐 Check-out</strong>
                <span>{hotel.checkOut}</span>
              </div>
            </div>
          </section>

          <section className="hotel-section">
            <h2>✨ Amenities</h2>

            <div className="amenities-grid">
              {hotel.amenities.map((amenity) => (
                <div className="amenity-item" key={amenity}>
                  <span>✓</span>
                  {amenity}
                </div>
              ))}
            </div>
          </section>

          <section className="hotel-section">
            <h2>⭐ Property Highlights</h2>

            <div className="highlights-list">
              {hotel.highlights.map((highlight) => (
                <div className="highlight-item" key={highlight}>
                  <span>✓</span>
                  {highlight}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="hotel-booking-card">
          <h2>Your Stay</h2>

          <div className="booking-rating">
            ★ {hotel.rating.toFixed(1)} guest rating
          </div>

          <div className="booking-location">
            📍 {hotel.location}
          </div>

          <div className="booking-divider" />

          <div className="booking-detail">
            <span>Room</span>
            <strong>{hotel.room}</strong>
          </div>

          <div className="booking-detail">
            <span>Example stay</span>
            <strong>{hotel.nights}</strong>
          </div>

          <div className="booking-detail">
            <span>Check-in</span>
            <strong>{hotel.checkIn}</strong>
          </div>

          <div className="booking-detail">
            <span>Check-out</span>
            <strong>{hotel.checkOut}</strong>
          </div>

          <div className="booking-divider" />

          <div className="booking-price">
            <span>Displayed price</span>
            <strong>
              {formatHotelPrice(hotel.price)}
              <small> / room / night</small>
            </strong>
          </div>

          <p className="hotel-price-disclaimer">
            Final availability and price must be verified when booking.
          </p>

          <button
            type="button"
            className="book-hotel-button"
            onClick={handleBooking}
          >
            Continue to Booking →
          </button>

          <button
            type="button"
            className="details-card-wishlist"
            onClick={handleWishlist}
          >
            {saved ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
          </button>
        </aside>
      </div>
    </section>
  );
}

export default HotelDetails;
