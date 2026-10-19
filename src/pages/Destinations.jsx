import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Destinations.css";

function Destinations() {
  const [searchTerm, setSearchTerm] = useState("");

  const destinations = [
    {
      id: 1,
      name: "Goa",
      country: "India",
      description:
        "Relax on beautiful beaches, enjoy water sports, and experience vibrant nightlife.",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      price: "₹12,999",
    },
    {
      id: 2,
      name: "Manali",
      country: "India",
      description:
        "Explore snow-covered mountains, valleys, adventure activities, and scenic landscapes.",
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
      price: "₹14,999",
    },
    {
      id: 3,
      name: "Jaipur",
      country: "India",
      description:
        "Discover royal palaces, historic forts, colorful markets, and traditional Rajasthani culture.",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      price: "₹9,999",
    },
    {
      id: 4,
      name: "Kerala",
      country: "India",
      description:
        "Experience peaceful backwaters, lush greenery, beautiful beaches, and traditional cuisine.",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      price: "₹16,999",
    },
    {
      id: 5,
      name: "Bali",
      country: "Indonesia",
      description:
        "Experience tropical beaches, ancient temples, rice terraces, and amazing local culture.",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      price: "₹24,999",
    },
    {
      id: 6,
      name: "Dubai",
      country: "UAE",
      description:
        "Enjoy luxury shopping, modern architecture, desert adventures, and unforgettable experiences.",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      price: "₹34,999",
    },
    {
      id: 7,
      name: "Switzerland",
      country: "Europe",
      description:
        "Discover breathtaking mountains, crystal-clear lakes, scenic villages, and beautiful landscapes.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
      price: "₹59,999",
    },
    {
      id: 8,
      name: "Paris",
      country: "France",
      description:
        "Explore iconic landmarks, charming streets, world-famous museums, and French cuisine.",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      price: "₹49,999",
    },
    {
      id: 9,
      name: "Maldives",
      country: "Maldives",
      description:
        "Relax in luxury resorts surrounded by turquoise waters, white beaches, and coral reefs.",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      price: "₹39,999",
    },
    {
      id: 10,
      name: "Tokyo",
      country: "Japan",
      description:
        "Experience a fascinating blend of modern technology, traditional culture, food, and entertainment.",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      price: "₹69,999",
    },
  ];

  const filteredDestinations = destinations.filter((destination) => {
    const search = searchTerm.toLowerCase();

    return (
      destination.name.toLowerCase().includes(search) ||
      destination.country.toLowerCase().includes(search) ||
      destination.description.toLowerCase().includes(search)
    );
  });

  return (
    <section className="destinations-page">

      {/* HEADER */}
      <div className="destinations-header">
        <h1>Explore Destinations</h1>

        <p>
          Discover beautiful destinations and plan your next
          unforgettable journey.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="destination-search-container">
        <div className="destination-search">
          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="destination-results">
        {filteredDestinations.length} destination
        {filteredDestinations.length !== 1 ? "s" : ""} found
      </div>

      {/* GRID */}
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
                />
              </div>

              <div className="destination-content">

                <span className="destination-country">
                  {destination.country}
                </span>

                <h2>{destination.name}</h2>

                <p>
                  {destination.description}
                </p>

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
        <div className="no-destinations">
          <div>🔍</div>

          <h2>No destinations found</h2>

          <p>
            Try searching for another destination or country.
          </p>

          <button
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