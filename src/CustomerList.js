import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Sørg for at Link er importert

function CustomerList({ customers }) {
  const navigate = useNavigate();

  const handleSelectCustomer = (customer) => {
    navigate(`/customer-details/${customer._id}`); // Ruter til CustomerDetails-siden med MongoDB ObjectId
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Kunder</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Fornavn</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Etternavn</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Telefon</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">E-post</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr 
                key={customer._id} // Endret til _id
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectCustomer(customer)}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.firstName}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.lastName}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{customer.phoneNumber}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{customer.email}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm hidden md:table-cell">
                  <Link
                    to={`/customer-details/${customer._id}`} // Endret til _id
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
