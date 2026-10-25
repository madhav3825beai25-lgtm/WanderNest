const destinationList = [
  {
    id: 1,
    name: "Goa",
    country: "India",
    price: "₹12,999",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    description: "Relax on beautiful beaches, enjoy water sports, and experience vibrant nightlife.",
    duration: "4 Days / 3 Nights",
    places: ["Baga Beach", "Calangute Beach", "Fort Aguada", "Dudhsagar Falls"]
  },
  {
    id: 2,
    name: "Manali",
    country: "India",
    price: "₹14,999",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    description: "Explore snow-covered mountains, beautiful valleys, and exciting adventure activities.",
    duration: "5 Days / 4 Nights",
    places: ["Solang Valley", "Hadimba Temple", "Old Manali", "Rohtang Pass"]
  },
  {
    id: 3,
    name: "Jaipur",
    country: "India",
    price: "₹9,999",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    description: "Discover royal palaces, historic forts, colourful markets, and Rajasthani culture.",
    duration: "3 Days / 2 Nights",
    places: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar"]
  },
  {
    id: 4,
    name: "Kerala",
    country: "India",
    price: "₹16,999",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    description: "Experience peaceful backwaters, lush greenery, tea gardens, and houseboats.",
    duration: "6 Days / 5 Nights",
    places: ["Munnar", "Alleppey", "Kochi", "Thekkady"]
  },
  {
    id: 5,
    name: "Bali",
    country: "Indonesia",
    price: "₹24,999",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy tropical beaches, ancient temples, rice terraces, and island culture.",
    duration: "6 Days / 5 Nights",
    places: ["Ubud", "Kuta Beach", "Tanah Lot Temple", "Tegallalang Rice Terraces"]
  },
  {
    id: 6,
    name: "Dubai",
    country: "UAE",
    price: "₹34,999",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    description: "Experience luxury shopping, modern architecture, and thrilling desert adventures.",
    duration: "5 Days / 4 Nights",
    places: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"]
  },
  {
    id: 7,
    name: "Switzerland",
    country: "Switzerland",
    price: "₹59,999",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    description: "Discover breathtaking Alps, crystal-clear lakes, scenic villages, and mountain trains.",
    duration: "7 Days / 6 Nights",
    places: ["Zurich", "Lucerne", "Interlaken", "Jungfraujoch"]
  },
  {
    id: 8,
    name: "Paris",
    country: "France",
    price: "₹49,999",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "Explore the Eiffel Tower, world-famous museums, charming streets, and French cuisine.",
    duration: "5 Days / 4 Nights",
    places: ["Eiffel Tower", "Louvre Museum", "Arc de Triomphe", "Champs-Élysées"]
  },
  {
    id: 9,
    name: "Maldives",
    country: "Maldives",
    price: "₹39,999",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    description: "Relax in luxury island resorts surrounded by turquoise waters, white beaches, and coral reefs.",
    duration: "5 Days / 4 Nights",
    places: ["Malé", "Maafushi", "Hulhumalé", "Biyadhoo Island"]
  },
  {
    id: 10,
    name: "Tokyo",
    country: "Japan",
    price: "₹69,999",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    description: "Experience modern technology, traditional temples, Japanese food, and exciting city life.",
    duration: "6 Days / 5 Nights",
    places: ["Tokyo Tower", "Shibuya Crossing", "Senso-ji Temple", "Shinjuku"]
  },
  {
    id: 11,
    name: "London",
    country: "United Kingdom",
    price: "₹54,999",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    description: "Visit iconic landmarks, royal palaces, museums, and historic streets.",
    duration: "5 Days / 4 Nights",
    places: ["Big Ben", "London Eye", "Tower Bridge", "Buckingham Palace"]
  },
  {
    id: 12,
    name: "New York",
    country: "USA",
    price: "₹74,999",
    image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1200&q=80",
    description: "Explore famous skyscrapers, Central Park, Broadway, and the energy of New York City.",
    duration: "6 Days / 5 Nights",
    places: ["Times Square", "Central Park", "Statue of Liberty", "Brooklyn Bridge"]
  },
  {
    id: 13,
    name: "Santorini",
    country: "Greece",
    price: "₹74,999",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy whitewashed villages, blue domes, stunning sunsets, and beautiful sea views.",
    duration: "5 Days / 4 Nights",
    places: ["Oia", "Fira", "Red Beach", "Akrotiri"]
  },
  {
    id: 14,
    name: "Singapore",
    country: "Singapore",
    price: "₹59,999",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    description: "Discover futuristic attractions, beautiful gardens, shopping, and delicious Asian cuisine.",
    duration: "5 Days / 4 Nights",
    places: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios"]
  },
  {
    id: 15,
    name: "Rajasthan",
    country: "India",
    price: "₹19,999",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    description: "Explore royal palaces, magnificent forts, colourful markets, and desert landscapes.",
    duration: "6 Days / 5 Nights",
    places: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"]
  },
  {
    id: 16,
    name: "Kashmir",
    country: "India",
    price: "₹34,999",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
    description: "Discover beautiful valleys, snow-covered mountains, peaceful lakes, and houseboats.",
    duration: "6 Days / 5 Nights",
    places: ["Srinagar", "Gulmarg", "Pahalgam", "Dal Lake"]
  },
  {
    id: 17,
    name: "Agra",
    country: "India",
    price: "₹8,999",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    description: "Discover Mughal history and the timeless beauty of the Taj Mahal.",
    duration: "2 Days / 1 Night",
    places: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Fatehpur Sikri"]
  },
  {
    id: 18,
    name: "Varanasi",
    country: "India",
    price: "₹7,999",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    description: "Experience ancient temples, spiritual traditions, and peaceful Ganga riverfront views.",
    duration: "3 Days / 2 Nights",
    places: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Assi Ghat", "Sarnath"]
  },
  {
    id: 19,
    name: "Amritsar",
    country: "India",
    price: "₹8,999",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80",
    description: "Explore Sikh heritage, taste Punjabi food, and experience the city's warm hospitality.",
    duration: "3 Days / 2 Nights",
    places: ["Golden Temple", "Jallianwala Bagh", "Wagah Border", "Partition Museum"]
  },
  {
    id: 20,
    name: "Shimla",
    country: "India",
    price: "₹12,999",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy mountain views, pine forests, colonial architecture, and peaceful hill walks.",
    duration: "4 Days / 3 Nights",
    places: ["Mall Road", "Kufri", "Jakhoo Temple", "The Ridge"]
  },
  {
    id: 21,
    name: "Udaipur",
    country: "India",
    price: "₹13,999",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    description: "Discover lakeside palaces, romantic boat rides, and the royal charm of Rajasthan.",
    duration: "3 Days / 2 Nights",
    places: ["Lake Pichola", "City Palace", "Fateh Sagar Lake", "Saheliyon Ki Bari"]
  },
  {
    id: 22,
    name: "Andaman Islands",
    country: "India",
    price: "₹29,999",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy turquoise seas, tropical forests, coral reefs, and relaxing island adventures.",
    duration: "6 Days / 5 Nights",
    places: ["Havelock Island", "Radhanagar Beach", "Neil Island", "Cellular Jail"]
  },
  {
    id: 23,
    name: "Bangkok",
    country: "Thailand",
    price: "₹29,999",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    description: "Explore ornate temples, lively markets, street food, and vibrant city attractions.",
    duration: "5 Days / 4 Nights",
    places: ["Grand Palace", "Wat Arun", "Chatuchak Market", "Chao Phraya River"]
  },
  {
    id: 24,
    name: "Rome",
    country: "Italy",
    price: "₹64,999",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "Travel through ancient history, grand architecture, Italian cuisine, and charming piazzas.",
    duration: "5 Days / 4 Nights",
    places: ["Colosseum", "Trevi Fountain", "Roman Forum", "Vatican City"]
  },
  {
    id: 25,
    name: "Istanbul",
    country: "Turkey",
    price: "₹44,999",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    description: "Discover magnificent mosques, colourful bazaars, and the meeting point of two continents.",
    duration: "5 Days / 4 Nights",
    places: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Bosphorus"]
  },
  {
    id: 26,
    name: "Sydney",
    country: "Australia",
    price: "₹89,999",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy harbour views, iconic architecture, sandy beaches, and Australian city life.",
    duration: "6 Days / 5 Nights",
    places: ["Sydney Opera House", "Harbour Bridge", "Bondi Beach", "Darling Harbour"]
  },
  {
    id: 27,
    name: "Mauritius",
    country: "Mauritius",
    price: "₹54,999",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    description: "Relax on tropical beaches, explore lagoons, and discover lush island landscapes.",
    duration: "6 Days / 5 Nights",
    places: ["Le Morne", "Grand Baie", "Chamarel", "Black River Gorges"]
  },
  {
    id: 28,
    name: "Kathmandu",
    country: "Nepal",
    price: "₹19,999",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    description: "Explore ancient temples, Himalayan culture, historic squares, and mountain scenery.",
    duration: "5 Days / 4 Nights",
    places: ["Swayambhunath", "Boudhanath", "Pashupatinath", "Kathmandu Durbar Square"]
  },
  {
    id: 29,
    name: "Ooty",
    country: "India",
    price: "₹11,999",
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=80",
    description: "Relax among tea gardens, misty hills, botanical gardens, and scenic train journeys.",
    duration: "4 Days / 3 Nights",
    places: ["Ooty Lake", "Botanical Garden", "Doddabetta Peak", "Nilgiri Mountain Railway"]
  },
  {
    id: 30,
    name: "Darjeeling",
    country: "India",
    price: "₹13,999",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy tea estates, Himalayan sunrises, mountain views, and the famous toy train.",
    duration: "4 Days / 3 Nights",
    places: ["Tiger Hill", "Batasia Loop", "Tea Gardens", "Darjeeling Himalayan Railway"]
  }
];

const destinations = destinationList.map((destination) => ({
  ...destination,
  packageName: `${destination.name} Travel Escape`,
  packagePrice: destination.price,
  hotels: [
    {
      name: `${destination.name} Grand Hotel`,
      rating: "4.8",
      room: "Deluxe Room",
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      nights: destination.duration.split(" / ")[1] || "3 Nights",
      price: destination.price
    },
    {
      name: `${destination.name} Premium Resort`,
      rating: "4.7",
      room: "Premium View Room",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      nights: destination.duration.split(" / ")[1] || "3 Nights",
      price: destination.price
    }
  ]
}));

export default destinations;

