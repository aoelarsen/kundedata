import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false); // To handle the menu on small screens
  const [employees, setEmployees] = useState([]); // To store the list of employees
  const [selectedEmployee, setSelectedEmployee] = useState(Cookies.get('selectedEmployee') || ''); // To store selected employee
  const inactivityTimeoutRef = useRef(null); // To store the inactivity timeout reference

  useEffect(() => {
    // Fetch the list of employees from the server
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();

    // Set up inactivity detection
    const handleActivity = () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(() => {
        console.log('Brukeren har vært inaktiv i 1 minutt'); // Log meldingen etter 1 minutts inaktivitet
        setIsOpen(true); // Show the dropdown menu after a period of inactivity
      }, 60000); // 1 minute of inactivity
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Initial call to handleActivity to start the timeout
    handleActivity();

    return () => {
      // Cleanup on component unmount
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  const handleEmployeeChange = (event) => {
    const selected = event.target.value;
    setSelectedEmployee(selected);
    Cookies.set('selectedEmployee', selected); // Save selected employee in a cookie
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu visibility
  };

  return (
    <nav style={{ backgroundColor: '#1a202c', padding: '10px', position: 'relative' }}>
      <div className="flex items-center justify-between">
        {/* Top menu for small screens */}
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px' }}>
          Registrer/søk
        </Link>

        {/* Hamburger menu icon for small screens */}
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

        {/* Regular menu for large screens */}
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

        {/* Dropdown for selecting employee, centered */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <select value={selectedEmployee} onChange={handleEmployeeChange} className="bg-white border border-gray-300 rounded p-1">
            <option value="">Velg ansatt</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn.split(' ')[0]} {/* Only shows first name */}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dropdown menu for small screens */}
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
