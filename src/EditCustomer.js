import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditCustomer({ customers }) {
  const { id } = useParams(); // Fanger opp id fra URL-en
  const navigate = useNavigate(); // Brukes til å navigere programmatisk
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });

  // Dette vil kjøres når komponenten laster, og når `customers` endres
  useEffect(() => {
    const customer = customers.find((cust) => cust.id.toString() === id); // Sammenligner som streng
    console.log("Fetching customer with ID:", id, "Type of ID:", typeof id);
    console.log("Customer found:", customer); // Debugging
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
      });
    }
  }, [id, customers]);

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
      lastModified: new Date().toLocaleString(),
    };

    console.log("Oppdaterer kunde med ID:", id);
    console.log("Oppdaterer kunde med data:", updatedCustomer);

    try {
      const response = await fetch(`http://localhost:5000/customers/${id}`, {
        method: 'PUT',
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
