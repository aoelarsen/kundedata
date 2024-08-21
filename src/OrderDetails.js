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
  const [updateMessage, setUpdateMessage] = useState(''); // For å vise oppdateringsmelding

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/orders/${id}`);
        if (response.ok) {
          const order = await response.json();
          setFormData({
            Varemerke: order.Varemerke,
            Produkt: order.Produkt,
            Størrelse: order.Størrelse,
            Farge: order.Farge,
            Status: order.Status,
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
  }, [id]); // Kjører på nytt når `id` endrer seg

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
      const response = await fetch(`http://localhost:5000/orders/${id}`, {
        method: 'PATCH', // Endret fra PUT til PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        setUpdateMessage('Ordren er oppdatert'); // Viser bekreftelsesmelding
      } else {
        console.error('Feil ved oppdatering av ordre:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 bg-white shadow-lg rounded-lg p-6">
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
          <input
            type="text"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
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
          <input
            type="text"
            name="Ansatt"
            value={formData.Ansatt}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
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
