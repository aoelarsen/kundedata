import React from 'react';
import { Link } from 'react-router-dom';

function CustomerList({ customers }) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Kunder</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Fornavn</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Etternavn</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Telefonnummer</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">E-post</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.firstName}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.lastName}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.phoneNumber}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.email}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">
                  <Link
                    to={`/customer-details/${customer.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Se detaljer
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
