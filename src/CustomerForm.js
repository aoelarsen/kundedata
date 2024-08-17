import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerForm({ addCustomer, customers }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Finn den høyeste eksisterende ID
    const highestId = customers.length > 0 ? Math.max(...customers.map(c => parseInt(c.id, 10))) : 0;

    // Sett ID til én høyere enn den høyeste eksisterende ID
    const newCustomer = {
      ...formData,
      id: highestId + 1,
      registrationDate: new Date().toLocaleString(),
      lastModified: new Date().toLocaleString()
    };

    try {
      console.log('Sender data til server:', newCustomer);
      
      // Send en POST-forespørsel til JSON-serveren
      const response = await fetch('http://localhost:5000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        const addedCustomer = await response.json();
        console.log('Suksess! Kunde lagt til:', addedCustomer);
        addCustomer(addedCustomer);
        navigate(`/customer-details/${addedCustomer.id}`);
      } else {
        console.error('Feil ved registrering av kunde:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Fornavn</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Etternavn</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Telefonnummer</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">E-post</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Registrer Kunde
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
