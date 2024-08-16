import React from 'react';
import { Link } from 'react-router-dom';

function CustomerList({ customers, deleteCustomer }) {
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/customers/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        deleteCustomer(id); // Oppdaterer tilstanden i App.js etter sletting
      } else {
        console.error('Feil ved sletting av kunde');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Kundeoversikt</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Fornavn</th>
            <th className="py-2 px-4 border-b">Etternavn</th>
            <th className="py-2 px-4 border-b">Telefonnummer</th>
            <th className="py-2 px-4 border-b">E-post</th>
            <th className="py-2 px-4 border-b">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-2 px-4 border-b">{customer.firstName}</td>
                <td className="py-2 px-4 border-b">{customer.lastName}</td>
                <td className="py-2 px-4 border-b">{customer.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{customer.email}</td>
                <td className="py-2 px-4 border-b">
                  <Link 
                    to={`/edit-customer/${customer.id}`}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Rediger
                  </Link>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-500 text-white px-4 py-1 ml-2 rounded hover:bg-red-600"
                  >
                    Slett
                  </button>
                  <Link 
                    to={`/customer-details/${customer.id}`}
                    className="bg-green-500 text-white px-4 py-1 ml-2 rounded hover:bg-green-600"
                  >
                    Detaljer
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">Ingen kunder funnet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
