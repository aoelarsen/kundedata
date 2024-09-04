import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function OrderDetails() {
  const { id } = useParams(); // Henter ordre-id fra URL
  const [formData, setFormData] = useState({
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Status: '',
    Kommentar: '',
    Ansatt: '',
  });
  const [employees, setEmployees] = useState([]); // For å holde ansatte data
  const [updateMessage, setUpdateMessage] = useState(''); // For å vise oppdateringsmelding

  // Hent ordredetaljer
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/${id}`);
        if (response.ok) {
          const order = await response.json();
          console.log('Ordre hentet:', order); // Legg til logging for å se ordredata
          setFormData({
            Varemerke: order.Varemerke,
            Produkt: order.Produkt,
            Størrelse: order.Størrelse,
            Farge: order.Farge,
            Status: order.Status || 'Aktiv', // Sett standardverdi til 'Aktiv' hvis ikke finnes
            Kommentar: order.Kommentar,
            Ansatt: order.Ansatt,
          });
        } else {
          console.error('Ordre ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av ordren:', error);
      }
    };

    fetchOrder();
  }, [id]);

  // Hent ansatte fra databasen
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        if (response.ok) {
          const employeesData = await response.json();
          console.log('Ansatte hentet:', employeesData); // Legg til logging for å se ansattdata
          setEmployees(employeesData);
        } else {
          console.error('Feil ved henting av ansatte');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedOrder = {
      ...formData,
      Endretdato: new Date().toISOString(), // Oppdaterer endret dato
    };

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/${id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        setUpdateMessage('Ordren er oppdatert'); // Viser bekreftelsesmelding
        console.log('Oppdatert ordre:', updatedOrder); // Logging av oppdateringen
      } else {
        console.error('Feil ved oppdatering av ordre:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Rediger Ordre</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Varemerke:</label>
          <input
            type="text"
            name="Varemerke"
            value={formData.Varemerke}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Produkt:</label>
          <input
            type="text"
            name="Produkt"
            value={formData.Produkt}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Størrelse:</label>
          <input
            type="text"
            name="Størrelse"
            value={formData.Størrelse}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Farge:</label>
          <input
            type="text"
            name="Farge"
            value={formData.Farge}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status:</label>
          <select
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Aktiv">Aktiv</option>
            <option value="Avsluttet">Avsluttet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kommentar:</label>
          <textarea
            name="Kommentar"
            value={formData.Kommentar}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ansatt:</label>
          <select
            name="Ansatt"
            value={formData.Ansatt}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Velg ansatt</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center mt-6">
          <button 
            type="submit" 
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          >
            Oppdater Ordre
          </button>
        </div>
        {updateMessage && <p className="text-green-500 text-center mt-4">{updateMessage}</p>}
      </form>
    </div>
  );
}

export default OrderDetails;
