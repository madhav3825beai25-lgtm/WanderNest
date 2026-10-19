import { useNavigate, useParams } from "react-router-dom";
import "../styles/DestinationDetails.css";

const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
    description:
      "Experience the Eiffel Tower, museums, romantic streets and beautiful French culture.",
    duration: "5 Days / 4 Nights",
    packageName: "Paris Romantic Getaway",
    packagePrice: "₹89,999",
    places: [
      "Eiffel Tower",
      "Louvre Museum",
      "Arc de Triomphe",
      "Notre-Dame Cathedral",
      "Champs-Élysées",
    ],
    hotels: [
      {
        name: "Hotel Eiffel Paris",
        rating: "4.7",
        room: "Deluxe Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹12,000",
      },
      {
        name: "Paris Luxury Stay",
        rating: "4.9",
        room: "Luxury Suite",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹18,000",
      },
    ],
  },

  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
    description:
      "Relax on beautiful beaches, explore ancient temples and enjoy the tropical beauty of Bali.",
    duration: "6 Days / 5 Nights",
    packageName: "Bali Tropical Escape",
    packagePrice: "₹55,000",
    places: [
      "Ubud",
      "Kuta Beach",
      "Tanah Lot Temple",
      "Tegallalang Rice Terraces",
      "Seminyak",
    ],
    hotels: [
      {
        name: "Bali Beach Resort",
        rating: "4.8",
        room: "Ocean View Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹9,500",
      },
      {
        name: "Bali Paradise Resort",
        rating: "4.7",
        room: "Private Villa",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹14,000",
      },
    ],
  },

  {
    id: 3,
    name: "Dubai",
    country: "United Arab Emirates",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    description:
      "Discover luxury shopping, modern architecture, desert adventures and iconic attractions.",
    duration: "5 Days / 4 Nights",
    packageName: "Dubai Luxury Adventure",
    packagePrice: "₹62,999",
    places: [
      "Burj Khalifa",
      "Dubai Mall",
      "Palm Jumeirah",
      "Dubai Marina",
      "Desert Safari",
    ],
    hotels: [
      {
        name: "Dubai Grand Hotel",
        rating: "4.8",
        room: "Deluxe City View",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹11,000",
      },
      {
        name: "Dubai Luxury Resort",
        rating: "4.9",
        room: "Premium Suite",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹16,000",
      },
    ],
  },

  {
    id: 4,
    name: "Switzerland",
    country: "Switzerland",
    image:
      "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1400&q=80",
    description:
      "Explore breathtaking Alps, peaceful lakes, scenic trains and charming mountain towns.",
    duration: "7 Days / 6 Nights",
    packageName: "Swiss Alps Experience",
    packagePrice: "₹1,29,999",
    places: [
      "Zurich",
      "Lucerne",
      "Interlaken",
      "Jungfraujoch",
      "Lake Geneva",
    ],
    hotels: [
      {
        name: "Swiss Alpine Resort",
        rating: "4.8",
        room: "Mountain View Room",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "6 Nights",
        price: "₹20,000",
      },
      {
        name: "Zurich Grand Hotel",
        rating: "4.7",
        room: "Premium Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "6 Nights",
        price: "₹17,000",
      },
    ],
  },

  {
    id: 5,
    name: "Maldives",
    country: "Maldives",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
    description:
      "Enjoy crystal-clear water, white beaches, luxury resorts and unforgettable island experiences.",
    duration: "5 Days / 4 Nights",
    packageName: "Maldives Luxury Retreat",
    packagePrice: "₹79,999",
    places: [
      "Malé",
      "Maafushi",
      "Hulhumalé",
      "Biyadhoo Island",
      "Vaadhoo Island",
    ],
    hotels: [
      {
        name: "Maldives Ocean Resort",
        rating: "4.9",
        room: "Water Villa",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹22,000",
      },
      {
        name: "Maldives Paradise Resort",
        rating: "4.8",
        room: "Beach Villa",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "4 Nights",
        price: "₹25,000",
      },
    ],
  },

  {
    id: 6,
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80",
    description:
      "Experience futuristic Tokyo, traditional temples, Japanese food and Mount Fuji.",
    duration: "6 Days / 5 Nights",
    packageName: "Tokyo Discovery",
    packagePrice: "₹99,999",
    places: [
      "Tokyo Tower",
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Shinjuku",
      "Mount Fuji",
    ],
    hotels: [
      {
        name: "Tokyo Grand Hotel",
        rating: "4.8",
        room: "Deluxe City Room",
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        nights: "5 Nights",
        price: "₹15,000",
      },
      {
        name: "Tokyo Palace Stay",
        rating: "4.7",
        room: "Executive Suite",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹19,000",
      },
    ],
  },

  {
    id: 7,
    name: "London",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80",
    description:
      "Visit iconic landmarks, museums and historic streets in one of the world's greatest cities.",
    duration: "5 Days / 4 Nights",
    packageName: "London Heritage Escape",
    packagePrice: "₹84,999",
    places: [
      "Big Ben",
      "London Eye",
      "Tower Bridge",
      "Buckingham Palace",
      "British Museum",
    ],
    hotels: [
      {
        name: "London Royal Hotel",
        rating: "4.7",
        room: "Deluxe City Room",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "4 Nights",
        price: "₹14,000",
      },
      {
        name: "London Palace Stay",
        rating: "4.8",
        room: "Premium Suite",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹19,000",
      },
    ],
  },

  {
    id: 8,
    name: "New York",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1400&q=80",
    description:
      "Experience Times Square, Central Park and the energy of New York City.",
    duration: "5 Days / 4 Nights",
    packageName: "New York City Escape",
    packagePrice: "₹94,999",
    places: [
      "Times Square",
      "Central Park",
      "Statue of Liberty",
      "Brooklyn Bridge",
      "Empire State Building",
    ],
    hotels: [
      {
        name: "New York Grand Hotel",
        rating: "4.7",
        room: "Deluxe City View",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹16,000",
      },
      {
        name: "Manhattan Luxury Stay",
        rating: "4.9",
        room: "Luxury Suite",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹22,000",
      },
    ],
  },

  {
    id: 9,
    name: "Santorini",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",
    description:
      "Enjoy whitewashed villages, blue domes, stunning sunsets and beautiful Aegean views.",
    duration: "5 Days / 4 Nights",
    packageName: "Santorini Island Escape",
    packagePrice: "₹74,999",
    places: [
      "Oia",
      "Fira",
      "Red Beach",
      "Akrotiri",
      "Aegean Sea Cruise",
    ],
    hotels: [
      {
        name: "Santorini Blue Resort",
        rating: "4.9",
        room: "Caldera View Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹17,000",
      },
      {
        name: "Santorini Luxury Villa",
        rating: "4.8",
        room: "Private Villa",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "4 Nights",
        price: "₹23,000",
      },
    ],
  },

  {
    id: 10,
    name: "Singapore",
    country: "Singapore",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80",
    description:
      "Discover futuristic attractions, beautiful gardens, shopping and delicious Asian cuisine.",
    duration: "5 Days / 4 Nights",
    packageName: "Singapore City Escape",
    packagePrice: "₹59,999",
    places: [
      "Marina Bay Sands",
      "Gardens by the Bay",
      "Sentosa Island",
      "Universal Studios",
      "Singapore Flyer",
    ],
    hotels: [
      {
        name: "Singapore Grand Hotel",
        rating: "4.8",
        room: "Deluxe City Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹11,000",
      },
      {
        name: "Marina Bay Resort",
        rating: "4.9",
        room: "Premium Bay View",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹16,000",
      },
    ],
  },

  {
    id: 11,
    name: "Rajasthan",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80",
    description:
      "Explore royal palaces, magnificent forts, colourful markets and the rich heritage of Rajasthan.",
    duration: "6 Days / 5 Nights",
    packageName: "Royal Rajasthan Experience",
    packagePrice: "₹39,999",
    places: [
      "Jaipur",
      "Udaipur",
      "Jodhpur",
      "Jaisalmer",
      "Amber Fort",
    ],
    hotels: [
      {
        name: "Rajasthan Heritage Hotel",
        rating: "4.8",
        room: "Deluxe Heritage Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹6,500",
      },
      {
        name: "Royal Palace Resort",
        rating: "4.9",
        room: "Royal Suite",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "5 Nights",
        price: "₹10,000",
      },
    ],
  },

  {
    id: 12,
    name: "Kashmir",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Discover beautiful valleys, snow-covered mountains, peaceful lakes and unforgettable landscapes.",
    duration: "6 Days / 5 Nights",
    packageName: "Kashmir Paradise Escape",
    packagePrice: "₹34,999",
    places: [
      "Srinagar",
      "Gulmarg",
      "Pahalgam",
      "Sonamarg",
      "Dal Lake",
    ],
    hotels: [
      {
        name: "Kashmir Valley Resort",
        rating: "4.8",
        room: "Mountain View Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹6,000",
      },
      {
        name: "Dal Lake Houseboat",
        rating: "4.9",
        room: "Premium Houseboat",
        checkIn: "1:00 PM",
        checkOut: "11:00 AM",
        nights: "5 Nights",
        price: "₹8,500",
      },
    ],
  },

  {
    id: 13,
    name: "Goa",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80",
    description:
      "Enjoy beautiful beaches, Portuguese architecture, cruises and the relaxed lifestyle of Goa.",
    duration: "4 Days / 3 Nights",
    packageName: "Goa Beach Escape",
    packagePrice: "₹24,999",
    places: [
      "Baga Beach",
      "Calangute Beach",
      "Basilica of Bom Jesus",
      "Fort Aguada",
      "Dudhsagar Falls",
    ],
    hotels: [
      {
        name: "Goa Beach Resort",
        rating: "4.7",
        room: "Deluxe Beach Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "3 Nights",
        price: "₹6,500",
      },
      {
        name: "Goa Paradise Resort",
        rating: "4.8",
        room: "Premium Ocean View",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "3 Nights",
        price: "₹8,500",
      },
    ],
  },

  {
    id: 14,
    name: "Kerala",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80",
    description:
      "Explore green hills, peaceful backwaters, tea gardens and traditional houseboat experiences.",
    duration: "6 Days / 5 Nights",
    packageName: "Kerala Backwater Retreat",
    packagePrice: "₹36,999",
    places: [
      "Munnar",
      "Alleppey",
      "Kochi",
      "Thekkady",
      "Varkala",
    ],
    hotels: [
      {
        name: "Kerala Backwater Resort",
        rating: "4.8",
        room: "Lake View Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹7,500",
      },
      {
        name: "Munnar Hill Resort",
        rating: "4.7",
        room: "Mountain View Room",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "5 Nights",
        price: "₹8,500",
      },
    ],
  },
];

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const destination = destinations.find(
    (item) => item.id === Number(id)
  );

  if (!destination) {
    return (
      <section className="destination-details">
        <div className="destination-not-found">
          <h1>Destination Not Found</h1>

          <p>
            Sorry, this destination does not exist.
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/destinations")}
          >
            ← Back to Destinations
          </button>
        </div>
      </section>
    );
  }

  const handleBooking = () => {
    navigate("/booking", {
      state: {
        destination: destination.name,
      },
    });
  };

  return (
    <section className="destination-details">

      <button
        className="back-button"
        onClick={() => navigate("/destinations")}
      >
        ← Back to Destinations
      </button>

      <div className="destination-hero">

        <img
          src={destination.image}
          alt={destination.name}
        />

        <div className="destination-hero-content">

          <span className="destination-tag">
            ✈️ Explore Destination
          </span>

          <h1>{destination.name}</h1>

          <p className="destination-country">
            📍 {destination.country}
          </p>

          <p className="destination-description">
            {destination.description}
          </p>

        </div>

      </div>

      <div className="destination-info">

        <div className="info-card">

          <h2>📅 Trip Information</h2>

          <div className="info-row">
            <strong>Duration</strong>
            <span>{destination.duration}</span>
          </div>

          <div className="info-row">
            <strong>Package</strong>
            <span>{destination.packageName}</span>
          </div>

          <div className="info-row">
            <strong>Package Price</strong>
            <span className="highlight-price">
              {destination.packagePrice}
            </span>
          </div>

          <div className="info-row">
            <strong>Hotels Available</strong>
            <span>
              {destination.hotels.length} Hotels
            </span>
          </div>

        </div>

        <div className="info-card">

          <h2>📍 Places to Visit</h2>

          <ul className="places-list">
            {destination.places.map((place, index) => (
              <li key={index}>
                📌 {place}
              </li>
            ))}
          </ul>

        </div>

      </div>

      <div className="hotels-section">

        <div className="section-heading">
          <div>
            <h2>🏨 Available Hotels</h2>

            <p>
              Comfortable stays available in{" "}
              {destination.name}
            </p>
          </div>
        </div>

        <div className="hotel-list">

          {destination.hotels.map((hotel, index) => (

            <div
              className="hotel-item"
              key={index}
            >

              <div className="hotel-top">

                <h3>{hotel.name}</h3>

                <span className="hotel-rating">
                  ⭐ {hotel.rating}
                </span>

              </div>

              <p>
                🛏️ <strong>Room:</strong>{" "}
                {hotel.room}
              </p>

              <p>
                🕑 <strong>Check-in:</strong>{" "}
                {hotel.checkIn}
              </p>

              <p>
                🕛 <strong>Check-out:</strong>{" "}
                {hotel.checkOut}
              </p>

              <p>
                🌙 <strong>Stay:</strong>{" "}
                {hotel.nights}
              </p>

              <div className="hotel-price">
                {hotel.price}
                <span> / night</span>
              </div>

              <button
                className="hotel-button"
                onClick={handleBooking}
              >
                Book This Hotel
              </button>

            </div>

          ))}

        </div>

      </div>

      <div className="package-card">

        <div className="package-icon">
          🎒
        </div>

        <div className="package-content">

          <h2>
            {destination.packageName}
          </h2>

          <p className="package-duration">
            📅 {destination.duration}
          </p>

          <p>
            Enjoy a complete travel experience
            including accommodation, sightseeing
            and unforgettable experiences in{" "}
            {destination.name}.
          </p>

          <p className="package-price">
            {destination.packagePrice}
          </p>

        </div>

      </div>

      <div className="booking-section">

        <h2>
          Ready to Explore {destination.name}?
        </h2>

        <p>
          Book your trip today and create
          unforgettable memories with WanderNest.
        </p>

        <button
          className="book-trip-button"
          onClick={handleBooking}
        >
          Book This Trip →
        </button>

      </div>

    </section>
  );
}

export default DestinationDetails;