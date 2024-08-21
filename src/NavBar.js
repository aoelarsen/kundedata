import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function NavBar() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);

          // Hent valgt employee fra cookies hvis det er satt
          const savedEmployee = Cookies.get('selectedEmployee');
          if (savedEmployee) {
            setSelectedEmployee(savedEmployee);
          }
        } else {
          console.error('Feil ved henting av ansatte:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeChange = (e) => {
    const employee = e.target.value;
    setSelectedEmployee(employee);
    Cookies.set('selectedEmployee', employee, { expires: 7 }); // Lagre valgt employee i cookies i 7 dager
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white hover:text-gray-300">Registrer/søk</Link>
        <Link to="/customer-list" className="text-white hover:text-gray-300">Kundeliste</Link>
        <Link to="/ordre" className="text-white hover:text-gray-300">Ordre</Link>
        <Link to="/service" className="text-white hover:text-gray-300">Service</Link>
        <Link to="/hjelpemidler" className="text-white hover:text-gray-300">Hjelpemidler</Link>
      </div>
      <div>
        <select
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          className="bg-white text-gray-700 p-2 rounded-md"
        >
          <option value="">Velg ansatt</option>
          {employees.map(employee => (
            <option key={employee._id} value={employee.navn}>  {/* Oppdater key-prop til å bruke _id */}
              {employee.navn}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

export default NavBar;
