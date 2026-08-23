import { Link } from "react-router-dom";
import "../styles/Destinations.css";

function Destinations() {
  const destinations = [
    {
      id: 1,
      name: "Paris",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience the Eiffel Tower, museums, romantic streets and beautiful French culture.",
    },
    {
      id: 2,
      name: "Bali",
      country: "Indonesia",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
      description:
        "Relax on beautiful beaches, explore ancient temples and enjoy the tropical beauty of Bali.",
    },
    {
      id: 3,
      name: "Dubai",
      country: "United Arab Emirates",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover luxury shopping, modern architecture, desert adventures and iconic attractions.",
    },
    {
      id: 4,
      name: "Switzerland",
      country: "Switzerland",
      image:
        "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80",
      description:
        "Explore breathtaking Alps, peaceful lakes, scenic trains and charming mountain towns.",
    },
    {
      id: 5,
      name: "Maldives",
      country: "Maldives",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      description:
        "Enjoy crystal-clear water, white beaches, luxury resorts and unforgettable island experiences.",
    },
    {
      id: 6,
      name: "Tokyo",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience futuristic Tokyo, traditional temples, Japanese food and Mount Fuji.",
    },
    {
      id: 7,
      name: "London",
      country: "United Kingdom",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
      description:
        "Visit iconic landmarks, museums and historic streets in one of the world's greatest cities.",
    },
    {
      id: 8,
      name: "New York",
      country: "USA",
      image:
        "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1200&q=80",
      description:
        "Experience Times Square, Central Park and the energy of New York City.",
    },
    {
      id: 9,
      name: "Santorini",
      country: "Greece",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      description:
        "Enjoy whitewashed villages, blue domes, stunning sunsets and beautiful Aegean views.",
    },
    {
      id: 10,
      name: "Singapore",
      country: "Singapore",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover futuristic attractions, beautiful gardens, shopping and delicious Asian cuisine.",
    },
    {
      id: 11,
      name: "Rajasthan",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      description:
        "Explore royal palaces, magnificent forts, colourful markets and the rich heritage of Rajasthan.",
    },
    {
      id: 12,
      name: "Kashmir",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
      description:
        "Discover beautiful valleys, snow-covered mountains, peaceful lakes and unforgettable landscapes.",
    },
    {
      id: 13,
      name: "Goa",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      description:
        "Enjoy beautiful beaches, Portuguese architecture, cruises and the relaxed lifestyle of Goa.",
    },
    {
      id: 14,
      name: "Kerala",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      description:
        "Explore green hills, peaceful backwaters, tea gardens and traditional houseboat experiences.",
    },
  ];

  return (
    <section className="destinations-page">

      <div className="destinations-header">
        <h1>Explore Destinations</h1>

        <p>
          Discover beautiful destinations and plan your
          perfect WanderNest adventure.
        </p>
      </div>

      <div className="destinations-grid">

        {destinations.map((destination) => (
          <div
            className="destination-card"
            key={destination.id}
          >
            <img
              src={destination.image}
              alt={destination.name}
            />

            <div className="destination-content">

              <h2>{destination.name}</h2>

              <h4>{destination.country}</h4>

              <p>{destination.description}</p>

              <Link
                to={`/destinations/${destination.id}`}
                className="explore-button"
              >
                Explore Now
              </Link>

            </div>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Destinations;