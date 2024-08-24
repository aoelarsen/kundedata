import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false); // Legg til state for å håndtere visningen av menyen

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Veksler mellom å vise og skjule menyen
  };

  return (
    <nav style={{ backgroundColor: '#1a202c', padding: '10px' }}>
      <div className="flex items-center justify-between">
        {/* Toppmenyen for små skjermer */}
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
          Registrer/søk
        </Link>

        {/* Hamburgermeny-ikon for små skjermer */}
        <div className="block md:hidden" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </div>

        {/* Vanlig meny for store skjermer */}
        <ul className="hidden md:flex list-none margin-0 padding-0" style={{ margin: 0, padding: 0 }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/customer-list" style={{ color: '#fff', textDecoration: 'none' }}>Kunder</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/ordre" style={{ color: '#fff', textDecoration: 'none' }}>Ordre</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/service" style={{ color: '#fff', textDecoration: 'none' }}>Service</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/hjelpemidler" style={{ color: '#fff', textDecoration: 'none' }}>Hjelpemidler</Link>
          </li>
        </ul>
      </div>

      {/* Nedtrekksmeny for små skjermer */}
      {isOpen && (
        <ul className="md:hidden" style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginTop: '10px' }}>
            <Link to="/customer-list" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleMenu}>Kunder</Link>
          </li>
          <li style={{ marginTop: '10px' }}>
            <Link to="/ordre" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleMenu}>Ordre</Link>
          </li>
          <li style={{ marginTop: '10px' }}>
            <Link to="/service" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleMenu}>Service</Link>
          </li>
          <li style={{ marginTop: '10px' }}>
            <Link to="/hjelpemidler" style={{ color: '#fff', textDecoration: 'none' }} onClick={toggleMenu}>Hjelpemidler</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default NavBar;
