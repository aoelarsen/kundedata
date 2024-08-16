import React from 'react';
import { Link } from 'react-router-dom';

function CustomerList({ customers, deleteCustomer }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Kundeoversikt</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Fornavn</th>
              <th className="py-2 px-4 border-b">Etternavn</th>
              {/* Disse feltene vil være skjult på mobil */}
              <th className="py-2 px-4 border-b hidden md:table-cell">Telefonnummer</th>
              <th className="py-2 px-4 border-b hidden md:table-cell">E-post</th>
              <th className="py-2 px-4 border-b">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-2 px-4 border-b text-sm">{customer.firstName}</td>
                <td className="py-2 px-4 border-b text-sm">{customer.lastName}</td>
                {/* Disse feltene vil være skjult på mobil */}
                <td className="py-2 px-4 border-b text-sm hidden md:table-cell">{customer.phoneNumber}</td>
                <td className="py-2 px-4 border-b text-sm hidden md:table-cell">{customer.email}</td>
                <td className="py-2 px-4 border-b text-sm flex flex-col md:flex-row md:space-x-2">
                  <Link 
                    to={`/edit-customer/${customer.id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded mb-2 md:mb-0 hover:bg-blue-600 text-center"
                  >
                    Rediger
                  </Link>
                  <button 
                    onClick={() => deleteCustomer(customer.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mb-2 md:mb-0 hover:bg-red-600 text-center"
                  >
                    Slett
                  </button>
                  <Link 
                    to={`/customer-details/${customer.id}`}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-center"
                  >
                    Detaljer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerList;