import TestimonialCard from "./TestimonialCard";
import "../../styles/Testimonials.css";

function Testimonials() {
  const reviews = [
    {
      name: "Aarav Sharma",
      location: "Delhi, India",
      rating: 5,
      review:
        "WanderNest made our Goa trip absolutely amazing. The booking process was simple and everything was well organized."
    },
    {
      name: "Priya Mehta",
      location: "Mumbai, India",
      rating: 5,
      review:
        "I loved the experience with WanderNest. The hotel recommendations were excellent and the trip was completely stress-free."
    },
    {
      name: "Rohan Verma",
      location: "Chandigarh, India",
      rating: 4,
      review:
        "The destinations and packages were very well selected. I especially enjoyed the Manali package."
    },
    {
      name: "Ananya Kapoor",
      location: "Jaipur, India",
      rating: 5,
      review:
        "A wonderful travel platform with beautiful destinations and easy booking. I would definitely use WanderNest again."
    },
    {
      name: "Kabir Singh",
      location: "Amritsar, India",
      rating: 5,
      review:
        "Our Kashmir trip was unforgettable. Everything from hotels to sightseeing was planned perfectly."
    },
    {
      name: "Ishita Gupta",
      location: "Pune, India",
      rating: 4,
      review:
        "The website is easy to use and the travel packages offer great value. Customer support was also helpful."
    },
    {
      name: "Arjun Malhotra",
      location: "Bengaluru, India",
      rating: 5,
      review:
        "WanderNest helped me plan my first solo trip. The recommendations were useful and the entire experience was smooth."
    },
    {
      name: "Meera Nair",
      location: "Kochi, India",
      rating: 5,
      review:
        "The Kerala package was beautiful. The hotels were comfortable and the itinerary gave us plenty of time to explore."
    },
    {
      name: "Aditya Raj",
      location: "Lucknow, India",
      rating: 4,
      review:
        "Very good travel platform. I found several interesting destinations and the booking process was quick."
    },
    {
      name: "Simran Kaur",
      location: "Ludhiana, India",
      rating: 5,
      review:
        "We had an amazing family vacation through WanderNest. Everything was convenient and well managed."
    },
    {
      name: "Vikram Joshi",
      location: "Dehradun, India",
      rating: 5,
      review:
        "The destination information was really helpful while planning our trip. Highly recommended for travel lovers."
    },
    {
      name: "Neha Bansal",
      location: "Noida, India",
      rating: 5,
      review:
        "Excellent experience from start to finish. The package selection and hotel options made planning very easy."
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">

        <div className="testimonials-heading">
          <h2>What Our Travelers Say</h2>
          <p>
            Discover what travelers from around the world think about
            their WanderNest experience.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <TestimonialCard
              key={index}
              name={review.name}
              location={review.location}
              rating={review.rating}
              review={review.review}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;