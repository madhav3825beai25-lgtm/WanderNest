import { Link, useParams } from "react-router-dom";
import packages from "../data/packages";
import "../styles/PackageDetails.css";

function PackageDetails() {
  const { id } = useParams();

  const pkg = packages.find(
    (item) => item.id === Number(id)
  );

  if (!pkg) {
    return (
      <main className="package-not-found">
        <h1>Package Not Found</h1>
        <p>The selected travel package is unavailable.</p>
        <Link to="/packages">← Back to Packages</Link>
      </main>
    );
  }

  return (
    <main className="package-details-page">
      {/* HERO SECTION */}
      <section className="package-hero">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="package-hero-image"
        />

        <div className="package-hero-overlay">
          <span className="package-hero-label">
            WanderNest Travel Package
          </span>

          <h1>{pkg.title}</h1>

          <p>📍 {pkg.location}</p>

          <div className="package-hero-duration">
            📅 {pkg.duration}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="package-details-container">
        <div className="package-main">
          <section className="package-about">
            <h2>About This Package</h2>

            <p className="package-long-description">
              {pkg.description}
            </p>
          </section>

          {/* QUICK DETAILS */}
          <div className="details-cards">
            <div className="detail-box">
              <span>📅</span>
              <h3>Duration</h3>
              <p>{pkg.duration}</p>
            </div>

            <div className="detail-box">
              <span>🏨</span>
              <h3>Accommodation</h3>
              <p>Hotel stay</p>
            </div>

            <div className="detail-box">
              <span>🍽️</span>
              <h3>Meals</h3>
              <p>Daily breakfast</p>
            </div>

            <div className="detail-box">
              <span>🚗</span>
              <h3>Transfers</h3>
              <p>As per itinerary</p>
            </div>
          </div>

          {/* PLACES */}
          <section className="package-section">
            <h2>📍 Places You Will Visit</h2>

            <div className="places-list">
              {pkg.places.map((place) => (
                <div className="place-item" key={place}>
                  <span>✓</span>
                  {place}
                </div>
              ))}
            </div>
          </section>

          {/* HOTELS */}
          <section className="package-section">
            <h2>🏨 Accommodation Options</h2>

            {pkg.hotels.length > 0 ? (
              <div className="hotels-list">
                {pkg.hotels.map((hotel) => (
                  <div className="hotel-item" key={hotel}>
                    <div className="hotel-icon">🏨</div>

                    <div>
                      <h3>{hotel}</h3>

                      <p>
                        Example accommodation option.
                        Final hotel assignment is subject
                        to booking confirmation.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="package-hotel-notice">
                Hotel names and room availability will
                be confirmed before booking.
              </div>
            )}
          </section>

          {/* INCLUSIONS */}
          <section className="package-section">
            <h2>✓ What's Included</h2>

            <div className="includes-list">
              {pkg.includes.map((item) => (
                <div key={item}>
                  <span>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PRICE SIDEBAR */}
        <aside className="package-sidebar">
          <div className="price-card">
            <span className="price-label">
              Starting from
            </span>

            <h2>{pkg.price}</h2>

            <p className="price-person">
              per person
            </p>

            <div className="price-line" />

            <div className="price-features">
              <p>📅 {pkg.duration}</p>
              <p>🏨 Hotel accommodation</p>
              <p>🍽️ Daily breakfast</p>
              <p>📍 {pkg.location}</p>
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
              className="book-package-button"
            >
              Book This Package →
            </Link>

            <p className="package-booking-note">
              Package availability and final price
              are subject to confirmation.
            </p>

            <Link
              to="/packages"
              className="back-packages"
            >
              ← Back to Packages
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PackageDetails;