import { useNavigate, useParams } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import "../styles/HotelDetails.css";

const hotels = [
  {
    id: 1,
    name: "Hotel Eiffel Paris",
    location: "Paris, France",
    rating: "4.7",
    price: "₹12,000",
    nights: "3 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",

    room: "Deluxe Room",

    description:
      "Hotel Eiffel Paris offers a comfortable and elegant stay in the heart of Paris. Enjoy beautiful surroundings, modern rooms, excellent hospitality and easy access to famous attractions.",

    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "Air Conditioning",
      "Breakfast Included",
      "24/7 Front Desk",
      "Room Service",
      "Restaurant",
      "Fitness Center",
      "Airport Transfer",
      "Free Parking",
    ],

    highlights: [
      "Near Eiffel Tower",
      "Luxury accommodation",
      "Daily housekeeping",
      "Excellent location",
    ],
  },

  {
    id: 2,
    name: "Paris Luxury Stay",
    location: "Paris, France",
    rating: "4.9",
    price: "₹18,000",
    nights: "4 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",

    room: "Luxury Suite",

    description:
      "Paris Luxury Stay provides a premium experience with stylish suites, modern facilities and beautiful city views. Perfect for couples, families and luxury travellers.",

    amenities: [
      "Free Wi-Fi",
      "Luxury Spa",
      "Swimming Pool",
      "Breakfast Included",
      "Air Conditioning",
      "Room Service",
      "Restaurant",
      "Fitness Center",
      "24/7 Reception",
      "Airport Transfer",
    ],

    highlights: [
      "Luxury Suite",
      "City View",
      "Premium service",
      "Central Paris location",
    ],
  },

  {
    id: 3,
    name: "Bali Beach Resort",
    location: "Bali, Indonesia",
    rating: "4.8",
    price: "₹9,500",
    nights: "5 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",

    room: "Ocean View Room",

    description:
      "Bali Beach Resort is a tropical getaway offering ocean views, relaxing rooms, beautiful pools and direct access to the beach.",

    amenities: [
      "Free Wi-Fi",
      "Beach Access",
      "Swimming Pool",
      "Breakfast Included",
      "Air Conditioning",
      "Spa",
      "Restaurant",
      "Room Service",
      "Airport Transfer",
      "Water Sports",
    ],

    highlights: [
      "Ocean View",
      "Beach Access",
      "Tropical Resort",
      "Swimming Pool",
    ],
  },

  {
    id: 4,
    name: "Bali Paradise Resort",
    location: "Bali, Indonesia",
    rating: "4.7",
    price: "₹14,000",
    nights: "4 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",

    room: "Private Villa",

    description:
      "Bali Paradise Resort offers private villas surrounded by greenery, peaceful surroundings and premium facilities for a relaxing vacation.",

    amenities: [
      "Private Pool",
      "Free Wi-Fi",
      "Breakfast Included",
      "Air Conditioning",
      "Spa",
      "Restaurant",
      "Room Service",
      "Garden",
      "Airport Transfer",
      "24/7 Reception",
    ],

    highlights: [
      "Private Villa",
      "Private Pool",
      "Garden View",
      "Peaceful location",
    ],
  },

  {
    id: 5,
    name: "Dubai Grand Hotel",
    location: "Dubai, UAE",
    rating: "4.8",
    price: "₹11,000",
    nights: "4 Nights",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",

    room: "Deluxe City View",

    description:
      "Dubai Grand Hotel combines modern luxury with spectacular city views. Guests can enjoy comfortable rooms, premium dining and convenient access to Dubai attractions.",

    amenities: [
      "Free Wi-Fi",
      "Swimming Pool",
      "City View",
      "Breakfast Included",
      "Air Conditioning",
      "Restaurant",
      "Gym",
      "Spa",
      "Room Service",
      "Airport Transfer",
    ],

    highlights: [
      "City View",
      "Modern rooms",
      "Luxury facilities",
      "Near major attractions",
    ],
  },

  {
    id: 6,
    name: "Swiss Alpine Resort",
    location: "Switzerland",
    rating: "4.9",
    price: "₹20,000",
    nights: "6 Nights",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",

    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",

    room: "Mountain View Room",

    description:
      "Swiss Alpine Resort provides breathtaking mountain views, cozy rooms and peaceful surroundings for an unforgettable Swiss holiday.",

    amenities: [
      "Mountain View",
      "Free Wi-Fi",
      "Breakfast Included",
      "Heating",
      "Restaurant",
      "Spa",
      "Room Service",
      "Parking",
      "Fitness Center",
      "Airport Transfer",
    ],

    highlights: [
      "Mountain View",
      "Peaceful location",
      "Scenic surroundings",
      "Premium rooms",
    ],
  },

  {
    id: 7,
    name: "Maldives Island Resort",
    location: "Maldives",
    rating: "4.9",
    price: "₹22,000",
    nights: "4 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",

    room: "Water Villa",

    description:
      "Maldives Island Resort offers luxurious water villas, crystal-clear ocean views, private relaxation areas and unforgettable island experiences.",

    amenities: [
      "Water Villa",
      "Ocean View",
      "Private Beach",
      "Swimming Pool",
      "Free Wi-Fi",
      "Breakfast Included",
      "Spa",
      "Restaurant",
      "Water Sports",
      "Airport Transfer",
    ],

    highlights: [
      "Water Villa",
      "Private Beach",
      "Ocean View",
      "Tropical Paradise",
    ],
  },

  {
    id: 8,
    name: "Tokyo City Hotel",
    location: "Tokyo, Japan",
    rating: "4.6",
    price: "₹15,000",
    nights: "5 Nights",
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",

    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",

    room: "Deluxe City Room",

    description:
      "Tokyo City Hotel offers modern accommodation in the heart of Tokyo with comfortable rooms, excellent facilities and easy access to the city's attractions.",

    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Restaurant",
      "Breakfast Included",
      "Room Service",
      "24/7 Reception",
      "Fitness Center",
      "Laundry",
      "City View",
      "Airport Transfer",
    ],

    highlights: [
      "Central Tokyo",
      "City View",
      "Modern rooms",
      "Easy transport access",
    ],
  },

  {
    id: 9,
    name: "London Royal Hotel",
    location: "London, UK",
    rating: "4.7",
    price: "₹16,000",
    nights: "4 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",

    room: "Deluxe Room",

    description:
      "London Royal Hotel provides elegant accommodation close to major London attractions, with comfortable rooms and excellent hospitality.",

    amenities: [
      "Free Wi-Fi",
      "Breakfast Included",
      "Restaurant",
      "Room Service",
      "Air Conditioning",
      "Fitness Center",
      "Laundry",
      "24/7 Reception",
      "City View",
      "Airport Transfer",
    ],

    highlights: [
      "Central London",
      "Elegant rooms",
      "Near attractions",
      "Excellent service",
    ],
  },

  {
    id: 10,
    name: "Santorini Sunset Resort",
    location: "Santorini, Greece",
    rating: "4.9",
    price: "₹21,000",
    nights: "5 Nights",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",

    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80",

    roomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",

    secondRoomImage:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",

    poolImage:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",

    room: "Caldera View Room",

    description:
      "Santorini Sunset Resort offers stunning Caldera views, beautiful rooms, relaxing spaces and unforgettable Mediterranean sunsets.",

    amenities: [
      "Caldera View",
      "Free Wi-Fi",
      "Swimming Pool",
      "Breakfast Included",
      "Air Conditioning",
      "Restaurant",
      "Spa",
      "Room Service",
      "Airport Transfer",
      "Private Balcony",
    ],

    highlights: [
      "Caldera View",
      "Sunset View",
      "Private Balcony",
      "Luxury Resort",
    ],
  },
];

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toggleWishlist, isInWishlist } = useWishlist();

  const hotel = hotels.find(
    (item) => item.id === Number(id)
  );

  /* HOTEL NOT FOUND */

  if (!hotel) {
    return (
      <section className="hotel-not-found">

        <h1>Hotel Not Found</h1>

        <p>
          Sorry, the hotel you are looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/hotels")}
          className="back-hotel-button"
        >
          ← Back to Hotels
        </button>

      </section>
    );
  }

  /* BOOKING */

  const handleBooking = () => {
    navigate("/booking", {
      state: {
        hotel: hotel.name,
        location: hotel.location,
        price: hotel.price,
        room: hotel.room,
      },
    });
  };

  /* WISHLIST */

  const handleWishlist = () => {
    toggleWishlist(hotel);
  };

  return (
    <section className="hotel-details-page">

      {/* BACK BUTTON */}

      <button
        className="back-hotel-button"
        onClick={() => navigate("/hotels")}
      >
        ← Back to Hotels
      </button>

      {/* HERO */}

      <div className="hotel-details-hero">

        <img
          src={hotel.image}
          alt={hotel.name}
        />

        <div className="hotel-hero-overlay">

          <span className="hotel-tag">
            🏨 Premium Stay
          </span>

          <h1>
            {hotel.name}
          </h1>

          <p>
            📍 {hotel.location}
          </p>

          <div className="hero-rating">
            ⭐ {hotel.rating} / 5
          </div>

        </div>

        {/* HERO WISHLIST BUTTON */}

        <button
          className={`details-wishlist-button ${
            isInWishlist(hotel.id)
              ? "details-wishlist-active"
              : ""
          }`}
          onClick={handleWishlist}
        >
          {isInWishlist(hotel.id)
            ? "❤️ Saved"
            : "♡ Add to Wishlist"}
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="hotel-details-container">

        {/* LEFT CONTENT */}

        <div className="hotel-main-content">

          {/* INTRO */}

          <div className="hotel-intro">

            <h2>
              {hotel.name}
            </h2>

            <p>
              {hotel.description}
            </p>

          </div>

          {/* ROOM GALLERY */}

          <div className="hotel-section">

            <h2>
              🛏️ Rooms & Accommodation
            </h2>

            <p className="section-description">
              Explore our comfortable rooms and premium accommodation.
            </p>

            <div className="room-gallery">

              <div className="room-image-card">

                <img
                  src={hotel.roomImage}
                  alt={`${hotel.room} interior`}
                />

                <div className="room-image-label">
                  {hotel.room}
                </div>

              </div>

              <div className="room-image-card">

                <img
                  src={hotel.secondRoomImage}
                  alt="Hotel room"
                />

                <div className="room-image-label">
                  Premium Room
                </div>

              </div>

              <div className="room-image-card">

                <img
                  src={hotel.poolImage}
                  alt="Hotel facilities"
                />

                <div className="room-image-label">
                  Resort Facilities
                </div>

              </div>

            </div>

          </div>

          {/* ROOM INFORMATION */}

          <div className="room-information">

            <h2>
              🛏️ {hotel.room}
            </h2>

            <div className="room-info-grid">

              <div>
                <strong>
                  🛏️ Room Type
                </strong>

                <span>
                  {hotel.room}
                </span>
              </div>

              <div>
                <strong>
                  🌙 Stay
                </strong>

                <span>
                  {hotel.nights}
                </span>
              </div>

              <div>
                <strong>
                  🕐 Check-in
                </strong>

                <span>
                  {hotel.checkIn}
                </span>
              </div>

              <div>
                <strong>
                  🕐 Check-out
                </strong>

                <span>
                  {hotel.checkOut}
                </span>
              </div>

            </div>

          </div>

          {/* AMENITIES */}

          <div className="hotel-section">

            <h2>
              ✨ Hotel Amenities
            </h2>

            <div className="amenities-grid">

              {hotel.amenities.map(
                (amenity, index) => (

                  <div
                    className="amenity-item"
                    key={index}
                  >
                    <span>
                      ✓
                    </span>

                    {amenity}

                  </div>

                )
              )}

            </div>

          </div>

          {/* HIGHLIGHTS */}

          <div className="hotel-section">

            <h2>
              ⭐ Why Stay Here?
            </h2>

            <div className="highlights-list">

              {hotel.highlights.map(
                (item, index) => (

                  <div
                    className="highlight-item"
                    key={index}
                  >
                    <span>
                      ✓
                    </span>

                    {item}

                  </div>

                )
              )}

            </div>

          </div>

        </div>

        {/* RIGHT BOOKING CARD */}

        <aside className="hotel-booking-card">

          <h2>
            Book Your Stay
          </h2>

          <div className="booking-rating">
            ⭐ {hotel.rating} Excellent
          </div>

          <div className="booking-location">
            📍 {hotel.location}
          </div>

          <div className="booking-divider"></div>

          <div className="booking-detail">

            <span>
              Room
            </span>

            <strong>
              {hotel.room}
            </strong>

          </div>

          <div className="booking-detail">

            <span>
              Stay
            </span>

            <strong>
              {hotel.nights}
            </strong>

          </div>

          <div className="booking-detail">

            <span>
              Check-in
            </span>

            <strong>
              {hotel.checkIn}
            </strong>

          </div>

          <div className="booking-detail">

            <span>
              Check-out
            </span>

            <strong>
              {hotel.checkOut}
            </strong>

          </div>

          <div className="booking-divider"></div>

          <div className="booking-price">

            <span>
              Price
            </span>

            <strong>
              {hotel.price}

              <small>
                {" "}
                / night
              </small>
            </strong>

          </div>

          {/* WISHLIST */}

          <button
            className={`details-card-wishlist ${
              isInWishlist(hotel.id)
                ? "details-card-wishlist-active"
                : ""
            }`}
            onClick={handleWishlist}
          >
            {isInWishlist(hotel.id)
              ? "❤️ Remove from Wishlist"
              : "♡ Add to Wishlist"}
          </button>

          {/* BOOK HOTEL */}

          <button
            className="book-hotel-button"
            onClick={handleBooking}
          >
            Book This Hotel →
          </button>

          <p className="booking-note">
            ✓ Free cancellation available
          </p>

          <p className="booking-note">
            ✓ Secure booking
          </p>

          <p className="booking-note">
            ✓ Best price guarantee
          </p>

        </aside>

      </div>

    </section>
  );
}

export default HotelDetails;