import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // For å håndtere cookies

function CreateService() {
  const { customerNumber } = useParams(); // Hent customerNumber fra URL
  const navigate = useNavigate();
  
  // State for å lagre ansatte
  const [employees, setEmployees] = useState([]);
  
  console.log('Butikkid fra cookies:', Cookies.get('butikkid'));

  // State for å lagre servicedetaljer inkludert valgt ansatt og butikkid
  const [formData, setFormData] = useState({
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Beskrivelse: '',
    Ansatt: Cookies.get('selectedEmployee') || '', // Sett valgt ansatt fra cookies hvis tilgjengelig
    butikkid: Cookies.get('butikkid') || '', // Hent butikkid fra cookies
    kundeid: parseInt(customerNumber, 10), // Konverter customerNumber til et tall
    serviceid: '', // Nytt felt for service ID
    test: 'test' // Inkluder test-feltet
  });

  // Hent siste service-ID når komponenten laster inn
  useEffect(() => {
    const fetchLastServiceId = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/last-service-id');
        const data = await response.json();
        const lastServiceId = parseInt(data.lastServiceId, 10);
        const nextServiceId = isNaN(lastServiceId) ? 1 : lastServiceId + 1;

        setFormData(prevData => ({
          ...prevData,
          serviceid: nextServiceId // Lagre servicenummer i serviceid
        }));
      } catch (error) {
        console.error('Feil ved henting av siste service-ID:', error);
      }
    };

    // Hent liste over ansatte fra API
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Feil ved henting av ansatte:', error);
      }
    };

    fetchLastServiceId();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Hent butikkid basert på valgt ansatt
    if (name === 'Ansatt') {
      const selectedEmployee = employees.find(emp => emp.navn === value);
      console.log('Selected Employee:', selectedEmployee); // Logg den valgte ansatte
      console.log('ButikkID fra valgt ansatt:', selectedEmployee ? selectedEmployee.butikkid : 'Ingen butikkid funnet'); // Logg butikkid

      setFormData({
        ...formData,
        [name]: value,
        butikkid: selectedEmployee ? selectedEmployee.butikkid : '' // Sett butikkid basert på valgt ansatt
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Sjekk at ansatt er valgt
    if (!formData.Ansatt) {
      console.error('Ansatt er ikke valgt. Tjenesten kan ikke registreres uten ansatt.');
      return;
    }
  
    // Formater registrert dato
    const newService = {
      ...formData,
      serviceid: formData.serviceid, // Forsikre at serviceid er inkludert
      butikkid: Cookies.get('butikkid') || formData.butikkid,  // Inkluder butikkid i tjenesten
      registrertDato: new Date().toISOString(), // Bruker ISO-format for dato
      status: 'Aktiv', // Sett standard status
      endretdato: '', // Sett endretdato som tom
      test: 'test' // Inkluder test-feltet
    };
  
    console.log('Sender servicedata til server:', newService);
  
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });
  
      if (response.ok) {
        const addedService = await response.json();
        console.log('Suksess! Tjeneste lagt til:', addedService);
        navigate(`/service-details/${addedService._id}`); // Naviger til service-details med riktig ID
      } else {
        const responseText = await response.text();
        console.error('Feil ved registrering av tjeneste:', response.statusText, responseText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold mb-4">Registrer ny tjeneste</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Varemerke</label>
          <input
            type="text"
            name="Varemerke"
            value={formData.Varemerke}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Produkt</label>
          <input
            type="text"
            name="Produkt"
            value={formData.Produkt}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Størrelse</label>
          <input
            type="text"
            name="Størrelse"
            value={formData.Størrelse}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Farge</label>
          <input
            type="text"
            name="Farge"
            value={formData.Farge}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <input
            type="text"
            name="Beskrivelse"
            value={formData.Beskrivelse}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ansatt</label>
          <select
            name="ansatt"
            value={formData.Ansatt}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Velg en ansatt</option>
            {employees.map(employee => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Registrer Tjeneste
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateService;
