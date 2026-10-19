import { Link, useParams } from "react-router-dom";
import "../styles/PackageDetails.css";

function PackageDetails() {
  const { id } = useParams();

  const packages = [
    {
      id: 1,
      title: "Royal Rajasthan",
      location: "Jaipur, India",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover royal palaces, historic forts, traditional markets, and the rich culture of Rajasthan through an unforgettable journey.",
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
      location: "Kashmir, India",
      duration: "6 Days / 5 Nights",
      price: "₹42,999",
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover breathtaking valleys, snow-covered mountains, peaceful lakes and beautiful landscapes in the beautiful region of Kashmir.",
      hotels: [
        "Srinagar Valley Hotel",
        "Gulmarg Mountain Resort",
        "Pahalgam Riverside Hotel",
      ],
      places: [
        "Srinagar",
        "Gulmarg",
        "Pahalgam",
        "Dal Lake",
        "Mughal Gardens",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Shikara ride on Dal Lake",
        "Gulmarg sightseeing",
        "Private transfers",
      ],
    },

    {
      id: 3,
      title: "Goa Beach Escape",
      location: "Goa, India",
      duration: "4 Days / 3 Nights",
      price: "₹24,999",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80",
      description:
        "Enjoy beautiful beaches, crystal-clear water, water sports, local food and exciting nightlife in the tropical paradise of Goa.",
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
      title: "Kerala Backwaters",
      location: "Kerala, India",
      duration: "6 Days / 5 Nights",
      price: "₹36,999",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80",
      description:
        "Relax among peaceful backwaters, lush greenery, beautiful beaches and stunning landscapes in God's Own Country.",
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
      title: "Bali Paradise",
      location: "Bali, Indonesia",
      duration: "6 Days / 5 Nights",
      price: "₹55,000",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience tropical beaches, ancient temples, rice terraces and unforgettable island life in beautiful Bali.",
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
      title: "Dubai Luxury",
      location: "Dubai, UAE",
      duration: "5 Days / 4 Nights",
      price: "₹62,999",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience luxury shopping, desert safaris, modern architecture, iconic landmarks and fine dining in Dubai.",
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
      location: "Switzerland",
      duration: "7 Days / 6 Nights",
      price: "₹1,29,999",
      image:
        "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover snow-covered mountains, beautiful lakes, scenic villages and breathtaking Alpine views across Switzerland.",
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
      title: "Paris Explorer",
      location: "Paris, France",
      duration: "6 Days / 5 Nights",
      price: "₹89,999",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
      description:
        "Explore iconic landmarks, world-famous museums, charming streets and delicious French cuisine in Paris.",
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
        "5 Nights accommodation",
        "Daily breakfast",
        "Seine River cruise",
        "Paris city tour",
        "Airport transfers",
      ],
    },

    {
      id: 9,
      title: "Tokyo Discovery",
      location: "Tokyo, Japan",
      duration: "6 Days / 5 Nights",
      price: "₹99,999",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover futuristic Tokyo, ancient temples, Japanese cuisine and the spectacular beauty of Mount Fuji.",
      hotels: [
        "Tokyo Grand Hotel",
        "Tokyo Palace Stay",
      ],
      places: [
        "Tokyo Tower",
        "Shibuya Crossing",
        "Senso-ji Temple",
        "Shinjuku",
        "Mount Fuji",
      ],
      includes: [
        "5 Nights accommodation",
        "Daily breakfast",
        "Tokyo city tour",
        "Mount Fuji excursion",
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
        "Maldives Ocean Resort",
        "Maldives Paradise Resort",
      ],
      places: [
        "Male",
        "Maafushi",
        "Biyadhoo Island",
        "Hulhumale",
        "Vaadhoo Island",
      ],
      includes: [
        "4 Nights accommodation",
        "Daily breakfast",
        "Water villa stay",
        "Island sightseeing",
        "Airport transfers",
      ],
    },
  ];

  const pkg = packages.find(
    (item) => item.id === Number(id)
  );

  if (!pkg) {
    return (
      <div className="package-not-found">
        <h1>Package Not Found</h1>

        <Link to="/packages">
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <section className="package-details-page">

      {/* HERO */}
      <div className="package-hero">

        <img
          src={pkg.image}
          alt={pkg.title}
        />

        <div className="package-hero-overlay">

          <span>
            WanderNest Travel Package
          </span>

          <h1>{pkg.title}</h1>

          <p>
            📍 {pkg.location}
          </p>

        </div>

      </div>


      {/* MAIN CONTENT */}
      <div className="package-details-container">

        <div className="package-main">

          <h2>
            About This Package
          </h2>

          <p className="package-long-description">
            {pkg.description}
          </p>


          {/* QUICK DETAILS */}
          <div className="details-cards">

            <div className="detail-box">
              <span>📅</span>

              <h3>Duration</h3>

              <p>
                {pkg.duration}
              </p>
            </div>


            <div className="detail-box">
              <span>🏨</span>

              <h3>Accommodation</h3>

              <p>
                Premium Hotels
              </p>
            </div>


            <div className="detail-box">
              <span>🍽️</span>

              <h3>Meals</h3>

              <p>
                Daily Breakfast
              </p>
            </div>


            <div className="detail-box">
              <span>🚗</span>

              <h3>Transfers</h3>

              <p>
                Included
              </p>
            </div>

          </div>


          {/* PLACES */}
          <div className="package-section">

            <h2>
              📍 Places You Will Visit
            </h2>

            <div className="places-list">

              {pkg.places.map(
                (place, index) => (
                  <div
                    className="place-item"
                    key={index}
                  >
                    <span>✓</span>

                    {place}
                  </div>
                )
              )}

            </div>

          </div>


          {/* HOTELS */}
          <div className="package-section">

            <h2>
              🏨 Hotels Included
            </h2>

            <div className="hotels-list">

              {pkg.hotels.map(
                (hotel, index) => (
                  <div
                    className="hotel-item"
                    key={index}
                  >

                    <div className="hotel-icon">
                      🏨
                    </div>

                    <div>

                      <h3>
                        {hotel}
                      </h3>

                      <p>
                        Comfortable stay with
                        modern facilities
                      </p>

                      <small>
                        🕑 Check-in: 2:00 PM
                      </small>

                      <small>
                        🕑 Check-out: 12:00 PM
                      </small>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>


          {/* INCLUDES */}
          <div className="package-section">

            <h2>
              ✓ Package Includes
            </h2>

            <div className="includes-list">

              {pkg.includes.map(
                (item, index) => (
                  <div key={index}>
                    ✓ {item}
                  </div>
                )
              )}

            </div>

          </div>

        </div>


        {/* SIDEBAR */}
        <aside className="package-sidebar">

          <div className="price-card">

            <span>
              Starting from
            </span>

            <h2>
              {pkg.price}
            </h2>

            <p>
              per person
            </p>

            <div className="price-line"></div>

            <p>
              📅 {pkg.duration}
            </p>

            <p>
              🏨 Hotel accommodation
            </p>

            <p>
              🍽️ Daily breakfast
            </p>

            <p>
              🚗 Transfers included
            </p>


            <Link
              to={`/booking?destination=${encodeURIComponent(
                pkg.location
              )}`}
              className="book-package-button"
            >
              Book This Package
            </Link>


            <Link
              to="/packages"
              className="back-packages"
            >
              ← Back to Packages
            </Link>

          </div>

        </aside>

      </div>

    </section>
  );
}

export default PackageDetails;