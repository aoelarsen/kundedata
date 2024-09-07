import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // For å håndtere cookies

function CreateOrder() {
  const { customerNumber } = useParams(); // Hent customerNumber fra URL
  const navigate = useNavigate();
  
  // State for å lagre ansatte
  const [employees, setEmployees] = useState([]);
  
  // State for å lagre ordredetaljer inkludert valgt ansatt
  const [formData, setFormData] = useState({
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Kommentar: '',
    Ansatt: Cookies.get('selectedEmployee') || '', // Sett valgt ansatt fra cookies hvis tilgjengelig
    kundeid: parseInt(customerNumber, 10), // Konverter customerNumber til et tall
    ordreid: '', // Nytt felt for ordre ID
    test: 'test' // Inkluder test-feltet
  });

  // Hent siste ordre-ID når komponenten laster inn
  useEffect(() => {
    const fetchLastOrderId = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/last-order-id');
        const data = await response.json();
        const lastOrderId = parseInt(data.lastOrderId, 10);
        const nextOrderId = isNaN(lastOrderId) ? 1 : lastOrderId + 1;

        setFormData(prevData => ({
          ...prevData,
          ordreid: nextOrderId // Lagre ordrenummer i ordreid
        }));
      } catch (error) {
        console.error('Feil ved henting av siste ordre-ID:', error);
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

    fetchLastOrderId();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOrder = {
      ...formData,
      ordreid: formData.ordreid, // Forsikre at ordreid er inkludert
      registrertDato: new Date().toLocaleString(), // Sett registrertDato til nåværende tidspunkt
      status: 'Aktiv', // Sett standard status
      endretdato: '', // Sett endretdato som tom
      test: 'test' // Inkluder test-feltet
    };

    console.log('Sender ordredata til server:', newOrder);

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        const addedOrder = await response.json();
        console.log('Suksess! Ordre lagt til:', addedOrder);
        navigate(`/order-details/${addedOrder._id}`); // Naviger til order-details med riktig ID
      } else {
        const responseText = await response.text();
        console.error('Feil ved registrering av ordre:', response.statusText, responseText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registrer ny ordre</h2>
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
          <label className="block text-sm font-medium text-gray-700">Kommentar</label>
          <input
            type="text"
            name="Kommentar"
            value={formData.Kommentar}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ansatt</label>
          <select
            name="Ansatt"
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
            Registrer Ordre
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;
