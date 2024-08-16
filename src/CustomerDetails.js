import React from 'react';

function CustomerDetails({ customer }) {
  if (!customer) {
    return <h2>Kunde ikke funnet</h2>;
  }

  return (
    <div>
      <h2>Kundedetaljer</h2>
      <p><strong>Fornavn:</strong> {customer.firstName}</p>
      <p><strong>Etternavn:</strong> {customer.lastName}</p>
      <p><strong>Telefonnummer:</strong> {customer.phoneNumber}</p>
      <p><strong>Epost:</strong> {customer.email || 'Ikke registrert'}</p>
      <p><strong>Registreringsdato:</strong> {customer.registrationDate}</p>
      <p><strong>Sist endret:</strong> {customer.lastModified}</p>
    </div>
  );
}

export default CustomerDetails;
