import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CustomerDetails({ customers }) {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerData = customers.find((cust) => cust.id.toString() === id);
    console.log("Fetching customer with ID:", id);
    if (customerData) {
      setCustomer(customerData);
    } else {
      console.error('Kunde ble ikke funnet');
    }
  }, [id, customers]);

  if (!customer) {
    return <p className="text-red-500 text-center mt-4">Kunde ikke funnet</p>;
  }

  return (
    <div className="max-w-lg mx-auto py-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Kundedetaljer</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Fornavn:</span>
          <span className="text-gray-900">{customer.firstName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Etternavn:</span>
          <span className="text-gray-900">{customer.lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Telefonnummer:</span>
          <span className="text-gray-900">{customer.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Epost:</span>
          <span className="text-gray-900">{customer.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Registrert dato:</span>
          <span className="text-gray-900">{customer.registrationDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Sist endret:</span>
          <span className="text-gray-900">{customer.lastModified}</span>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
