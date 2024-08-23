import React, { useEffect } from 'react';

function NavBar() {
  // Heroku base URL
  const API_BASE_URL = 'https://kundesamhandling-acdc6a9165f8.herokuapp.com';

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (response.ok) {
          // Kommenter ut denne linjen hvis variabelen ikke brukes
          // const employeesData = await response.json();
          // Hvis du ikke bruker setEmployees, kan denne linjen også kommenteres ut
          // setEmployees(employeesData);
        } else {
          console.error('Feil ved henting av ansatte');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchEmployees();
  }, [API_BASE_URL]);

  return (
    <nav>
      {/* Din NavBar kode */}
    </nav>
  );
}

export default NavBar;
