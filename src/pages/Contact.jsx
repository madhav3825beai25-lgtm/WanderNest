import { useState } from "react";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-tag">GET IN TOUCH</span>

          <h1>
            Let's Talk
            <br />
            Travel.
          </h1>

          <p>
            Have a question, suggestion, or need help planning your next
            adventure? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">

        {/* Contact Information */}
        <div className="contact-info">

          <span className="section-tag">CONTACT US</span>

          <h2>
            We're Here
            <br />
            To Help
          </h2>

          <p className="contact-description">
            Whether you have a question about a destination, hotel,
            booking, or anything else, our team is ready to help.
          </p>

          <div className="contact-details">

            <div className="contact-detail">
              <div className="contact-icon">📧</div>

              <div>
                <h3>Email</h3>
                <p>support@wandernest.com</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon">📞</div>

              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon">📍</div>

              <div>
                <h3>Address</h3>
                <p>
                  1st Floor, Block A,
                  <br />
                  Connaught Place,
                  <br />
                  New Delhi, Delhi 110001,
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-icon">🕐</div>

              <div>
                <h3>Working Hours</h3>
                <p>Monday – Friday, 9:00 AM – 6:00 PM</p>
              </div>
            </div>

          </div>

        </div>

        {/* Contact Form */}
        <div className="contact-form-container">

          {submitted ? (
            <div className="success-message">

              <div className="success-icon">✓</div>

              <h2>Message Sent!</h2>

              <p>
                Thank you for contacting WanderNest. We'll get back to
                you as soon as possible.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="send-another-button"
              >
                Send Another Message
              </button>

            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">
                    Your Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What can we help you with?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="7"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit-button"
              >
                Send Message →
              </button>

            </form>
          )}

        </div>

      </section>

      {/* Map Section */}
      <section className="map-section">

        <div className="map-header">
          <span className="section-tag">FIND US</span>

          <h2>
            Visit Our
            <br />
            Office
          </h2>

          <p>
            Come visit us in the heart of New Delhi.
          </p>
        </div>

        <div className="map-container">
          <iframe
            title="WanderNest Delhi Location"
            src="https://www.google.com/maps?q=Connaught+Place,+New+Delhi,+Delhi+110001&output=embed"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

      </section>

      {/* FAQ Section */}
      <section className="contact-help">

        <div className="contact-help-header">
          <span className="section-tag">NEED HELP?</span>

          <h2>
            Frequently Asked
            <br />
            Questions
          </h2>
        </div>

        <div className="faq-grid">

          <div className="faq-card">
            <h3>How can I book a hotel?</h3>

            <p>
              Browse our hotels, select the one you like, and follow the
              booking options available on the hotel details page.
            </p>
          </div>

          <div className="faq-card">
            <h3>Can I save hotels for later?</h3>

            <p>
              Yes. Simply click the heart icon on a hotel to add it to
              your wishlist.
            </p>
          </div>

          <div className="faq-card">
            <h3>How do I contact support?</h3>

            <p>
              You can use the contact form on this page or reach us through
              the email and phone number provided above.
            </p>
          </div>

          <div className="faq-card">
            <h3>Can I explore destinations?</h3>

            <p>
              Absolutely. Visit the Destinations page to discover places
              for your next adventure.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Contact;