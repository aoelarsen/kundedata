import React from 'react';
import { Link } from 'react-router-dom';

function CustomerList({ customers, deleteCustomer }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Kundeoversikt</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Fornavn</th>
            <th className="py-2 px-4 border-b text-left">Etternavn</th>
            <th className="py-2 px-4 border-b text-left">Telefonnummer</th>
            <th className="py-2 px-4 border-b text-left">E-post</th>
            <th className="py-2 px-4 border-b text-left">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50 transition duration-150">
              <td className="py-2 px-4 border-b text-left">{customer.firstName}</td>
              <td className="py-2 px-4 border-b text-left">{customer.lastName}</td>
              <td className="py-2 px-4 border-b text-left">{customer.phoneNumber}</td>
              <td className="py-2 px-4 border-b text-left">{customer.email}</td>
              <td className="py-2 px-4 border-b text-left">
                <Link
                  to={`/edit-customer/${customer.id}`}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2"
                >
                  Rediger
                </Link>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 mr-2"
                >
                  Slett
                </button>
                <Link
                  to={`/customer-details/${customer.id}`}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Detaljer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
