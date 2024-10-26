import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { logout } from './auth';




const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(Cookies.get('selectedEmployee') || '');
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(Cookies.get('selectedStore') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false); // Legger til modal for ansattvalg
  const settingsRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Sjekk først om butikk er valgt
    if (!Cookies.get('selectedStore')) {
      setIsStoreModalOpen(true);
    } else if (!Cookies.get('selectedEmployee')) {
      // Vis ansattmodal kun hvis butikk er valgt men ansatt ikke er valgt
      setIsEmployeeModalOpen(true);
    }
  }, []);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        const data = await response.json();

        // Filtrer ansatte basert på butikk som er valgt i cookie
        const selectedStore = Cookies.get('selectedStore');
        const filteredEmployees = data.filter((employee) => {
          return (
            employee.butikk === 'Begge butikker' ||
            employee.butikk === selectedStore
          );
        });

        setEmployees(filteredEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stores`);
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchEmployees();
    fetchStores();
  }, []);

  const handleNavigation = (e, path) => {
    if (!selectedEmployee) {
      e.preventDefault(); // Hindre navigasjon
      setIsEmployeeModalOpen(true); // Åpne modal for å velge ansatt
    } else {
      window.location.href = path; // Fortsett navigasjon
    }
  };


  const handleStoreChange = (event) => {
    const selectedStoreName = event.target.value;
    const selectedStoreObject = stores.find(store => store.butikknavn === selectedStoreName);

    if (selectedStoreObject) {
      Cookies.set('selectedStore', selectedStoreObject.butikknavn);
      Cookies.set('butikkid', selectedStoreObject.butikkid); // Lagre butikkid i cookies
      setSelectedStore(selectedStoreObject.butikknavn);
      window.location.reload();
    }

    setIsStoreModalOpen(false); // Lukk modalen etter valg av butikk
  };

  const handleEmployeeChange = (event) => {
    const selected = event.target.value;
    setSelectedEmployee(selected);
    Cookies.set('selectedEmployee', selected);
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openStoreModal = () => {
    setIsStoreModalOpen(true);
  };

  // Funksjon for å lukke modalen ved klikk utenfor
  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('modal-background')) {
      setIsStoreModalOpen(false);
      setIsEmployeeModalOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white text-lg font-semibold" onClick={(e) => handleNavigation(e, '/')}>
              Søk/Registrer
            </Link>



            {/* Employee dropdown */}
            <select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="bg-white border border-gray-300 rounded p-1"
              disabled={isStoreModalOpen || isEmployeeModalOpen} // Disable dropdown når modal er åpen
            >
              <option value="">Velg ansatt</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee.navn}>
                  {employee.navn.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/customer-list" className="text-white text-lg font-semibold" onClick={(e) => handleNavigation(e, '/customer-list')}>KUNDE</Link>
            <Link to="/ordre" className="text-white text-lg font-semibold" onClick={(e) => handleNavigation(e, '/ordre')}>ORDRE</Link>
            <Link to="/service" className="text-white text-lg font-semibold" onClick={(e) => handleNavigation(e, '/service')}>SERVICE</Link>
            <Link to="/todo" className="text-white text-lg font-semibold" onClick={(e) => handleNavigation(e, '/todo')}>ToDo</Link>
            {selectedStore && (
              <span className="text-white ml-4">Butikk: {selectedStore}</span>
            )}
            <nav>
              <Link to="/">Hjem</Link>
              <button onClick={handleLogout}>Logg ut</button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>

            <div className="relative" ref={settingsRef}>
              <button onClick={toggleSettingsMenu} className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings" width="16" height="16" viewBox="0 0 28 28" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="14" cy="14" r="3" />
                  <path d="M22.4 18a1.65 1.65 0 0 0 .33 1.82l.06 .06a2 2 0 1 1 -2.83 2.83l-.06 -.06a1.65 1.65 0 0 0 -1.82 -.33 1.65 1.65 0 0 0 -1 1.51v.17a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2v-.17a1.65 1.65 0 0 0 -1 -1.51 1.65 1.65 0 0 0 -1.82 .33l-.06 .06a2 2 0 1 1 -2.83 -2.83l.06 -.06a1.65 1.65 0 0 0 .33 -1.82 1.65 1.65 0 0 0 -1.51 -1h-.17a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2h.17a1.65 1.65 0 0 0 1.51 -1 1.65 1.65 0 0 0 -.33 -1.82l-.06 -.06a2 2 0 1 1 2.83 -2.83l.06 .06a1.65 1.65 0 0 0 1.82 .33h.08a1.65 1.65 0 0 0 1.51 -1v-.17a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v.17a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82 -.33l.06 -.06a2 2 0 1 1 2.83 2.83l-.06 .06a1.65 1.65 0 0 0 -.33 1.82v.08a1.65 1.65 0 0 0 1 1.51h.17a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-.17a1.65 1.65 0 0 0 -1.51 1z" />
                </svg>
              </button>

              {isSettingsOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <li className="border-b border-gray-200">
                    <Link to="/sendsms" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Send SMS</Link>
                  </li>
                  <li className="border-b border-gray-200">
                    <Link to="/employees" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Ansatte</Link>
                  </li>
                  <li className="border-b border-gray-200">
                    <Link to="/fixed-price-list" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Fastpris arbeid</Link>
                  </li>
                  <li className="border-b border-gray-200">
                    <Link to="/part-list" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Deleliste</Link>
                  </li>
                  <li className="border-b border-gray-200">
                    <Link to="/sms-templates" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>SMS-maler</Link>
                  </li>
                  <li>
                    <Link to="/hjelpemidler" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleSettingsMenu}>Kalkylekalkulator</Link>
                  </li>
                  <li>
                    <button onClick={openStoreModal} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Bytt butikk
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            {selectedStore && (
              <span className="block px-4 py-2 text-white">Butikk: {selectedStore}</span>
            )}
            <Link to="/customer-list" className="block px-4 py-2 text-white">Kunder</Link>
            <Link to="/ordre" className="block px-4 py-2 text-white">Ordre</Link>
            <Link to="/service" className="block px-4 py-2 text-white">Service</Link>
            <Link to="/todo" className="block px-4 py-2 text-white">To do</Link>
          </div>
        )}

        {/* Store selection modal */}
        {isStoreModalOpen && (
          <div
            className="modal-background fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={handleOutsideClick} // Legg til denne for å lytte på klikk utenfor
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Velg butikk</h2>
              <select
                value={selectedStore}
                onChange={handleStoreChange}
                className="bg-white border border-gray-300 rounded p-2"
              >
                <option value="">Velg butikk</option>
                {stores.map((store) => (
                  <option key={store.butikkid} value={store.butikknavn}>
                    {store.butikknavn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Employee selection modal */}
        {isEmployeeModalOpen && (
          <div
            className="modal-background fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={handleOutsideClick} // Lukk modal når man klikker utenfor
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Velg ansatt</h2>
              <select
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                className="bg-white border border-gray-300 rounded p-2"
              >
                <option value="">Velg ansatt</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.navn}>
                    {employee.navn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </nav>

      {/* Banner for å vise hvilken ansatt som er logget inn */}
      {selectedEmployee && (
        <div className="bg-blue-600 text-white text-center py-2">
          Du er logget inn som: <strong className="uppercase">{selectedEmployee.split(' ')[0]}</strong>
        </div>
      )}
    </>
  );
}

export default NavBar;
