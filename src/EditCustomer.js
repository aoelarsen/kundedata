import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns'; // Importer date-fns for formatering

function EditCustomer() {
  const { id } = useParams(); // Fanger opp id fra URL-en
  const navigate = useNavigate(); // Brukes til å navigere programmatisk
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  // Dette vil kjøres når komponenten laster
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers/${id}`);
        if (response.ok) {
          const customer = await response.json();
          setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
          });
        } else {
          console.error('Kunde ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av kunden:', error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCustomer = {
      ...formData,
      lastModified: new Date().toISOString(), // Bruker ISO-strengformat for dato når vi lagrer
    };

    console.log("Oppdaterer kunde med ID:", id);
    console.log("Oppdaterer kunde med data:", updatedCustomer);

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers/${id}`, {
        method: 'PATCH', // Endret fra PUT til PATCH for delvis oppdatering
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (response.ok) {
        console.log('Kunde oppdatert!');
        // Hvis oppdateringen er vellykket, rutes til CustomerDetails
        navigate(`/customer-details/${id}`);
      } else {
        console.error('Feil ved oppdatering av kunde:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Rediger Kunde</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fornavn:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Etternavn:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefonnummer:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Epost:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="text-center">
          <button 
            type="submit" 
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          >
            Lagre endringer
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCustomer;
