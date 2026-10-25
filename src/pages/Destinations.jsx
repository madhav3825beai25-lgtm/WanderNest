import { useState } from "react";
import { Link } from "react-router-dom";
import destinations from "../data/destinations";
import "../styles/Destinations.css";

function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDestinations = destinations.filter((destination) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      destination.name.toLowerCase().includes(search) ||
      destination.country.toLowerCase().includes(search) ||
      destination.description.toLowerCase().includes(search)
    );
  });

  return (
    <section className="destinations-page">
      <div className="destinations-header">
        <h1>Explore Destinations</h1>

        <p>
          Discover beautiful destinations and plan your next
          unforgettable journey.
        </p>
      </div>

      {/* Search Bar */}
      <div className="destination-search-container">
        <div className="destination-search">
          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Search destinations..."
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
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="destination-results">
        {filteredDestinations.length} destination
        {filteredDestinations.length !== 1 ? "s" : ""} found
      </div>

      {/* Destination Cards */}
      {filteredDestinations.length > 0 ? (
        <div className="destinations-grid">
          {filteredDestinations.map((destination) => (
            <article
              className="destination-card"
              key={destination.id}
            >
              <div className="destination-image-container">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="destination-image"
                  loading="lazy"
                />
              </div>

              <div className="destination-content">
                <span className="destination-country">
                  {destination.country}
                </span>

                <h2>{destination.name}</h2>

                <p>{destination.description}</p>

                <div className="destination-bottom">
                  <div className="destination-price">
                    <span>Starting from</span>
                    <strong>{destination.price}</strong>
                  </div>

                  <Link
                    to={`/destinations/${destination.id}`}
                    className="destination-button"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* No Results */
        <div className="no-destinations">
          <div>🔍</div>

          <h2>No destinations found</h2>

          <p>
            Try searching for another destination or country.
          </p>

          <button
            type="button"
            onClick={() => setSearchTerm("")}
          >
            Show All Destinations
          </button>
        </div>
      )}
    </section>
  );
}

export default Destinations;

