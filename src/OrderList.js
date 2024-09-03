import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Sørg for at begge disse er importert

function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data); // Setter state med alle ordrene
        } else {
          console.error('Feil ved henting av ordrer:', response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchOrders(); // Kall funksjonen når komponenten laster
  }, []); // Tom avhengighetsliste for å kjøre denne koden kun én gang

  const handleSelectOrder = (order) => {
    navigate(`/order-details/${order._id}`); // Ruter til OrderDetails-siden med MongoDB ObjectId
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">

    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Ordre</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Merke</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Str.</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Farge</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order._id} // Sørg for at du bruker _id som nøkkel
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectOrder(order)}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.ordreid}</td> {/* Viser orderNumber */}
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Størrelse}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Farge}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Status}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm hidden md:table-cell">
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
    </div>
  );
}

export default OrderList; // Sørg for at OrderList eksporteres korrekt
