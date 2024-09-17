import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { format } from 'date-fns'; // Importer format-funksjonen fra date-fns

function OrderDetails() {
  const { id } = useParams(); // Henter _id fra URL (MongoDB ObjectId)
  const navigate = useNavigate(); // For navigering
  const [formData, setFormData] = useState({
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Status: '',
    Kommentar: '',
    Ansatt: '',
  });
  const [customer, setCustomer] = useState(null); // For å holde kundedetaljer
  const [orderDetails, setOrderDetails] = useState(null); // For å holde ordredetaljer fra API
  const [employees, setEmployees] = useState([]); // For å holde ansatte data
  const [updateMessage, setUpdateMessage] = useState(''); // For å vise oppdateringsmelding

  // Funksjon for å formatere datoen
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yy, HH:mm');
  };

  // Hent ordredetaljer
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/${id}`);
        if (response.ok) {
          const order = await response.json();
          console.log('Ordre hentet:', order);
          setOrderDetails(order); // Setter ordredata til state
          setFormData({
            Varemerke: order.Varemerke,
            Produkt: order.Produkt,
            Størrelse: order.Størrelse,
            Farge: order.Farge,
            Status: order.Status || 'Aktiv',
            Kommentar: order.Kommentar,
            Ansatt: order.Ansatt,
          });

          // Hent kundedetaljer basert på kundeid fra ordren
          if (order.kundeid) {
            fetchCustomer(order.kundeid);
          }
        } else {
          console.error('Ordre ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av ordren:', error);
      }
    };

    const fetchCustomer = async (kundeid) => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers?customerNumber`);
        if (response.ok) {
          const customerData = await response.json();  // Forventer en liste av kunder
          const customer = customerData.find(c => c.customerNumber === kundeid);

          if (customer) {
            setCustomer(customer);
            console.log(`Kunde hentet: ${kundeid} ${customer.firstName} ${customer.lastName}`);
          } else {
            console.error('Kunde med dette customerNumber ble ikke funnet');
          }
        } else {
          console.error('API-svaret var ikke vellykket');
        }
      } catch (error) {
        console.error('Feil ved henting av kunden:', error);
      }
    };

    fetchOrder();
  }, [id]);

  // Hent ansatte fra databasen
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        if (response.ok) {
          const employeesData = await response.json();
          console.log('Ansatte hentet:', employeesData);
          setEmployees(employeesData);
        } else {
          console.error('Feil ved henting av ansatte');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedOrder = {
      ...formData,
      Endretdato: new Date().toISOString(), // Oppdaterer endret dato
    };

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        setUpdateMessage('Ordren er oppdatert');
        console.log('Oppdatert ordre:', updatedOrder);

        // Naviger til kundedetaljer etter oppdatering
        if (customer) {
          navigate(`/customer-details/${customer._id}`); // Naviger til kundedetaljer
        }
      } else {
        console.error('Feil ved oppdatering av ordre:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  // Funksjon for å skrive ut labelen
  const handlePrintLabel = () => {
    if (customer && orderDetails) {
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
              .order-id {
                font-size: 20px;
                text-align: center;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="customer-name">${customer.firstName} ${customer.lastName}</div>
            <div class="order-id">Ordrenummer: ${orderDetails.ordreid}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Funksjon for å navigere til SendSMS.js
  const handleSendSMS = () => {
    // Naviger til SendSMS.js med ordre- og kundedetaljer
    navigate('/sendsms', { state: { orderDetails, customer } });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Kundeordre</h2>
{/* Vis registrert og endret dato */}
{orderDetails && (
        <div className="mb-6">
          <p><strong>Registrert dato:</strong> {formatDate(orderDetails.RegistrertDato)}</p>
          {orderDetails.Endretdato && (
            <p><strong>Endret dato:</strong> {formatDate(orderDetails.Endretdato)}</p>
          )}
        </div>
      )}

      {customer && (
        <div className="bg-gray-100 p-6 rounded-lg mb-6 relative">
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

      {/* Flytt knappene her, rett under det grå feltet */}
      <div className="flex justify-between mb-6">
        <button
          onClick={handlePrintLabel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Skriv ut label (Ordrenr: {orderDetails?.ordreid})
        </button>

        <button
          onClick={handleSendSMS}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send SMS
        </button>
      </div>

      {/* Resten av skjemaet for ordreoppdatering */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ordreredigeringsskjema */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Varemerke:</label>
          <input
            type="text"
            name="Varemerke"
            value={formData.Varemerke}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Produkt:</label>
          <input
            type="text"
            name="Produkt"
            value={formData.Produkt}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Størrelse:</label>
          <input
            type="text"
            name="Størrelse"
            value={formData.Størrelse}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Farge:</label>
          <input
            type="text"
            name="Farge"
            value={formData.Farge}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status:</label>
          <select
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Aktiv">Aktiv</option>
            <option value="Avsluttet">Avsluttet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kommentar:</label>
          <textarea
            name="Kommentar"
            value={formData.Kommentar}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ansatt:</label>
          <select
            name="Ansatt"
            value={formData.Ansatt}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            Oppdater Ordre
          </button>
        </div>
        {updateMessage && <p className="text-green-500 text-center mt-4">{updateMessage}</p>}
      </form>
    </div>
  );
}

export default OrderDetails;
