import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ backgroundColor: '#1a202c', padding: '10px' }}>
      <ul style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0 }}>
        <li style={{ marginRight: '20px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Registrer/søk</Link>
        </li>
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
    </nav>
  );
}

export default NavBar;
