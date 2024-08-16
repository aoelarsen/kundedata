import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CustomerList({ customers, deleteCustomer }) {
  const navigate = useNavigate();

  if (!customers || customers.length === 0) {
    return <p className="text-red-500">Ingen kunder funnet</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Kundeoversikt</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Fornavn</th>
            <th className="py-2 px-4 border-b">Etternavn</th>
            <th className="py-2 px-4 border-b">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border-b">{customer.firstName}</td>
              <td className="py-2 px-4 border-b">{customer.lastName}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button 
                  onClick={() => navigate(`/customer-details/${customer.id}`)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Detaljer
                </button>
                <button 
                  onClick={() => navigate(`/edit-customer/${customer.id}`)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Rediger
                </button>
                <button 
                  onClick={() => deleteCustomer(customer.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Slett
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
