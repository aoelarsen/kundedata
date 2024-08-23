import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        {/* Legg til linker til CustomerList og OrderList */}
        <li>
          <Link to="/customer-list">Customer List</Link>
        </li>
        <li>
          <Link to="/ordre">Order List</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/service">Service</Link>
        </li>
        <li>
          <Link to="/hjelpemidler">Calculator</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
