
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import hotels, { formatHotelPrice } from "../data/hotels";
import "../styles/Hotels.css";

function Hotels() {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [sortBy, setSortBy] = useState("recommended");

  const filteredHotels = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const results = hotels.filter((hotel) => {
      const matchesSearch =
        !search ||
        hotel.name.toLowerCase().includes(search) ||
        hotel.location.toLowerCase().includes(search) ||
        hotel.room.toLowerCase().includes(search) ||
        hotel.amenities.some((amenity) =>
          amenity.toLowerCase().includes(search)
        );

      const matchesMinPrice =
        minPrice === "" || hotel.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || hotel.price <= Number(maxPrice);

      const matchesRating =
        hotel.rating >= Number(minRating);

      return (
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating
      );
    });

    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;

      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [searchTerm, minPrice, maxPrice, minRating, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("0");
    setSortBy("recommended");
  };

  return (
    <section className="hotels-page">
      <div className="hotels-header">
        <p className="hotels-eyebrow">WANDERNEST STAYS</p>

        <h1>Find Your Perfect Stay</h1>

        <p>
          Discover comfortable hotels and resorts for your next journey.
        </p>
      </div>

      <div className="hotel-search-container">
        <div className="hotel-search-box">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>

          <input
            type="search"
            aria-label="Search hotels"
            placeholder="Search hotels, locations, rooms or amenities..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="hotel-filter-toolbar">
        <div className="hotel-filter-field">
          <label htmlFor="minimum-price">Minimum price (₹)</label>
          <input
            id="minimum-price"
            type="number"
            min="0"
            placeholder="Any"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </div>

        <div className="hotel-filter-field">
          <label htmlFor="maximum-price">Maximum price (₹)</label>
          <input
            id="maximum-price"
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>

        <div className="hotel-filter-field">
          <label htmlFor="minimum-rating">Guest rating</label>
          <select
            id="minimum-rating"
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
          >
            <option value="0">All ratings</option>
            <option value="4">4.0+ stars</option>
            <option value="4.5">4.5+ stars</option>
            <option value="4.8">4.8+ stars</option>
          </select>
        </div>

        <div className="hotel-filter-field">
          <label htmlFor="hotel-sort">Sort by</label>
          <select
            id="hotel-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Guest rating</option>
            <option value="name">Hotel name</option>
          </select>
        </div>

        <button
          type="button"
          className="hotel-clear-filters"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>

      <div className="hotel-result-info">
        <p>
          <strong>{filteredHotels.length}</strong>{" "}
          hotel{filteredHotels.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filteredHotels.length === 0 ? (
        <div className="no-hotels">
          <div className="no-hotels-icon">🔍</div>
          <h2>No Hotels Found</h2>
          <p>Try a different location or adjust your filters.</p>

          <button type="button" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="hotels-grid">
          {filteredHotels.map((hotel) => {
            const saved = isInWishlist(hotel.id);

            return (
              <article className="hotel-card" key={hotel.id}>
                <div className="hotel-image-container">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="hotel-image"
                    loading="lazy"
                  />

                  <span className="hotel-card-tag">
                    Guest favourite
                  </span>

                  <button
                    type="button"
                    className={`wishlist-button ${
                      saved ? "wishlist-active" : ""
                    }`}
                    onClick={() => toggleWishlist(hotel)}
                    aria-label={
                      saved
                        ? `Remove ${hotel.name} from wishlist`
                        : `Add ${hotel.name} to wishlist`
                    }
                    aria-pressed={saved}
                  >
                    {saved ? "♥" : "♡"}
                  </button>
                </div>

                <div className="hotel-content">
                  <div className="hotel-title-row">
                    <h2>{hotel.name}</h2>
                    <span className="hotel-rating">
                      ★ {hotel.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="hotel-location">
                    📍 {hotel.location}
                  </p>

                  <p className="hotel-room">
                    🛏️ {hotel.room}
                  </p>

                  <div className="hotel-amenities-preview">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity}>{amenity}</span>
                    ))}
                  </div>

                  <div className="hotel-card-price-row">
                    <div>
                      <h3 className="hotel-price">
                        {formatHotelPrice(hotel.price)}
                      </h3>
                      <span className="hotel-price-caption">
                        per room / night
                      </span>
                    </div>
                  </div>

                  <div className="hotel-actions">
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="view-hotel-button"
                    >
                      View Details
                    </Link>

                    <Link
                      to="/booking"
                      state={{
                        bookingType: "hotel",
                        destination: hotel.location,
                        hotel: hotel.name,
                        price: hotel.price,
                        hotelId: hotel.id,
                        room: hotel.room,
                      }}
                      className="book-hotel-button"
                    >
                      Book Hotel
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Hotels;
