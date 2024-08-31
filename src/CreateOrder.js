import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrder() {
  const { customerNumber } = useParams(); // Hent customerNumber fra URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Kommentar: '',
    Ansatt: '',
    kundeid: parseInt(customerNumber, 10), // Konverter customerNumber til et tall
    ordreid: '' // Nytt felt for ordre ID
  });

  useEffect(() => {
    // Når komponenten lastes inn, hent den siste ordre-ID-en fra serveren
    const fetchLastOrderId = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/last-order-id');
        const data = await response.json();
        const lastOrderId = parseInt(data.lastOrderId, 10); // Parse the last order ID as an integer
        const nextOrderId = isNaN(lastOrderId) ? 1 : lastOrderId + 1; // If NaN, start at 1

        console.log('Neste ordre nummer generert:', nextOrderId); // Log for verification
        setFormData(prevData => ({
          ...prevData,
          ordreid: nextOrderId // Store the next order number in ordreid
        }));
      } catch (error) {
        console.error('Feil ved henting av siste ordre-ID:', error);
      }
    };

    fetchLastOrderId();
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

    console.log('Sender ordredata til server:', newOrder); // Logg dataen før sending

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
        const responseText = await response.text(); // Gir mer detaljert feilinfo
        console.error('Feil ved registrering av ordre:', response.statusText, responseText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registrer Ny Ordre</h2>
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
          <input
            type="text"
            name="Ansatt"
            value={formData.Ansatt}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ordre ID</label>
          <input
            type="text"
            name="ordreid"
            value={formData.ordreid}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
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
