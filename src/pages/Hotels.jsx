import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import "../styles/Hotels.css";

function Hotels() {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch hotel data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);

        const response = await fetch("/hotels.json");

        if (!response.ok) {
          throw new Error("Failed to fetch hotel data");
        }

        const data = await response.json();

        setHotels(data);
      } catch (err) {
        console.error("Error loading hotels:", err);

        setError(
          "Unable to load hotels. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Search hotels by name, location or room
  const filteredHotels = hotels.filter((hotel) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      hotel.name?.toLowerCase().includes(search) ||
      hotel.location?.toLowerCase().includes(search) ||
      hotel.room?.toLowerCase().includes(search)
    );
  });

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
          SEARCH BAR
      ========================== */}

      <div className="hotel-search-container">

        <div className="hotel-search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search hotels, locations or rooms..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

      </div>


      {/* =========================
          SEARCH RESULT
      ========================== */}

      <div className="hotel-result-info">

        <p>
          {searchTerm
            ? `${filteredHotels.length} hotel${
                filteredHotels.length !== 1
                  ? "s"
                  : ""
              } found`
            : `${hotels.length} hotels available`}
        </p>

      </div>


      {/* =========================
          NO RESULTS
      ========================== */}

      {filteredHotels.length === 0 ? (

        <div className="no-hotels">

          <div className="no-hotels-icon">
            🔍
          </div>

          <h2>
            No Hotels Found
          </h2>

          <p>
            We couldn't find any hotel matching
            "{searchTerm}".
          </p>

          <button
            onClick={() => setSearchTerm("")}
          >
            Show All Hotels
          </button>

        </div>

      ) : (

        /* =========================
            HOTEL GRID
        ========================== */

        <div className="hotels-grid">

          {filteredHotels.map((hotel) => (

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


                {/* WISHLIST */}

                <button
                  className={`wishlist-button ${
                    isInWishlist(hotel.id)
                      ? "wishlist-active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleWishlist(hotel)
                  }
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


                {/* PRICE */}

                <h3 className="hotel-price">

                  {hotel.price}

                  <span>
                    {" "}
                    / night
                  </span>

                </h3>


                {/* VIEW HOTEL */}

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

      )}

    </section>
  );
}

export default Hotels;