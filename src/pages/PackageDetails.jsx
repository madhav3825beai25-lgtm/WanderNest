import { Link, useParams } from "react-router-dom";
import "../styles/PackageDetails.css";

function PackageDetails() {
  const { id } = useParams();

  const packages = [
    {
      id: 1,
      title: "Royal Rajasthan Escape",
      location: "Jaipur • Jodhpur • Udaipur",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience the royal heritage of Rajasthan through magnificent forts, beautiful palaces, colourful markets and traditional cuisine.",
      hotels: [
        "Royal Heritage Hotel, Jaipur",
        "Desert Palace Hotel, Jodhpur",
        "Lake View Resort, Udaipur",
      ],
      places: [
        "Amber Fort",
        "City Palace",
        "Mehrangarh Fort",
        "Lake Pichola",
        "Jag Mandir",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Airport / railway transfers",
        "Local sightseeing",
        "Professional tour assistance",
      ],
    },

    {
      id: 2,
      title: "Kashmir Paradise",
      location: "Srinagar • Gulmarg • Pahalgam",
      duration: "6 Days / 5 Nights",
      price: "₹42,999",
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover the breathtaking valleys, snow-covered mountains, peaceful lakes and unforgettable beauty of Kashmir.",
      hotels: [
        "Dal Lake View Hotel",
        "Gulmarg Mountain Resort",
        "Pahalgam Valley Resort",
      ],
      places: [
        "Dal Lake",
        "Gulmarg",
        "Pahalgam",
        "Mughal Gardens",
        "Srinagar Old City",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Shikara ride",
        "Local sightseeing",
        "Airport transfers",
      ],
    },

    {
      id: 3,
      title: "Goa Beach Escape",
      location: "North Goa • South Goa",
      duration: "4 Days / 3 Nights",
      price: "₹24,999",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80",
      description:
        "Enjoy beautiful beaches, Portuguese architecture, sunset cruises and the relaxed tropical lifestyle of Goa.",
      hotels: [
        "Beachside Resort Goa",
        "Palm Grove Resort",
      ],
      places: [
        "Baga Beach",
        "Calangute Beach",
        "Fort Aguada",
        "Basilica of Bom Jesus",
        "Dona Paula",
      ],
      includes: [
        "3 Nights accommodation",
        "Daily breakfast",
        "Sunset cruise",
        "North & South Goa tour",
        "Airport transfers",
      ],
    },

    {
      id: 4,
      title: "Kerala Backwater Retreat",
      location: "Kochi • Munnar • Alleppey",
      duration: "6 Days / 5 Nights",
      price: "₹36,999",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80",
      description:
        "Explore Kerala's green hills, peaceful backwaters, tea gardens and traditional houseboat experiences.",
      hotels: [
        "Munnar Hills Resort",
        "Alleppey Lake Resort",
        "Kochi Heritage Hotel",
      ],
      places: [
        "Munnar Tea Gardens",
        "Mattupetty Dam",
        "Alleppey Backwaters",
        "Fort Kochi",
        "Houseboat Cruise",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Houseboat experience",
        "Sightseeing",
        "Private transfers",
      ],
    },

    {
      id: 5,
      title: "Bali Tropical Escape",
      location: "Bali • Ubud • Kuta • Seminyak",
      duration: "6 Days / 5 Nights",
      price: "₹55,000",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
      description:
        "Relax on tropical beaches, discover ancient temples and experience the peaceful beauty and culture of Bali.",
      hotels: [
        "Bali Beach Resort",
        "Ubud Valley Resort",
      ],
      places: [
        "Ubud",
        "Kuta Beach",
        "Tanah Lot Temple",
        "Tegallalang Rice Terraces",
        "Seminyak",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Airport transfers",
        "Temple sightseeing",
        "Private day tours",
      ],
    },

    {
      id: 6,
      title: "Dubai Luxury Adventure",
      location: "Dubai • Abu Dhabi",
      duration: "5 Days / 4 Nights",
      price: "₹62,999",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience Dubai's luxury lifestyle, iconic architecture, desert adventures and the cultural attractions of Abu Dhabi.",
      hotels: [
        "Dubai Marina Hotel",
        "Downtown Luxury Hotel",
      ],
      places: [
        "Burj Khalifa",
        "Dubai Marina",
        "Palm Jumeirah",
        "Desert Safari",
        "Abu Dhabi",
      ],
      includes: [
        "4 Nights accommodation",
        "Daily breakfast",
        "Desert safari",
        "Dubai city tour",
        "Airport transfers",
      ],
    },

    {
      id: 7,
      title: "Swiss Alps Experience",
      location: "Zurich • Lucerne • Interlaken",
      duration: "7 Days / 6 Nights",
      price: "₹1,29,999",
      image:
        "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1400&q=80",
      description:
        "Travel through Switzerland's breathtaking mountain landscapes, peaceful lakes and charming Alpine towns.",
      hotels: [
        "Zurich Central Hotel",
        "Lucerne Lake Hotel",
        "Interlaken Alpine Resort",
      ],
      places: [
        "Zurich",
        "Lucerne",
        "Mount Titlis",
        "Interlaken",
        "Jungfraujoch",
      ],
      includes: [
        "6 Nights accommodation",
        "Daily breakfast",
        "Mountain excursion",
        "Scenic train journey",
        "Airport transfers",
      ],
    },

    {
      id: 8,
      title: "Paris Romantic Getaway",
      location: "Paris • Versailles",
      duration: "5 Days / 4 Nights",
      price: "₹89,999",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience romantic Paris with its iconic landmarks, museums, elegant streets, French cuisine and culture.",
      hotels: [
        "Hotel Eiffel Paris",
        "Paris Luxury Stay",
      ],
      places: [
        "Eiffel Tower",
        "Louvre Museum",
        "Seine River",
        "Arc de Triomphe",
        "Versailles Palace",
      ],
      includes: [
        "4 Nights accommodation",
        "Daily breakfast",
        "Seine River cruise",
        "Paris city tour",
        "Airport transfers",
      ],
    },

    {
      id: 9,
      title: "Tokyo Discovery",
      location: "Tokyo • Mount Fuji",
      duration: "6 Days / 5 Nights",
      price: "₹99,999",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover Tokyo's futuristic cityscape, ancient temples, Japanese cuisine and the spectacular Mount Fuji.",
      hotels: [
        "Tokyo Central Hotel",
        "Shinjuku Grand Hotel",
      ],
      places: [
        "Shibuya Crossing",
        "Tokyo Skytree",
        "Senso-ji Temple",
        "Mount Fuji",
        "Harajuku",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Mount Fuji tour",
        "Tokyo city tour",
        "Airport transfers",
      ],
    },

    {
      id: 10,
      title: "Maldives Luxury Retreat",
      location: "Maldives",
      duration: "5 Days / 4 Nights",
      price: "₹79,999",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
      description:
        "Relax in a luxurious island resort surrounded by crystal-clear water, white beaches and tropical beauty.",
      hotels: [
        "Maldives Beach Resort",
        "Private Island Resort",
      ],
      places: [
        "Private Island",
        "Coral Reefs",
        "Lagoon",
        "Sunset Point",
        "Local Island",
      ],
      includes: [
        "4 Nights accommodation",
        "Daily breakfast",
        "Island hopping",
        "Snorkelling experience",
        "Airport speedboat transfer",
      ],
    },
  ];

  const pkg = packages.find((item) => item.id === Number(id));

  if (!pkg) {
    return (
      <div className="package-not-found">
        <h1>Package Not Found</h1>
        <Link to="/packages">Back to Packages</Link>
      </div>
    );
  }

  return (
    <section className="package-details-page">
      <div className="package-hero">
        <img src={pkg.image} alt={pkg.title} />

        <div className="package-hero-overlay">
          <span>WanderNest Travel Package</span>
          <h1>{pkg.title}</h1>
          <p>📍 {pkg.location}</p>
        </div>
      </div>

      <div className="package-details-container">
        <div className="package-main">
          <h2>About This Package</h2>

          <p className="package-long-description">
            {pkg.description}
          </p>

          <div className="details-cards">
            <div className="detail-box">
              <span>📅</span>
              <h3>Duration</h3>
              <p>{pkg.duration}</p>
            </div>

            <div className="detail-box">
              <span>🏨</span>
              <h3>Accommodation</h3>
              <p>Premium Hotels</p>
            </div>

            <div className="detail-box">
              <span>🍽️</span>
              <h3>Meals</h3>
              <p>Daily Breakfast</p>
            </div>

            <div className="detail-box">
              <span>🚗</span>
              <h3>Transfers</h3>
              <p>Included</p>
            </div>
          </div>

          <div className="package-section">
            <h2>📍 Places You Will Visit</h2>

            <div className="places-list">
              {pkg.places.map((place, index) => (
                <div className="place-item" key={index}>
                  <span>✓</span>
                  {place}
                </div>
              ))}
            </div>
          </div>

          <div className="package-section">
            <h2>🏨 Hotels Included</h2>

            <div className="hotels-list">
              {pkg.hotels.map((hotel, index) => (
                <div className="hotel-item" key={index}>
                  <div className="hotel-icon">🏨</div>

                  <div>
                    <h3>{hotel}</h3>
                    <p>Comfortable stay with modern facilities</p>
                    <small>🕑 Check-in: 2:00 PM</small>
                    <small>🕑 Check-out: 12:00 PM</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="package-section">
            <h2>✓ Package Includes</h2>

            <div className="includes-list">
              {pkg.includes.map((item, index) => (
                <div key={index}>✓ {item}</div>
              ))}
            </div>
          </div>
        </div>

        <aside className="package-sidebar">
          <div className="price-card">
            <span>Starting from</span>

            <h2>{pkg.price}</h2>

            <p>per person</p>

            <div className="price-line"></div>

            <p>
              📅 {pkg.duration}
            </p>

            <p>🏨 Hotel accommodation</p>

            <p>🍽️ Daily breakfast</p>

            <p>🚗 Transfers included</p>

            <Link
              to={`/booking?destination=${encodeURIComponent(
                pkg.location
              )}`}
              className="book-package-button"
            >
              Book This Package
            </Link>

            <Link to="/packages" className="back-packages">
              ← Back to Packages
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PackageDetails;