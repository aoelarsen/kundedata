import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ServiceDetails() {
  const { id } = useParams(); // Henter _id fra URL (MongoDB ObjectId)
  const navigate = useNavigate(); // For navigering
  const [formData, setFormData] = useState({
    beskrivelse: '',
    status: '',
    ansatt: '',
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
  });
  const [customer, setCustomer] = useState(null); // For å holde kundedetaljer
  const [serviceDetails, setServiceDetails] = useState(null); // For å holde servicedetaljer fra API
  const [employees, setEmployees] = useState([]); // For å holde ansatte data
  const [updateMessage, setUpdateMessage] = useState(''); // For å vise oppdateringsmelding

  // Hent servicedetaljer
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`);
        if (response.ok) {
          const service = await response.json();
          setServiceDetails(service);
          setFormData({
            beskrivelse: service.Beskrivelse,
            status: service.status || 'Aktiv',
            ansatt: service.ansatt,
            Varemerke: service.Varemerke,
            Produkt: service.Produkt,
            Størrelse: service.Størrelse,
            Farge: service.Farge,
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

  // Hent ansatte fra databasen
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedService = {
      ...formData,
      endretdato: new Date().toISOString(), // Oppdaterer endret dato
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

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Tjenestedetaljer</h2>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {serviceDetails && (
          <div>
            <p><strong>ID:</strong> {serviceDetails._id}</p>
          </div>
        )}
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
          <label className="block text-sm font-medium text-gray-700">Beskrivelse:</label>
          <input
            type="text"
            name="beskrivelse"
            value={formData.beskrivelse}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
