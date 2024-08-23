import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Sørg for at begge disse er importert

function OrderList({ orders }) {
  const navigate = useNavigate();

  const handleSelectOrder = (order) => {
    navigate(`/order-details/${order._id}`); // Ruter til OrderDetails-siden med MongoDB ObjectId
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Ordrer 1</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Varemerke</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Størrelse</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Farge</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order._id} // Sørg for at du bruker _id som nøkkel
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectOrder(order)}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Størrelse}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Farge}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Status}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">
                  <Link
                    to={`/order-details/${order._id}`} // Sørg for at du bruker _id her også
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

export default OrderList; // Sørg for at OrderList eksporteres korrekt
