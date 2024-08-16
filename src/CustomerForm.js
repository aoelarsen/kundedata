import React, { useState, useEffect } from 'react';

function CustomerForm({ addCustomer, phoneNumber }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: phoneNumber || '',
    email: ''
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      phoneNumber: phoneNumber || ''
    }));
  }, [phoneNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomer(formData);
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    });
  };

  return (
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
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          pattern="[0-9]{8}"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">E-post:</label>
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
          Legg til kunde
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
