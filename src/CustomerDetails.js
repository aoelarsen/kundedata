import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CustomerDetails() {
  const { id } = useParams(); // Dette vil nå referere til _id fra MongoDB
  const [customer, setCustomer] = useState(null);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/customers/${id}`);
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

  useEffect(() => {
    fetchCustomer();
  }, [id]);

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
            <th className="py-2 px-4 border-b">Telefonnummer</th>
            <td className="py-2 px-4 border-b">{customer.phoneNumber}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Epost</th>
            <td className="py-2 px-4 border-b">{customer.email}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Registrert dato</th>
            <td className="py-2 px-4 border-b">{customer.registrationDate}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 border-b">Sist endret</th>
            <td className="py-2 px-4 border-b">{customer.lastModified}</td>
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
    </div>
  );
}

export default CustomerDetails;
