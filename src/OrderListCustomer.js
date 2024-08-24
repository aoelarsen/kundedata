import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderList({ customerId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders?kundeid=${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  if (loading) {
    return <p>Laster ordrer...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center text-lg text-gray-600">Ingen ordre er registrert for denne kunden.</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('no-NO', options);
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Ordrer</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Ordre ID</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Varemerke</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Størrelse</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Farge</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Registrert Dato</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.id}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Størrelse}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Farge}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{formatDate(order.RegistrertDato)}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Status}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">
                  <Link
                    to={`/order-details/${order.id}`}
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

export default OrderList;
