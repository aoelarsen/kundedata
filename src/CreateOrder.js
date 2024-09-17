import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

function CreateOrder() {
  const { customerNumber } = useParams(); 
  const navigate = useNavigate();
  
  const [employees, setEmployees] = useState([]);

  // State for å lagre ordredetaljer inkludert valgt ansatt og butikkid
  const [formData, setFormData] = useState({
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Kommentar: '',
    Ansatt: Cookies.get('selectedEmployee') || '', 
    butikkid: Cookies.get('butikkid') || '', 
    kundeid: parseInt(customerNumber, 10), 
    ordreid: '', 
  });

  useEffect(() => {
    const fetchLastOrderId = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/last-order-id');
        const data = await response.json();
        const lastOrderId = parseInt(data.lastOrderId, 10);
        const nextOrderId = isNaN(lastOrderId) ? 1 : lastOrderId + 1;

        setFormData(prevData => ({
          ...prevData,
          ordreid: nextOrderId 
        }));
      } catch (error) {
        console.error('Feil ved henting av siste ordre-ID:', error);
      }
    };

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

    if (name === 'Ansatt') {
      const selectedEmployee = employees.find(emp => emp.navn === value);
      setFormData({
        ...formData,
        [name]: value,
        butikkid: selectedEmployee ? selectedEmployee.butikkid : '' 
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

    const newOrder = {
      ...formData,
      ordreid: formData.ordreid,
      butikkid: Cookies.get('butikkid') || formData.butikkid,
      registrertDato: new Date().toISOString(), // Lagre i ISO-format
      status: 'Aktiv', 
      endretdato: '', 
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
        navigate(`/order-details/${addedOrder._id}`); 
      } else {
        const responseText = await response.text();
        console.error('Feil ved registrering av ordre:', response.statusText, responseText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
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
    </div>
  );
}

export default CreateOrder;
