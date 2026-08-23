import {
  FaShieldAlt,
  FaWallet,
  FaHeadset,
  FaGlobeAmericas,
} from "react-icons/fa";

import "../../styles/WhyChooseUs.css";

const features = [
  {
    id: 1,
    icon: <FaShieldAlt />,
    title: "Safe & Secure",
    description:
      "Your bookings and personal information are protected with secure and reliable services.",
  },
  {
    id: 2,
    icon: <FaWallet />,
    title: "Best Prices",
    description:
      "Get competitive prices and amazing travel deals without compromising on quality.",
  },
  {
    id: 3,
    icon: <FaHeadset />,
    title: "24/7 Support",
    description:
      "Our travel support team is available whenever you need help during your journey.",
  },
  {
    id: 4,
    icon: <FaGlobeAmericas />,
    title: "Worldwide Destinations",
    description:
      "Explore beautiful destinations across India and around the world with WanderNest.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-choose-us">
      <div className="why-heading">
        <span>WHY WANDERNEST?</span>

        <h2>Travel With Confidence</h2>

        <p>
          We make your travel experience simple, safe, affordable,
          and unforgettable.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <div className="feature-card" key={feature.id}>
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;