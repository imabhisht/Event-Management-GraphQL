import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
const mainNavigation = (props) => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>Event Manager</h1>
    </div>

    <nav className="main-navigation__item">
      <ul>
        <li>
          <NavLink to="/auth">Authentication</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
