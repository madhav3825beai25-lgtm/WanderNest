
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSuitcase,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    sessionStorage.getItem("wandernest_token")
  );

  const [userName, setUserName] = useState(
    sessionStorage.getItem("wandernest_user_name") || ""
  );

  const [userEmail, setUserEmail] = useState(
    sessionStorage.getItem("wandernest_user_email") || ""
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateLoginState = () => {
      setToken(sessionStorage.getItem("wandernest_token"));
      setUserName(
        sessionStorage.getItem("wandernest_user_name") || ""
      );
      setUserEmail(
        sessionStorage.getItem("wandernest_user_email") || ""
      );
    };

    window.addEventListener("authChange", updateLoginState);
    window.addEventListener("storage", updateLoginState);

    return () => {
      window.removeEventListener("authChange", updateLoginState);
      window.removeEventListener("storage", updateLoginState);
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("wandernest_token");
    sessionStorage.removeItem("wandernest_user_name");
    sessionStorage.removeItem("wandernest_user_email");

    setToken(null);
    setUserName("");
    setUserEmail("");
    setDropdownOpen(false);

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  }

  return (
    <nav className="main-navbar">
      <Link to="/" className="navbar-logo">
        WanderNest<span>.</span>
      </Link>

      <ul className="navbar-links">
        <li><NavLink to="/travel/flight">Flights</NavLink></li>
        <li><NavLink to="/travel/train">Trains</NavLink></li>
        <li><NavLink to="/travel/cab">Cabs</NavLink></li>
        <li><NavLink to="/my-travel-bookings">Travel Bookings</NavLink></li>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <NavLink to="/destinations">Destinations</NavLink>
        </li>

        <li>
          <NavLink to="/packages">Packages</NavLink>
        </li>

        <li>
          <NavLink to="/hotels">Hotels</NavLink>
        </li>

        <li>
          <NavLink to="/booking">Booking</NavLink>
        </li>

        <li>
          <NavLink to="/wishlist">Wishlist</NavLink>
        </li>

        <li>
          <NavLink to="/about">About</NavLink>
        </li>

        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
      </ul>

      <div className="navbar-account">
        {token ? (
          <div className="profile-container">
            <button
              type="button"
              className="profile-trigger"
              onClick={() =>
                setDropdownOpen((open) => !open)
              }
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <FaUserCircle className="profile-icon" />

              <span>
                Welcome, {userName || "Traveler"}
              </span>

              <span
                className={`dropdown-arrow ${
                  dropdownOpen ? "open" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <FaUserCircle className="dropdown-avatar" />

                  <div>
                    <h3>{userName || "Traveler"}</h3>
                    <p>{userEmail}</p>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <Link
                  to="/my-bookings"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaSuitcase />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaHeart />
                  <span>My Wishlist</span>
                </Link>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <NavLink to="/login" className="login-link">
              Login
            </NavLink>

            <NavLink to="/signup" className="signup-link">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
