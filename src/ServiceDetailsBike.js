import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    beskrivelse: '',
    arbeid: [], // Liste over flere arbeid
    status: 'Aktiv',
    ansatt: '',
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
  });
  const [fixedPrices, setFixedPrices] = useState([]);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);


  const parseCustomDateString = (dateString) => {
    const parsedDate = parse(dateString, 'd.M.yyyy, HH:mm:ss', new Date());
    return isNaN(parsedDate) ? null : parsedDate;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Ukjent dato";
    const parsedDate = parseCustomDateString(dateString);
    return parsedDate ? format(parsedDate, 'd.M.yyyy HH:mm') : "Ugyldig dato";
  };

  // Hent fixedprices
  useEffect(() => {
    const fetchFixedPrices = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/fixedprices');
        if (response.ok) {
          const prices = await response.json();
          setFixedPrices(prices);
        }
      } catch (error) {
        console.error('Feil ved henting av fastpriser:', error);
      }
    };

    fetchFixedPrices();
  }, []);

  const handleAddWork = async (e) => {
    const selectedWork = fixedPrices.find(price => price._id === e.target.value);
    if (selectedWork) {
      const updatedWork = [...formData.arbeid, { title: selectedWork.title, price: selectedWork.price }];
  
      // Oppdater front-end
      setFormData((prevData) => ({
        ...prevData,
        arbeid: updatedWork,
      }));
  
      // Send oppdatering til serveren
      try {
        const updatedService = {
          arbeid: updatedWork,
        };
  
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedService),
        });
  
        if (!response.ok) {
          console.error('Feil ved oppdatering av arbeid:', response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    }
  };
  

  const calculateTotalPrice = () => {
    return formData.arbeid.reduce((total, work) => total + work.price, 0);
  };
  

  // Hent servicedetaljer
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`);
        if (response.ok) {
          const service = await response.json();
          setServiceDetails(service);
          setFormData({
            beskrivelse: service.Beskrivelse || '',
            arbeid: service.arbeid || [],
            status: service.status || 'Aktiv',
            ansatt: service.ansatt || '',
            Varemerke: service.Varemerke || '',
            Produkt: service.Produkt || '',
            Størrelse: service.Størrelse || '',
            Farge: service.Farge || '',
          });

          if (service.kundeid) {
            fetchCustomer(service.kundeid);
          }
        } else {
          console.error('Tjeneste ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av tjenesten:', error);
      }
    };

    const fetchCustomer = async (kundeid) => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers?customerNumber`);
        if (response.ok) {
          const customerData = await response.json();
          const customer = customerData.find(c => c.customerNumber === kundeid);
          if (customer) {
            setCustomer(customer);
          }
        }
      } catch (error) {
        console.error('Feil ved henting av kunden:', error);
      }
    };

    fetchService();
  }, [id]);

  // Hent ansatte
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        if (response.ok) {
          const employeesData = await response.json();
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error('Feil ved henting av ansatte:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRemoveWork = async (indexToRemove) => {
    const updatedWork = formData.arbeid.filter((_, index) => index !== indexToRemove);
  
    // Oppdater front-end
    setFormData((prevData) => ({
      ...prevData,
      arbeid: updatedWork,
    }));
  
    // Oppdatering til server
    try {
      const updatedService = {
        arbeid: updatedWork.map(work => ({ title: work.title, price: work.price })),
      };
  
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      });
  
      if (!response.ok) {
        console.error('Feil ved oppdatering av arbeid på serveren:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.beskrivelse.trim()) {
      setIsDescriptionEmpty(true); // Sett feilmelding hvis beskrivelsen er tom
      return; // Stopp innsendingen
    }

    setIsDescriptionEmpty(false); // Fjern feilmeldingen hvis beskrivelsen er utfylt

    const updatedService = {
      ...formData,
      Beskrivelse: formData.beskrivelse,
      arbeid: formData.arbeid.map(work => ({ title: work.title, price: work.price })),
      endretdato: new Date().toLocaleString('no-NO', { timeZone: 'Europe/Oslo' }),
    };

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      });

      if (response.ok) {
        setUpdateMessage('Tjenesten er oppdatert');
        if (customer) {
          navigate(`/customer-details/${customer._id}`);
        }
      } else {
        console.error('Feil ved oppdatering av tjeneste:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };



  const handlePrintLabel = () => {
    if (customer && serviceDetails) {
      const printWindow = window.open('', '', 'width=500,height=300');
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body {
                width: 90mm;
                height: 29mm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
              }
              .customer-name {
                font-size: 10px;
                text-align: center;
              }
              .service-id {
                font-size: 20px;
                text-align: center;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="customer-name">${customer.firstName} ${customer.lastName}</div>
            <div class="service-id">Servicenummer: ${serviceDetails.serviceid}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleSendSMS = () => {
    navigate('/sendsms', { state: { serviceDetails, customer } });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      {/* Dynamisk tittel med servicetype */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {serviceDetails?.servicetype ? `${serviceDetails.servicetype}` : 'Tjenestedetaljer'}
      </h2>

      {/* Vis registrert dato og endret dato øverst */}
      {serviceDetails && (
        <div className="mb-4">
          <p><strong>Registrert dato:</strong> {formatDateTime(serviceDetails.registrertDato)}</p>
          {serviceDetails.endretdato && (
            <p><strong>Endret dato:</strong> {formatDateTime(serviceDetails.endretdato)}</p>
          )}
        </div>
      )}

      {customer && (
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Kundedetaljer</h2>
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
          </div>
        </div>
      )}

      <div className="flex justify-between mb-6">
        <button
          onClick={handlePrintLabel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Skriv ut label (Servicenr: {serviceDetails?.serviceid})
        </button>

        <button
          onClick={handleSendSMS}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send SMS
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Velg arbeid fra listen */}
        <div className={`p-4 border ${isDescriptionEmpty ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
          <label className="block text-sm font-medium text-gray-700">Velg arbeid fra liste:</label>
          <select onChange={handleAddWork} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <option value="">Velg arbeid</option>
            {fixedPrices.map((price) => (
              <option key={price._id} value={price._id}>
                {price.title} - {price.price} kr
              </option>
            ))}
          </select>
          {formData.arbeid.length === 0 && (
            <p className="text-red-500 text-sm mt-2">Vennligst velg minst ett arbeid før du går videre.</p>
          )}
        </div>

        {/* Valgt arbeid */}
        <div className={`p-4 border ${formData.arbeid.length === 0 ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
  <label className="block text-sm font-medium text-gray-700">Valgt arbeid:</label>
  <ul>
    {formData.arbeid.map((item, index) => (
      <li key={index} className="flex justify-between items-center">
        <span>{item.title} - {item.price} kr</span>
        <button
          type="button"
          onClick={() => handleRemoveWork(index)}
          className="text-red-500 hover:text-red-700 ml-4"
        >
          Fjern
        </button>
      </li>
    ))}
  </ul>
  {formData.arbeid.length >= 2 && (
    <p className="text-lg font-bold mt-4">Totalsum arbeid med fastpris: {calculateTotalPrice()} kr <span className="font-normal">(eks. deler og annen kost)</span> </p>
  )}
  {formData.arbeid.length === 0 && (
    <p className="text-red-500 text-sm mt-2">Du må legge til arbeid.</p>
  )}
</div>



        {/* Beskrivelse */}
        <div className={`p-4 border ${isDescriptionEmpty ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse:</label>
          <textarea
            name="beskrivelse"
            value={formData.beskrivelse}
            onChange={handleChange}
            required
            rows="3"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md resize-y"
          />
          {isDescriptionEmpty && (
            <p className="text-red-500 text-sm mt-2">Du må legge til arbeid.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Varemerke:</label>
          <input
            type="text"
            name="Varemerke"
            value={formData.Varemerke}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Produkt:</label>
          <input
            type="text"
            name="Produkt"
            value={formData.Produkt}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Størrelse:</label>
          <input
            type="text"
            name="Størrelse"
            value={formData.Størrelse}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Farge:</label>
          <input
            type="text"
            name="Farge"
            value={formData.Farge}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Utført arbeid:</label>
          <textarea
            name="arbeid"
            value={formData.arbeid}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Aktiv">Aktiv</option>
            <option value="Avsluttet">Avsluttet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ansatt:</label>
          <select
            name="ansatt"
            value={formData.ansatt}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Velg ansatt</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          >
            Oppdater Tjeneste
          </button>
        </div>
        {updateMessage && <p className="text-green-500 text-center mt-4">{updateMessage}</p>}
      </form>
    </div>
  );
}

export default ServiceDetails;
