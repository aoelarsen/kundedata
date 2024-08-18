import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderList from './OrderList';

function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/customers/${id}`);
      if (response.ok) {
        const customerData = await response.json();
        setCustomer(customerData);
      } else {
        console.error('Kunde ble ikke funnet');
      }
    } catch (error) {
      console.error('Feil ved henting av kunden:', error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (!customer) {
    return <p className="text-red-500 text-center mt-4">Kunde ikke funnet</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">Kundedetaljer</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-medium text-gray-600">Fornavn:</p>
          <p className="text-xl text-gray-900">{customer.firstName}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Etternavn:</p>
          <p className="text-xl text-gray-900">{customer.lastName}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Telefonnummer:</p>
          <p className="text-xl text-gray-900">{customer.phoneNumber}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Epost:</p>
          <p className="text-xl text-gray-900">{customer.email}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Registrert dato:</p>
          <p className="text-xl text-gray-900">{customer.registrationDate}</p>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-600">Sist endret:</p>
          <p className="text-xl text-gray-900">{customer.lastModified}</p>
        </div>
      </div>
      <div className="text-center mt-8">
        <Link 
          to={`/edit-customer/${customer.id}`} 
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Endre Kunde
        </Link>
      </div>

      <hr className="my-8" />

      <OrderList customerId={customer.id} />
    </div>
  );
}

export default CustomerDetails;
