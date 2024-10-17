import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import Cookies from 'js-cookie';

function SendSMS() {
  const location = useLocation();
  const { orderDetails, serviceDetails, customer } = location.state || {};
  const [customers, setCustomers] = useState([]);
  const [filteredSmsTemplates, setFilteredSmsTemplates] = useState([]);
  const [smsArchive, setSmsArchive] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    telefonnummer: customer?.phoneNumber || '',
    meldingstekst: '',
    kundeNavn: `${customer?.firstName || ''} ${customer?.lastName || ''}`,
  });

  // Hent butikknavn fra cookie
  const selectedStore = Cookies.get('selectedStore') || 'Ukjent butikk';

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

        // Filtrer SMS-maler basert på rute
        let filteredTemplates = data;
        if (orderDetails) {
          filteredTemplates = data.filter(template => template.type === 'ordre');
        } else if (serviceDetails) {
          filteredTemplates = data.filter(template => template.type === 'tjeneste');
        } else if (customer) {
          filteredTemplates = data.filter(template => template.type === 'kunde');
        }
        setFilteredSmsTemplates(filteredTemplates);
      } catch (error) {
        console.error('Feil ved henting av SMS-maler:', error);
      }
    };

    const fetchSmsArchive = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsarchives');
        const data = await response.json();
        setSmsArchive(data.reverse());
      } catch (error) {
        console.error('Feil ved henting av SMS-arkiv:', error);
      }
    };

    fetchCustomers();
    fetchSmsTemplates();
    fetchSmsArchive();
  }, [orderDetails, serviceDetails, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find(customer => customer._id === e.target.value);
    if (selectedCustomer) {
      setFormData((prevData) => ({
        ...prevData,
        telefonnummer: selectedCustomer.phoneNumber,
        kundeNavn: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      }));
    }
  };

  const handleSmsTemplateChange = (e) => {
    const selectedTemplate = filteredSmsTemplates.find(template => template._id === e.target.value);
    if (selectedTemplate) {
      let updatedMessage = selectedTemplate.tekst;

      // Erstatt %ordreid% hvis det finnes og vi har ordredata
      if (updatedMessage.includes('%ordreid%') && orderDetails) {
        updatedMessage = updatedMessage.replace('%ordreid%', orderDetails.ordreid);
      }

      // Erstatt %serviceid% hvis det finnes og vi har servicedata
      if (updatedMessage.includes('%serviceid%') && serviceDetails) {
        updatedMessage = updatedMessage.replace('%serviceid%', serviceDetails.serviceid);
      }

      // Erstatt %butikk% med butikknavn fra cookies
      if (updatedMessage.includes('%butikk%')) {
        updatedMessage = updatedMessage.replace('%butikk%', selectedStore);
      }

      setFormData((prevData) => ({
        ...prevData,
        meldingstekst: updatedMessage,
      }));
    }
  };

  t

  if (response.ok) {
    alert('SMS sendt og lagret i arkivet!');
    const updatedArchive = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsarchives');
    const updatedArchiveData = await updatedArchive.json();
    setSmsArchive(updatedArchiveData.reverse());

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

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};

const filteredSmsArchive = smsArchive.filter((sms) => {
  return (
    sms.kundeNavn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sms.telefonnummer.includes(searchTerm) ||
    sms.meldingstekst.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

const lastTenSms = filteredSmsArchive.slice(0, 5);

const formatDateTime = (dateString) => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
  } catch (error) {
    return 'Ukjent dato';
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
          {filteredSmsTemplates.map((template) => (
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

    {/* Søkefelt */}
    <div className="mt-8 mb-4">
      <input
        type="text"
        placeholder="Søk etter SMS (kunde, telefonnummer, melding)"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
    </div>

    <h3 className="text-2xl font-bold mb-4">Siste sendte SMS-er</h3>
    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Kunde</th>
          <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Telefonnummer</th>
          <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Meldingstekst</th>
          <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Sendt dato</th>
        </tr>
      </thead>
      <tbody>
        {lastTenSms.map((sms) => (
          <tr key={sms._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.kundeNavn || 'Ukjent'}</td>
            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.telefonnummer}</td>
            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{sms.meldingstekst}</td>
            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{formatDateTime(sms.sendtDato)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default SendSMS;
