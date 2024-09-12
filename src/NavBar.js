import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false); // To handle the menu on small screens
  const [employees, setEmployees] = useState([]); // To store the list of employees
  const [selectedEmployee, setSelectedEmployee] = useState(Cookies.get('selectedEmployee') || ''); // To store selected employee
  const [stores, setStores] = useState([]); // Store the list of stores
  const [selectedStore, setSelectedStore] = useState(Cookies.get('selectedStore') || ''); // Store the selected store
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // For handling settings dropdown
  const inactivityTimeoutRef = useRef(null); // To store the inactivity timeout reference
  const settingsRef = useRef(null); // To handle click outside for settings menu

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

    // Fetch the list of stores from the server
    const fetchStores = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/stores');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();

    // Set up inactivity detection
    const handleActivity = () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(() => {
        console.log('Brukeren har vært inaktiv i 1 minutt');
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false); // Close the settings dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmployeeChange = (event) => {
    const selected = event.target.value;
    setSelectedEmployee(selected);
    Cookies.set('selectedEmployee', selected); // Save selected employee in a cookie
  };

  const handleStoreChange = (event) => {
    const selected = event.target.value;
    setSelectedStore(selected);
    Cookies.set('selectedStore', selected); // Save selected store in a cookie
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu visibility
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen); // Toggle settings dropdown
  };

  return (
    <nav style={{ backgroundColor: '#1a202c', padding: '10px', position: 'relative' }}>
      <div className="flex items-center justify-between">
        {/* Top menu for small screens */}
        <div className="flex items-center">
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', marginRight: '20px' }}>
            Registrer/søk
          </Link>

          {/* Dropdown for selecting employee, placed next to Registrer/søk */}
          <select
            value={selectedEmployee}
            onChange={handleEmployeeChange}
            className="bg-white border border-gray-300 rounded p-1"
          >
            <option value="">Velg ansatt</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn.split(' ')[0]} {/* Only shows first name */}
              </option>
            ))}
          </select>

          {/* Dropdown for selecting store */}
          <select
            value={selectedStore}
            onChange={handleStoreChange}
            className="bg-white border border-gray-300 rounded p-1 ml-4"
          >
            <option value="">Velg butikk</option>
            {stores.map((store) => (
              <option key={store.butikkid} value={store.butikknavn}>
                {store.butikknavn}
              </option>
            ))}
          </select>
        </div>

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

        {/* Settings icon */}
        <div className="relative" ref={settingsRef}>
          <button onClick={toggleSettingsMenu} className="text-white focus:outline-none">
            {/* Settings icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings" width="16" height="16" viewBox="0 0 28 28" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="14" cy="14" r="3" />
              <path d="M22.4 18a1.65 1.65 0 0 0 .33 1.82l.06 .06a2 2 0 1 1 -2.83 2.83l-.06 -.06a1.65 1.65 0 0 0 -1.82 -.33 1.65 1.65 0 0 0 -1 1.51v.17a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-.17a1.65 1.65 0 0 0 -1 -1.51 1.65 1.65 0 0 0 -1.82 .33l-.06 .06a2 2 0 1 1 -2.83 -2.83l.06 -.06a1.65 1.65 0 0 0 .33 -1.82 1.65 1.65 0 0 0 -1.51 -1h-.17a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2h.17a1.65 1.65 0 0 0 1.51 -1 1.65 1.65 0 0 0 -.33 -1.82l-.06 -.06a2 2 0 1 1 2.83 -2.83l.06 .06a1.65 1.65 0 0 0 1.82 .33h.08a1.65 1.65 0 0 0 1.51 -1v-.17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v.17a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82 -.33l.06 -.06a2 2 0 1 1 2.83 2.83l-.06 .06a1.65 1.65 0 0 0 -.33 1.82v.08a1.65 1.65 0 0 0 1 1.51h.17a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-.17a1.65 1.65 0 0 0 -1.51 1z" />
            </svg>
          </button>

          {isSettingsOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
              <li className="border-b border-gray-200">
                <Link to="/employees" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Ansatte</Link>
              </li>
              <li className="border-b border-gray-200">
                <Link to="/status" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Status</Link>
              </li>
              <li>
                <Link to="/sms-templates" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>SMS-maler</Link>
              </li>
            </ul>
          )}
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
