import React from 'react';

function PrintInvoice({ serviceDetails, customer, formData, calculateTotalPrice, storeName }) {
  if (!customer || !serviceDetails) {
    return <p>Loading...</p>;  // Returner en melding mens dataene lastes
  }

  const totalWorkPrice = formData.arbeid.reduce((total, work) => total + work.price, 0);
  const totalPartsPrice = formData.deler.reduce((total, part) => total + part.price, 0);
  const totalPrice = totalWorkPrice + totalPartsPrice;

  return (
    <div className="print-invoice p-10 font-sans">
      {/* Logo and Store Name */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{storeName}</h1>

      {/* Kundeinfo */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Kunde:</h2>
          <p className="text-gray-600">{customer.firstName} {customer.lastName}</p>
          <p className="text-gray-600">Telefon: {customer.phoneNumber}</p>
          <p className="text-gray-600">E-post: {customer.email}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Servicenummer:</h2>
          <p className="text-gray-600">{serviceDetails.serviceid}</p>
          <p className="text-gray-600">Dato: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Arbeid */}
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Arbeid</h3>
      <table className="w-full table-auto mb-6 bg-white shadow-md rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Beskrivelse</th>
            <th className="p-3 text-right">Pris</th>
          </tr>
        </thead>
        <tbody>
          {formData.arbeid.map((work, index) => (
            <tr key={index} className="bg-gray-50 border-b hover:bg-gray-100">
              <td className="p-3 text-gray-700">{work.title}</td>
              <td className="p-3 text-right text-gray-700">{work.price} kr</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Deler */}
      <h3 className="text-xl font-semibold text-green-600 mb-4">Deler</h3>
      <table className="w-full table-auto mb-6 bg-white shadow-md rounded-lg">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3 text-left">Produkt</th>
            <th className="p-3 text-right">Pris</th>
          </tr>
        </thead>
        <tbody>
          {formData.deler.map((part, index) => (
            <tr key={index} className="bg-gray-50 border-b hover:bg-gray-100">
              <td className="p-3 text-gray-700">{part.product}</td>
              <td className="p-3 text-right text-gray-700">{part.price} kr</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Oppsummering */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Oppsummering</h3>
      <div className="text-gray-700 mb-6">
        <p>Arbeid: <span className="font-bold">{totalWorkPrice} kr</span></p>
        <p>Deler: <span className="font-bold">{totalPartsPrice} kr</span></p>
        <p className="text-lg font-bold">Totalpris: {totalPrice} kr</p>
      </div>

      {/* Kommentar */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Kommentar til arbeidet</h3>
      <p className="text-gray-700">{formData.utførtArbeid || "Ingen kommentarer til arbeidet."}</p>
    </div>
  );
}

export default PrintInvoice;
