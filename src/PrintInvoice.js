import React, { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import logo from './images/logo.png';

// Funksjon for å generere strekkode
const Barcode = ({ ean }) => {
  const [barcodeSrc, setBarcodeSrc] = useState('');

  useEffect(() => {
    if (/^\d{13}$/.test(ean)) {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, ean, { format: 'EAN13', displayValue: false });

      setBarcodeSrc(canvas.toDataURL('image/png'));
    }
  }, [ean]);

  return barcodeSrc ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img src={barcodeSrc} alt="EAN strekkode" style={{ height: '30px', display: 'block' }} />
    </div>
  ) : (
    ean
  );
};

function PrintInvoice({ serviceDetails, customer, formData, calculateTotalPrice, storeName }) {
  if (!customer || !serviceDetails) {
    return <p>Loading...</p>;
  }

  const totalWorkPrice = formData.arbeid.reduce((total, work) => total + work.price, 0);
  const totalPartsPrice = formData.deler.reduce((total, part) => total + part.price, 0);
  const totalPrice = totalWorkPrice + totalPartsPrice;

  return (
    <div className="print-invoice p-2 font-sans">
      {/* CSS for utskrift */}
      <style>
        {`
          @media print {
            thead th {
              background-color: #e5e7eb !important; /* Lysegrå bakgrunn for tittelraden */
              color: #000 !important; /* Svart tekst for tittelraden */
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            h3 {
              color: #000 !important; /* Svart farge for overskrifter */
            }
          }
        `}
      </style>
      {/* Kundeinfo og Servicenummer */}
      <div className="border border-gray-300 p-2 mb-4">
        <div className="flex justify-between">
          <div className="w-1/2">
            <p className="text-gray-600">{customer.firstName} {customer.lastName}</p>
            <p className="text-gray-600">Telefon: {customer.phoneNumber}</p>
            <p className="text-gray-600">E-post: {customer.email}</p>
            <h2 className="text-l font-semibold text-gray-700">Artikkel: {formData.Varemerke} {formData.Produkt}</h2>

          </div>
          <div className="w-1/2 flex flex-col items-end">
            <img src={logo} alt="Butikklogo" className="w-30 h-auto mb-4" />
            <p className="text-gray-600">Dato: {new Date().toLocaleDateString()}</p>
            <h2 className="text-xl font-semibold text-gray-700">Servicenummer: {serviceDetails.serviceid}</h2>
          </div>
        </div>
      </div>

      {/* Arbeid */}
      {formData.arbeid.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-black mb-4">Arbeid</h3>
          <table className="w-full table-auto mb-6">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="p-2 text-left">Beskrivelse</th>
                <th className="p-2 text-right">Pris</th>
              </tr>
            </thead>
            <tbody>
              {formData.arbeid.map((work, index) => (
                <tr key={index} className="bg-gray-50 border-b">
                  <td className="p-2 text-gray-700">{work.title}</td>
                  <td className="p-2 text-right text-gray-700">{work.price} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Deler */}
      {formData.deler.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-black mb-4">Deler</h3>
          <table className="w-full table-auto mb-6">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="p-2 text-left">Varemerke</th>
                <th className="p-2 text-left">Produkt</th>
                <th className="p-2 text-left">EAN</th>
                <th className="p-2 text-right">Pris</th>
              </tr>
            </thead>
            <tbody>
              {formData.deler.map((part, index) => (
                <tr key={index} className="bg-gray-50 border-b">
                  <td className="p-2 text-gray-700">{part.brand}</td>
                  <td className="p-2 text-gray-700">{part.product}</td>
                  <td className="p-2 text-gray-700 text-center">
                    {part.ean && part.ean.length === 13 ? <Barcode ean={part.ean} /> : part.ean}
                  </td>
                  <td className="p-2 text-right text-gray-700">{part.price} kr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Kommentar og Oppsummering */}
      <div className="flex justify-between mb-4">
        {/* Kommentar */}
        <div className="border border-gray-300 p-2 w-2/3 mr-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Kommentar til arbeidet</h3>
          <p className="text-gray-700" style={{ whiteSpace: 'pre-line' }}>
            {formData.utførtArbeid || "Ingen kommentarer til arbeidet."}
          </p>
        </div>

        {/* Oppsummering */}
        <div className="w-1/3">
          <table className="w-full table-auto">
            <tbody>
              <tr className="border-b">
                <td className="p-2 text-left">Arbeid:</td>
                <td className="p-2 text-right">{totalWorkPrice} kr</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 text-left">Deler:</td>
                <td className="p-2 text-right">{totalPartsPrice} kr</td>
              </tr>
              <tr className="font-bold">
                <td className="p-2 text-left">Totalpris:</td>
                <td className="p-2 text-right">{totalPrice} kr</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrintInvoice;
