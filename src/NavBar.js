import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link to="/" className="hover:text-gray-300">Registrer/Søk</Link>
        </li>
        <li>
          <Link to="/ordre" className="hover:text-gray-300">Ordre</Link>
        </li>
        <li>
          <Link to="/service" className="hover:text-gray-300">Service</Link>
        </li>
        <li>
          <Link to="/hjelpemidler" className="hover:text-gray-300">Hjelpemidler</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
