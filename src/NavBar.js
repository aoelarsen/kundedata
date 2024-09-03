import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false); // For å håndtere menyen på små skjermer
  const [employees, setEmployees] = useState([]); // For å lagre liste over ansatte
  const [selectedEmployee, setSelectedEmployee] = useState(Cookies.get('selectedEmployee') || ''); // For å lagre valgt ansatt

  useEffect(() => {
    // Hente listen over ansatte fra serveren
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Feil ved henting av ansatte:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeChange = (event) => {
    const selected = event.target.value;
    setSelectedEmployee(selected);
    Cookies.set('selectedEmployee', selected); // Lagre valgt ansatt i en cookie
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Veksle mellom å vise og skjule menyen
  };

  return (
    <nav style={{ backgroundColor: '#1a202c', padding: '10px', position: 'relative' }}>
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

        {/* Nedtrekksmeny for valg av ansatt, midtstilt */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <select value={selectedEmployee} onChange={handleEmployeeChange} className="bg-white border border-gray-300 rounded p-1">
            <option value="">Velg ansatt</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn.split(' ')[0]} {/* Viser kun fornavn */}
              </option>
            ))}
          </select>
        </div>
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
