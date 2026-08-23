import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import "../styles/Hotels.css";

function Hotels() {
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Hotel data
  const [hotels, setHotels] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // Fetch hotel data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Start loading
        setLoading(true);

        // Fetch data from public/hotels.json
        const response = await fetch("/hotels.json");

        // Check response
        if (!response.ok) {
          throw new Error("Failed to fetch hotel data");
        }

        // Convert response into JSON
        const data = await response.json();

        // Store hotel data
        setHotels(data);

      } catch (err) {
        console.error("Error loading hotels:", err);

        setError(
          "Unable to load hotels. Please try again."
        );

      } finally {
        // Stop loading immediately
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <section className="hotels-page">

        <div className="hotels-header">
          <h1>Find Your Perfect Stay</h1>

          <p>
            Loading hotels...
          </p>
        </div>

      </section>
    );
  }

  // Error screen
  if (error) {
    return (
      <section className="hotels-page">

        <div className="hotels-header">
          <h1>Find Your Perfect Stay</h1>

          <p>
            {error}
          </p>
        </div>

      </section>
    );
  }

  return (
    <section className="hotels-page">

      {/* =========================
          HEADER
      ========================== */}

      <div className="hotels-header">

        <h1>
          Find Your Perfect Stay
        </h1>

        <p>
          Discover comfortable hotels and luxury resorts
          for your unforgettable journey.
        </p>

      </div>


      {/* =========================
          HOTEL GRID
      ========================== */}

      <div className="hotels-grid">

        {hotels.map((hotel) => (

          <div
            className="hotel-card"
            key={hotel.id}
          >

            {/* =========================
                HOTEL IMAGE
            ========================== */}

            <div className="hotel-image-container">

              <img
                src={hotel.image}
                alt={hotel.name}
                className="hotel-image"
                loading="lazy"
              />


              {/* =========================
                  WISHLIST BUTTON
              ========================== */}

              <button
                className={`wishlist-button ${
                  isInWishlist(hotel.id)
                    ? "wishlist-active"
                    : ""
                }`}
                onClick={() => toggleWishlist(hotel)}
                aria-label={
                  isInWishlist(hotel.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >

                {isInWishlist(hotel.id)
                  ? "❤️"
                  : "♡"}

              </button>

            </div>


            {/* =========================
                HOTEL DETAILS
            ========================== */}

            <div className="hotel-content">

              <h2>
                {hotel.name}
              </h2>


              <p className="hotel-location">
                📍 {hotel.location}
              </p>


              <p className="hotel-rating">
                ⭐ {hotel.rating}
              </p>


              <p>
                🛏️ {hotel.room}
              </p>


              <p>
                🕐 Check-in:{" "}
                {hotel.checkIn}
              </p>


              <p>
                🕐 Check-out:{" "}
                {hotel.checkOut}
              </p>


              <p>
                🌙 {hotel.nights}
              </p>


              {/* =========================
                  PRICE
              ========================== */}

              <h3 className="hotel-price">

                {hotel.price}

                <span>
                  {" "}
                  / night
                </span>

              </h3>


              {/* =========================
                  VIEW HOTEL
              ========================== */}

              <Link
                to={`/hotels/${hotel.id}`}
                className="view-hotel-button"
              >
                View Hotel
              </Link>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Hotels;