import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Packages.css";

function Packages() {
  const [searchTerm, setSearchTerm] = useState("");

  const packages = [
    {
      id: 1,
      title: "Royal Rajasthan",
      location: "Jaipur, India",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover royal palaces, historic forts, traditional markets, and rich culture.",
    },

    {
      id: 2,
      title: "Kashmir Paradise",
      location: "Kashmir, India",
      duration: "6 Days / 5 Nights",
      price: "₹42,999",
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover breathtaking valleys, snow-covered mountains, peaceful lakes and beautiful landscapes.",
    },

    {
      id: 3,
      title: "Goa Beach Escape",
      location: "Goa, India",
      duration: "4 Days / 3 Nights",
      price: "₹24,999",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      description:
        "Enjoy beautiful beaches, water sports, local food, and exciting nightlife.",
    },

    {
      id: 4,
      title: "Kerala Backwaters",
      location: "Kerala, India",
      duration: "6 Days / 5 Nights",
      price: "₹36,999",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      description:
        "Relax among peaceful backwaters, lush greenery, beaches, and beautiful landscapes.",
    },

    {
      id: 5,
      title: "Bali Paradise",
      location: "Bali, Indonesia",
      duration: "6 Days / 5 Nights",
      price: "₹55,000",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience tropical beaches, temples, rice terraces, and unforgettable island life.",
    },

    {
      id: 6,
      title: "Dubai Luxury",
      location: "Dubai, UAE",
      duration: "5 Days / 4 Nights",
      price: "₹62,999",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience luxury shopping, desert safaris, modern architecture, and fine dining.",
    },

    {
      id: 7,
      title: "Swiss Alps Experience",
      location: "Switzerland",
      duration: "7 Days / 6 Nights",
      price: "₹1,29,999",
      image:
        "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover snow-covered mountains, beautiful lakes, scenic villages, and Alpine views.",
    },

    {
      id: 8,
      title: "Paris Explorer",
      location: "Paris, France",
      duration: "6 Days / 5 Nights",
      price: "₹89,999",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      description:
        "Explore iconic landmarks, museums, charming streets, and delicious French cuisine.",
    },

    {
      id: 9,
      title: "Tokyo Discovery",
      location: "Tokyo, Japan",
      duration: "6 Days / 5 Nights",
      price: "₹99,999",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover futuristic Tokyo, ancient temples, Japanese food and Mount Fuji.",
    },

    {
      id: 10,
      title: "Maldives Luxury Retreat",
      location: "Maldives",
      duration: "5 Days / 4 Nights",
      price: "₹79,999",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      description:
        "Relax in a luxurious island resort surrounded by crystal-clear water and tropical beauty.",
    },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const search = searchTerm.toLowerCase();

    return (
      pkg.title.toLowerCase().includes(search) ||
      pkg.location.toLowerCase().includes(search) ||
      pkg.description.toLowerCase().includes(search)
    );
  });

  return (
    <section className="packages-page">

      {/* HEADER */}
      <div className="packages-header">
        <h1>Explore Our Travel Packages</h1>

        <p>
          Choose from carefully designed travel packages
          for unforgettable experiences.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="package-search-container">
        <div className="package-search">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              className="clear-package-search"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/* RESULT COUNT */}
      <div className="package-results">
        {filteredPackages.length} package
        {filteredPackages.length !== 1 ? "s" : ""} found
      </div>

      {/* GRID */}
      {filteredPackages.length > 0 ? (
        <div className="packages-grid">

          {filteredPackages.map((pkg) => (
            <div
              className="package-card"
              key={pkg.id}
            >

              {/* IMAGE */}
              <div className="package-image-wrapper">

                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="package-image"
                />

                <div className="package-duration-badge">
                  {pkg.duration}
                </div>

              </div>

              {/* CONTENT */}
              <div className="package-content">

                <p className="package-location">
                  {pkg.location}
                </p>

                <h2>
                  {pkg.title}
                </h2>

                <p className="package-description">
                  {pkg.description}
                </p>

                <div className="package-bottom">

                  <div className="package-price-box">
                    <span>
                      Starting from
                    </span>

                    <strong>
                      {pkg.price}
                    </strong>
                  </div>

                  <Link
                    to={`/packages/${pkg.id}`}
                    className="package-button"
                  >
                    View
                    <br />
                    Details
                  </Link>

                </div>

              </div>

            </div>
          ))}

        </div>
      ) : (
        <div className="no-packages">

          <div>🔍</div>

          <h2>
            No packages found
          </h2>

          <p>
            Try searching for another destination or package.
          </p>

          <button
            onClick={() => setSearchTerm("")}
          >
            Show All Packages
          </button>

        </div>
      )}

    </section>
  );
}

export default Packages;