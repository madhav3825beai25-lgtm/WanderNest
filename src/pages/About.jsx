import "../styles/About.css";

function About() {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">ABOUT WANDERNEST</span>

          <h1>
            Explore More.
            <br />
            Travel Better.
          </h1>

          <p>
            WanderNest is your trusted travel companion for discovering
            beautiful destinations, comfortable stays, and unforgettable
            experiences around the world.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-section">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
            alt="Travel adventure"
          />
        </div>

        <div className="about-content">
          <span className="section-tag">WHO WE ARE</span>

          <h2>
            Your Journey,
            <br />
            Our Passion
          </h2>

          <p>
            At WanderNest, we believe that travelling is more than just
            visiting a new place. It is about creating memories, discovering
            new cultures, meeting people, and experiencing something
            extraordinary.
          </p>

          <p>
            Our platform brings destinations, travel packages, and hotels
            together in one simple and convenient place, making it easier
            for you to plan your perfect journey.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">

        <div className="mission-content">
          <span className="section-tag">OUR MISSION</span>

          <h2>
            Making Travel
            <br />
            Simple & Memorable
          </h2>

          <p>
            Our mission is to make travel planning simple, enjoyable, and
            accessible. From finding the perfect destination to choosing
            the right stay, WanderNest helps you take care of the details
            so you can focus on enjoying the journey.
          </p>
        </div>

        <div className="mission-cards">

          <div className="mission-card">
            <div className="mission-icon">🌍</div>

            <h3>Explore</h3>

            <p>
              Discover amazing destinations and hidden gems around the world.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">🏨</div>

            <h3>Stay</h3>

            <p>
              Find comfortable hotels and stays that match your travel needs.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">✈️</div>

            <h3>Experience</h3>

            <p>
              Create unforgettable memories with every journey you take.
            </p>
          </div>

        </div>
      </section>

      {/* Why WanderNest */}
      <section className="why-section">

        <div className="why-header">
          <span className="section-tag">WHY WANDERNEST?</span>

          <h2>
            Everything You Need
            <br />
            For Your Next Adventure
          </h2>
        </div>

        <div className="why-grid">

          <div className="why-card">
            <span className="why-number">01</span>
            <h3>Easy Planning</h3>
            <p>
              Plan your trips easily with destinations, packages, and hotels
              available in one place.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">02</span>
            <h3>Beautiful Destinations</h3>
            <p>
              Explore carefully selected destinations that are perfect for
              your next adventure.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">03</span>
            <h3>Comfortable Stays</h3>
            <p>
              Discover hotels and stays that help make your journey relaxing
              and comfortable.
            </p>
          </div>

          <div className="why-card">
            <span className="why-number">04</span>
            <h3>Travel With Confidence</h3>
            <p>
              Get the information you need to make better travel decisions
              before starting your journey.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">

        <div>
          <span className="about-tag">START YOUR JOURNEY</span>

          <h2>
            The World Is
            <br />
            Waiting For You.
          </h2>

          <p>
            Find your next destination and start creating memories today.
          </p>
        </div>

        <a href="/destinations" className="about-cta-button">
          Explore Destinations →
        </a>

      </section>

    </div>
  );
}

export default About;