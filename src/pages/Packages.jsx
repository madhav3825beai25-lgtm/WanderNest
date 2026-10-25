import { useState } from "react";
import { Link } from "react-router-dom";
import packages from "../data/packages";
import "../styles/Packages.css";

function Packages() {
  const [searchTerm, setSearchTerm] = useState("");

  const search = searchTerm.trim().toLowerCase();

  const filteredPackages = packages.filter((pkg) =>
    [pkg.title, pkg.location, pkg.description, pkg.duration].some(
      (value) => value.toLowerCase().includes(search)
    )
  );

  return (
    <main className="packages-page">
      <header className="packages-header">
        <h1>Explore Our Travel Packages</h1>
        <p>
          Choose from carefully designed travel packages for
          unforgettable experiences.
        </p>
      </header>

      <div className="package-search-container">
        <div className="package-search">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>

          <input
            type="search"
            placeholder="Search destinations or packages..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search travel packages"
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-package-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <p className="package-results" aria-live="polite">
        <strong>{filteredPackages.length}</strong>{" "}
        {filteredPackages.length === 1 ? "package" : "packages"} found
      </p>

      {filteredPackages.length > 0 ? (
        <div className="packages-grid">
          {filteredPackages.map((pkg) => (
            <article className="package-card" key={pkg.id}>
              <div className="package-image-wrapper">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="package-image"
                  loading="lazy"
                />

                <span className="package-duration-badge">
                  {pkg.duration}
                </span>
              </div>

              <div className="package-content">
                <p className="package-location">
                  📍 {pkg.location}
                </p>

                <h2>{pkg.title}</h2>

                <p className="package-description">
                  {pkg.description}
                </p>

                <div className="package-bottom">
                  <div className="package-price-box">
                    <span>Starting from</span>
                    <strong>{pkg.price}</strong>
                  </div>

                  <Link
                    to={`/packages/${pkg.id}`}
                    className="package-button"
                  >
                    View Details
                  </Link>
                </div>

                <Link
                  to="/booking"
                  state={{
                    bookingType: "package",
                    packageId: pkg.id,
                    destination: pkg.location,
                    packageName: pkg.title,
                    price: pkg.price,
                    duration: pkg.duration,
                    image: pkg.image,
                  }}
                  className="package-book-button"
                >
                  Book This Package
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="no-packages">
          <div aria-hidden="true">🔍</div>
          <h2>No packages found</h2>
          <p>Try searching for another destination or package.</p>

          <button
            type="button"
            onClick={() => setSearchTerm("")}
          >
            Show All Packages
          </button>
        </section>
      )}
    </main>
  );
}

export default Packages;