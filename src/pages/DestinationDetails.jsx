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
      "Experience the Eiffel Tower, romantic streets, world-famous museums and the beautiful culture of France.",
    duration: "5 Days / 4 Nights",
    packageName: "Paris Explorer",
    packagePrice: "₹75,000",
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
        nights: "3 Nights",
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
      "Relax on beautiful beaches, explore ancient temples and enjoy the tropical beauty and peaceful atmosphere of Bali.",
    duration: "6 Days / 5 Nights",
    packageName: "Bali Escape",
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
        nights: "4 Nights",
        price: "₹14,000",
      },
    ],
  },

  {
    id: 3,
    name: "Dubai",
    country: "UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    description:
      "Discover luxury shopping, modern architecture, desert adventures and the spectacular Dubai skyline.",
    duration: "5 Days / 4 Nights",
    packageName: "Dubai Adventure",
    packagePrice: "₹65,000",
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
        nights: "5 Nights",
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
      "Enjoy stunning mountains, peaceful lakes, charming villages and scenic train journeys through Switzerland.",
    duration: "7 Days / 6 Nights",
    packageName: "Swiss Delight",
    packagePrice: "₹1,25,000",
    places: [
      "Interlaken",
      "Zurich",
      "Lucerne",
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
        nights: "5 Nights",
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
      "Escape to crystal-clear waters, beautiful islands, luxury resorts and unforgettable tropical experiences.",
    duration: "5 Days / 4 Nights",
    packageName: "Maldives Paradise",
    packagePrice: "₹85,000",
    places: [
      "Male",
      "Maafushi",
      "Biyadhoo Island",
      "Hulhumale",
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
        nights: "5 Nights",
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
      "Explore futuristic streets, ancient temples, amazing food and the unique culture of Japan.",
    duration: "6 Days / 5 Nights",
    packageName: "Tokyo Discovery",
    packagePrice: "₹95,000",
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
        nights: "4 Nights",
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
      "Visit iconic landmarks, historic streets, museums and experience the vibrant culture of London.",
    duration: "5 Days / 4 Nights",
    packageName: "London Highlights",
    packagePrice: "₹90,000",
    places: [
      "Big Ben",
      "London Eye",
      "Buckingham Palace",
      "Tower Bridge",
      "British Museum",
    ],
    hotels: [
      {
        name: "London Royal Hotel",
        rating: "4.7",
        room: "Deluxe Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "4 Nights",
        price: "₹16,000",
      },
      {
        name: "London Central Stay",
        rating: "4.6",
        room: "Premium Suite",
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        nights: "5 Nights",
        price: "₹19,000",
      },
    ],
  },

  {
    id: 8,
    name: "New York",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1400&q=80",
    description:
      "Experience Times Square, Central Park, iconic skyscrapers and the exciting energy of New York City.",
    duration: "6 Days / 5 Nights",
    packageName: "New York City Tour",
    packagePrice: "₹1,10,000",
    places: [
      "Times Square",
      "Central Park",
      "Statue of Liberty",
      "Empire State Building",
      "Brooklyn Bridge",
    ],
    hotels: [
      {
        name: "New York City Hotel",
        rating: "4.8",
        room: "City View Room",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹20,000",
      },
      {
        name: "Manhattan Luxury Stay",
        rating: "4.7",
        room: "Luxury Suite",
        checkIn: "2:00 PM",
        checkOut: "11:00 AM",
        nights: "4 Nights",
        price: "₹24,000",
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
      "Enjoy whitewashed buildings, blue domes, beautiful beaches and stunning Mediterranean sunsets.",
    duration: "6 Days / 5 Nights",
    packageName: "Greek Island Escape",
    packagePrice: "₹1,00,000",
    places: [
      "Oia",
      "Fira",
      "Red Beach",
      "Akrotiri",
      "Imerovigli",
    ],
    hotels: [
      {
        name: "Santorini Sunset Resort",
        rating: "4.9",
        room: "Caldera View Room",
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹21,000",
      },
      {
        name: "Santorini Blue Palace",
        rating: "4.8",
        room: "Private Villa",
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        nights: "4 Nights",
        price: "₹26,000",
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
      "Discover futuristic architecture, beautiful gardens, world-class attractions and amazing food.",
    duration: "5 Days / 4 Nights",
    packageName: "Singapore Explorer",
    packagePrice: "₹70,000",
    places: [
      "Gardens by the Bay",
      "Marina Bay Sands",
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
        price: "₹13,000",
      },
      {
        name: "Marina Bay Luxury Stay",
        rating: "4.9",
        room: "Premium Suite",
        checkIn: "3:00 PM",
        checkOut: "12:00 PM",
        nights: "5 Nights",
        price: "₹18,000",
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
      <div className="destination-not-found">
        <h1>Destination Not Found</h1>

        <p>Sorry, this destination does not exist.</p>

        <button
          className="back-button"
          onClick={() => navigate("/destinations")}
        >
          Back to Destinations
        </button>
      </div>
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
            <span>{destination.hotels.length} Hotels</span>
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
              Comfortable stays available in {destination.name}
            </p>
          </div>

        </div>

        <div className="hotel-list">

          {destination.hotels.map((hotel, index) => (

            <div className="hotel-item" key={index}>

              <div className="hotel-top">

                <h3>{hotel.name}</h3>

                <span className="hotel-rating">
                  ⭐ {hotel.rating}
                </span>

              </div>

              <p>
                🛏️ <strong>Room:</strong> {hotel.room}
              </p>

              <p>
                🕑 <strong>Check-in:</strong> {hotel.checkIn}
              </p>

              <p>
                🕛 <strong>Check-out:</strong> {hotel.checkOut}
              </p>

              <p>
                🌙 <strong>Stay:</strong> {hotel.nights}
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

          <h2>{destination.packageName}</h2>

          <p className="package-duration">
            📅 {destination.duration}
          </p>

          <p>
            Enjoy a complete travel experience including
            accommodation, sightseeing and unforgettable
            experiences in {destination.name}.
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
          Book your trip today and create unforgettable
          memories with WanderNest.
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