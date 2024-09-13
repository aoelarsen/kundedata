import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importer useLocation for å hente state fra navigering

function SendSMS() {
  const location = useLocation(); // Henter state fra navigering
  const { orderDetails, customer } = location.state || {}; // Hent ordre- og kundedetaljer
  const [customers, setCustomers] = useState([]);
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [smsArchive, setSmsArchive] = useState([]); // Lagrer arkiv over sendte meldinger
  const [formData, setFormData] = useState({
    telefonnummer: customer?.phoneNumber || '', // Sett telefonnummer fra kunden
    meldingstekst: '',
    kundeNavn: `${customer?.firstName || ''} ${customer?.lastName || ''}`, // Sett kundenavn
  });

  // Hent kunder, SMS-maler og sendte SMS-er fra databasen ved oppstart
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Feil ved henting av kunder:', error);
      }
    };

    const fetchSmsTemplates = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smstemplates');
        const data = await response.json();
        setSmsTemplates(data);
      } catch (error) {
        console.error('Feil ved henting av SMS-maler:', error);
      }
    };

    const fetchSmsArchive = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsarkiv');
        const data = await response.json();
        setSmsArchive(data.reverse()); // Lagrer siste meldinger øverst
      } catch (error) {
        console.error('Feil ved henting av SMS-arkiv:', error);
      }
    };

    fetchCustomers();
    fetchSmsTemplates();
    fetchSmsArchive(); // Hent SMS-arkiv
  }, []);

  // Håndterer endringer i inputfeltene
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Oppdater telefonnummer når en kunde velges
  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find(customer => customer._id === e.target.value);
    if (selectedCustomer) {
      setFormData((prevData) => ({
        ...prevData,
        telefonnummer: selectedCustomer.phoneNumber,
        kundeNavn: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`, // Legger til kundenavn
      }));
    }
  };

  // Oppdater meldingstekst når en SMS-mal velges, og erstatt %ordreid% med det faktiske ordrenummeret
  const handleSmsTemplateChange = (e) => {
    const selectedTemplate = smsTemplates.find(template => template._id === e.target.value);
    if (selectedTemplate) {
      let updatedMessage = selectedTemplate.tekst;

      // Sjekk om %ordreid% er i SMS-malen, og erstatt den med det faktiske ordrenummeret
      if (updatedMessage.includes('%ordreid%') && orderDetails) {
        updatedMessage = updatedMessage.replace('%ordreid%', orderDetails.ordreid);
      }

      setFormData((prevData) => ({
        ...prevData,
        meldingstekst: updatedMessage,
      }));
    }
  };

  // Håndterer innsending av skjema
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsarkiv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Sender telefonnummer, meldingstekst og kundeNavn
      });

      if (response.ok) {
        alert('SMS sendt og lagret i arkivet!');

        // Oppdater SMS-arkivet ved å hente de siste meldingene på nytt
        const updatedArchive = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsarkiv');
        const updatedArchiveData = await updatedArchive.json();
        setSmsArchive(updatedArchiveData.reverse()); // Oppdaterer tabellen med siste meldinger øverst

        setFormData({
          telefonnummer: '',
          meldingstekst: '',
          kundeNavn: '',
        });
      } else {
        console.error('Feil ved sending av SMS');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Send SMS</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Velg Kunde</label>
          <select value={customer?._id || ''} onChange={handleCustomerChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">Velg en kunde</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.firstName} {customer.lastName} - {customer.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefonnummer</label>
          <input
            type="tel"
            name="telefonnummer"
            value={formData.telefonnummer}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Skriv inn telefonnummer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Velg SMS-mal</label>
          <select onChange={handleSmsTemplateChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">Velg en SMS-mal</option>
            {smsTemplates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.tittel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meldingstekst</label>
          <textarea
            name="meldingstekst"
            value={formData.meldingstekst}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Skriv inn meldingsteksten"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Send SMS
          </button>
        </div>
      </form>

      {/* Tabell for å vise sendte SMS-er */}
      <h3 className="text-2xl font-bold mt-8 mb-4">Siste sendte SMS-er</h3>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Kunde</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Telefonnummer</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Meldingstekst</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Sendt dato</th>
          </tr>
        </thead>
        <tbody>
          {smsArchive.map((sms) => (
            <tr key={sms._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.kundeNavn || 'Ukjent'}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.telefonnummer}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.meldingstekst}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.sendtDato}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SendSMS;
