import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerForm({ addCustomer, customers, phoneNumber, setSearchQuery }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    customerNumber: '', // Nytt felt for kundenummer
    status: 'aktiv' // Nytt felt for status, satt til 'aktiv' som standard
  });

  const [errorMessage, setErrorMessage] = useState(''); // For feilmelding
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      phoneNumber: phoneNumber // Setter telefonnummer hvis det er satt
    }));
  }, [phoneNumber]);

  useEffect(() => {
    // Filtrer ut kunder uten et gyldig customerNumber og beregn neste tilgjengelige kundenummer
    const validCustomers = customers.filter(c => typeof c.customerNumber === 'number' && !isNaN(c.customerNumber));
    const nextCustomerNumber = validCustomers.length > 0 ? Math.max(...validCustomers.map(c => c.customerNumber)) + 1 : 1;

    setFormData((prevData) => ({
      ...prevData,
      customerNumber: nextCustomerNumber // Sett kundenummer
    }));

    console.log('Neste tilgjengelige kundenummer:', nextCustomerNumber); // Logging for feilsøking
  }, [customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'phoneNumber' && value.length === 8) {
      // Sjekk om telefonnummeret allerede er registrert
      const existingCustomer = customers.find(customer => customer.phoneNumber === value);
      if (existingCustomer) {
        setErrorMessage('Kunde er allerede registrert.');
        setSearchQuery(value); // Oppdaterer søkefeltet med telefonnummeret
      } else {
        setErrorMessage(''); // Fjern feilmelding hvis nummeret ikke er registrert
        setSearchQuery(''); // Tøm søkefeltet
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sjekk om telefonnummeret har nøyaktig 8 sifre
    if (formData.phoneNumber.length !== 8 || !/^\d{8}$/.test(formData.phoneNumber)) {
      setErrorMessage('Telefonnummer må være nøyaktig 8 sifre.');
      return;
    }

    // Hvis det er en feil, skal man ikke tillate innsending
    if (errorMessage) {
      return;
    }

    const newCustomer = {
      ...formData,
      registrationDate: new Date().toLocaleString(),
      lastModified: new Date().toLocaleString()
    };

    try {
      console.log('Sender data til server:', newCustomer); // Logging for å se data før sending

      // Send en POST-forespørsel til MongoDB Atlas
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers', {
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
        navigate(`/customer-details/${addedCustomer._id}`); // Bruker MongoDBs genererte _id
      } else {
        console.error('Feil ved registrering av kunde:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Registrer Ny Kunde</h2>
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
        {errorMessage && <p className="text-red-500 text-sm mt-1 mb-1">{errorMessage}</p>}
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <input
          type="text"
          name="status"
          value={formData.status}
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
  </div>
  );
}

export default CustomerForm;
