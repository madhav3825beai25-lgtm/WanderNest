import { Link } from "react-router-dom";
import "../styles/Packages.css";

function Packages() {
  const packages = [
    {
      id: 1,
      title: "Royal Rajasthan Escape",
      location: "Jaipur • Jodhpur • Udaipur",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience royal palaces, magnificent forts, colourful markets and traditional Rajasthani culture.",
    },

    {
      id: 2,
      title: "Kashmir Paradise",
      location: "Srinagar • Gulmarg • Pahalgam",
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
      location: "North Goa • South Goa",
      duration: "4 Days / 3 Nights",
      price: "₹24,999",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      description:
        "Enjoy beautiful beaches, sunset cruises, Portuguese architecture and the relaxed lifestyle of Goa.",
    },

    {
      id: 4,
      title: "Kerala Backwater Retreat",
      location: "Kochi • Munnar • Alleppey",
      duration: "6 Days / 5 Nights",
      price: "₹36,999",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      description:
        "Explore Kerala's green hills, peaceful backwaters, tea gardens and traditional houseboats.",
    },

    {
      id: 5,
      title: "Bali Tropical Escape",
      location: "Bali • Ubud • Kuta • Seminyak",
      duration: "6 Days / 5 Nights",
      price: "₹55,000",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      description:
        "Relax on tropical beaches, discover ancient temples and experience the peaceful beauty of Bali.",
    },

    {
      id: 6,
      title: "Dubai Luxury Adventure",
      location: "Dubai • Abu Dhabi",
      duration: "5 Days / 4 Nights",
      price: "₹62,999",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience luxury shopping, iconic architecture, desert adventures and Abu Dhabi attractions.",
    },

    {
      id: 7,
      title: "Swiss Alps Experience",
      location: "Zurich • Lucerne • Interlaken",
      duration: "7 Days / 6 Nights",
      price: "₹1,29,999",
      image:
        "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80",
      description:
        "Travel through breathtaking mountains, peaceful lakes and charming Alpine towns.",
    },

    {
      id: 8,
      title: "Paris Romantic Getaway",
      location: "Paris • Versailles",
      duration: "5 Days / 4 Nights",
      price: "₹89,999",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience romantic Paris with iconic landmarks, museums, elegant streets and French cuisine.",
    },

    {
      id: 9,
      title: "Tokyo Discovery",
      location: "Tokyo • Mount Fuji",
      duration: "6 Days / 5 Nights",
      price: "₹99,999",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover futuristic Tokyo, ancient temples, Japanese cuisine and spectacular Mount Fuji.",
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

  return (
    <section className="packages-page">

      <div className="packages-header">
        <h1>Explore Our Travel Packages</h1>

        <p>
          Choose from carefully designed travel packages
          for unforgettable experiences.
        </p>
      </div>

      <div className="packages-grid">

        {packages.map((pkg) => (
          <div
            className="package-card"
            key={pkg.id}
          >

            <img
              src={pkg.image}
              alt={pkg.title}
            />

            <div className="package-content">

              <h2>{pkg.title}</h2>

              <p className="package-location">
                📍 {pkg.location}
              </p>

              <p className="package-description">
                {pkg.description}
              </p>

              <div className="package-info">

                <span>
                  📅 {pkg.duration}
                </span>

                <strong>
                  {pkg.price}
                </strong>

              </div>

              <Link
                to={`/packages/${pkg.id}`}
                className="package-button"
              >
                View Details
              </Link>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Packages;