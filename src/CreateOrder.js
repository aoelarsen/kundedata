import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrder() {
  const { id } = useParams(); // Dette bruker kundens _id fra URL
  const navigate = useNavigate();

  // Sett standardverdier for feltene
  const [formData, setFormData] = useState({
    Varemerke: 'Nike',
    Produkt: 'Joggesko',
    Størrelse: '45',
    Farge: 'Blå',
    Status: 'Under behandling',
    Kommentar: 'Leveringsdato uavklart',
    Ansatt: 'Jonas Berg',
    Endretdato: new Date().toISOString().substring(0, 10), // Setter dagens dato som Endretdato
    RegistrertDato: new Date().toISOString().substring(0, 10), // Setter dagens dato som RegistrertDato
    kundeid: '', // Dette vil bli satt basert på customerNumber
    KundeTelefon: '' // Dette vil bli satt til kundens telefonnummer
  });

  // Håndterer endringer i inputfeltene
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Håndterer innsending av skjemaet
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newOrder = await response.json();
        console.log('Ny ordre opprettet:', newOrder);
        navigate(`/customer-details/${id}`);
      } else {
        console.error('Feil ved opprettelse av ordre:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Ny Ordre</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Varemerke</label>
        <input
          type="text"
          name="Varemerke"
          value={formData.Varemerke}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Produkt</label>
        <input
          type="text"
          name="Produkt"
          value={formData.Produkt}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Størrelse</label>
        <input
          type="text"
          name="Størrelse"
          value={formData.Størrelse}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Farge</label>
        <input
          type="text"
          name="Farge"
          value={formData.Farge}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <input
          type="text"
          name="Status"
          value={formData.Status}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kommentar</label>
        <input
          type="text"
          name="Kommentar"
          value={formData.Kommentar}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ansatt</label>
        <input
          type="text"
          name="Ansatt"
          value={formData.Ansatt}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Endretdato</label>
        <input
          type="date"
          name="Endretdato"
          value={formData.Endretdato}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">RegistrertDato</label>
        <input
          type="date"
          name="RegistrertDato"
          value={formData.RegistrertDato}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Opprett Ordre
      </button>
    </form>
  );
}

export default CreateOrder;
