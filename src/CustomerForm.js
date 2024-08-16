import React, { useState } from 'react';



function CustomerForm({ addCustomer, customers = [] }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = '';

    if (!formData.firstName) newErrors = 'Fornavn er obligatorisk';
    if (!formData.lastName) newErrors = 'Etternavn er obligatorisk';

    if (!formData.phoneNumber) {
      newErrors = 'Telefonnummer er obligatorisk';
    } else if (!/^\d{8}$/.test(formData.phoneNumber)) {
      newErrors = 'Telefonnummeret må inneholde nøyaktig 8 sifre';
    } else if (customers.some(c => c.phoneNumber === formData.phoneNumber)) {
      newErrors = 'Kunde er registrert tidligere';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (formErrors) {
      setErrors(formErrors);
      return;
    }

    const newCustomer = {
      ...formData,
      id: Date.now(),
      registrationDate: new Date().toLocaleString(),
      lastModified: new Date().toLocaleString()
    };

    try {
      const response = await fetch('http://localhost:5000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        addCustomer(newCustomer);
        setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
        setErrors('');
      } else {
        console.error('Feil ved registrering av kunde');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <div>
        <label className="block text-gray-700">Fornavn:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Etternavn:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Telefonnummer:</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
        {errors && <p className="text-red-500 text-sm">{errors}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Epost:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Registrer
      </button>
    </form>
  );
}

export default CustomerForm;
