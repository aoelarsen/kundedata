import React from 'react';
import { useParams } from 'react-router-dom';

function CustomerDetails({ customers }) {
  const { id } = useParams();
  const customer = customers.find(cust => cust.id.toString() === id);

  if (!customer) {
    return <p>Kunde ikke funnet</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kundedetaljer</h2>
      <p><strong>Fornavn:</strong> {customer.firstName}</p>
      <p><strong>Etternavn:</strong> {customer.lastName}</p>
      <p><strong>Telefonnummer:</strong> {customer.phoneNumber}</p>
      <p><strong>E-post:</strong> {customer.email}</p>
      <p><strong>Registrert dato:</strong> {customer.registrationDate}</p>
      <p><strong>Sist endret:</strong> {customer.lastModified}</p>
    </div>
  );
}

export default CustomerDetails;
