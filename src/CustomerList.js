import React from 'react';

function CustomerList({ customers }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Kunder</h2>
      <ul className="bg-white p-4 rounded shadow-md">
        {customers.map(customer => (
          <li key={customer.id} className="mb-2 p-2 border-b border-gray-200">
            <div>
              <strong>{customer.firstName} {customer.lastName}</strong>
            </div>
            <div>Telefonnummer: {customer.phoneNumber}</div>
            <div>Epost: {customer.email}</div>
            <div>Registreringsdato: {customer.registrationDate}</div>
            <div>Sist endret: {customer.lastModified}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;
