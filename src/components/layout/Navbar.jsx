import "../../styles/Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>WanderNest</h2>

      <ul>
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
    </nav>
  );
}

export default Navbar;