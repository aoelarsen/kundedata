import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function CustomerDetails() {
  const { id } = useParams(); // Dette vil nå referere til _id fra MongoDB
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers/${id}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
          fetchOrders(customerData.customerNumber);
        } else {
          console.error('Kunde ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av kunden:', error);
      }
    };

    const fetchOrders = async (customerNumber) => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders?kundeid=${customerNumber}`);
        if (response.ok) {
          const ordersData = await response.json();
          setOrders(ordersData);
        } else {
          console.error('Ordre ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av ordrer:', error);
      }
    };
    
    fetchCustomer();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Ukjent dato";
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('no-NO', options);
  };

  if (!customer) {
    return <p className="text-red-500 text-center mt-4">Kunde ikke funnet</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Kundedetaljer</h2>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Navn: </span>
            {customer.firstName} {customer.lastName}
          </div>
          <div>
            <span className="font-semibold">Telefonnummer: </span>
            {customer.phoneNumber}
          </div>
          <div>
            <span className="font-semibold">Epost: </span>
            {customer.email}
          </div>
          <div>
            <span className="font-semibold">Registrert dato: </span>
            {formatDate(customer.registrationDate)} 
            {customer.lastModified && (
              <span className="text-gray-600">
                {' '}({formatDate(customer.lastModified)})
              </span>
            )}
          </div>
        </div> 
                <Link 
    to={`/edit-customer/${customer._id}`}
    className="text-blue-500 mt-4 block hover:underline "
  >
    Endre Kunde
  </Link>
        </div>
        <div className="flex justify-between mt-8">
          <Link 
            to={`/create-order/${customer.customerNumber}`}
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Ny Ordre
          </Link>

       
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Kundens Ordrer</h3>
        {orders.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Merke</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Str.</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Farge</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Registrert dato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/order-details/${order._id}`)}
                >
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.ordreid}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Størrelse}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Farge}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Status}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{formatDate(order.RegistrertDato)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Ingen ordrer funnet for denne kunden.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetails;
