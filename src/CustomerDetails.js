import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Importer Link og useNavigate

function CustomerDetails() {
  const { id } = useParams(); // Dette vil nå referere til _id fra MongoDB
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]); // Legg til state for ordrer
  const navigate = useNavigate(); // Brukes til å navigere programmatisk

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers/${id}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
        } else {
          console.error('Kunde ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av kunden:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders?kundeid=${id}`);
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
    fetchOrders(); // Hent ordrer når komponenten lastes
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Ukjent dato";
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('no-NO', options);
  };

  if (!customer) {
    return <p className="text-red-500 text-center mt-4">Kunde ikke funnet</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Kundedetaljer</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <tbody>
          <tr>
            <th className="py-2 px-4 border-b">Fornavn</th>
            <td className="py-2 px-4 border-b">{customer.firstName}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Etternavn</th>
            <td className="py-2 px-4 border-b">{customer.lastName}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Telefon</th>
            <td className="py-2 px-4 border-b">{customer.phoneNumber}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Epost</th>
            <td className="py-2 px-4 border-b">{customer.email}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Registrert</th>
            <td className="py-2 px-4 border-b">{formatDate(customer.registrationDate)}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Sist endret</th>
            <td className="py-2 px-4 border-b">{formatDate(customer.lastModified)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between mt-8">
        <div>
          <Link 
            to={`/create-order/${customer._id}`} // Endret til _id
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 mr-2"
          >
            Opprett Ordre
          </Link>
          <Link 
            to={`/create-service/${customer._id}`} // Endret til _id
            className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600"
          >
            Opprett Service
          </Link>
        </div>
        <Link 
          to={`/edit-customer/${customer._id}`} // Endret til _id
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Endre Kunde
        </Link>
      </div>

      {/* Legg til seksjon for å vise kundens ordrer */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Kundens Ordrer</h3>
        {orders.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Varemerke</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Størrelse</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Farge</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Registrert dato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/order-details/${order._id}`)} // Ruter til OrderDetails-siden
                >
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Størrelse}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Farge}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Status}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{formatDate(order.RegistrertDato)}</td>
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
