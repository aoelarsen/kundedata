import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function CreateService() {
  const { customerNumber } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]); // State for tjenestetyper
  const [formData, setFormData] = useState({
    type: '',
    Varemerke: '',
    Produkt: '',
    Størrelse: '',
    Farge: '',
    Beskrivelse: '',
    ansatt: Cookies.get('selectedEmployee') || '',
    butikkid: Cookies.get('butikkid') || '',
    kundeid: parseInt(customerNumber, 10),
    serviceid: '',
    test: 'test'
  });

  // Hent siste service-ID, ansatte og tjenestetyper når komponenten laster inn
  useEffect(() => {
    const fetchLastServiceId = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/last-service-id');
        const data = await response.json();
        const lastServiceId = parseInt(data.lastServiceId, 10);
        const nextServiceId = isNaN(lastServiceId) ? 1 : lastServiceId + 1;

        setFormData(prevData => ({
          ...prevData,
          serviceid: nextServiceId
        }));
      } catch (error) {
        console.error('Feil ved henting av siste service-ID:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Feil ved henting av ansatte:', error);
      }
    };

    const fetchServiceTypes = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/servicetypes');
        const data = await response.json();
        setServiceTypes(data); // Sett tjenestetyper fra API-et
      } catch (error) {
        console.error('Feil ved henting av tjenestetyper:', error);
      }
    };

    fetchLastServiceId();
    fetchEmployees();
    fetchServiceTypes(); // Hent tjenestetyper
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'ansatt') {
      const selectedEmployee = employees.find(emp => emp.navn === value);
      setFormData({
        ...formData,
        [name]: value,
        butikkid: selectedEmployee ? selectedEmployee.butikkid : ''
      });

      Cookies.set('selectedEmployee', value);
      if (selectedEmployee && selectedEmployee.butikkid) {
        Cookies.set('butikkid', selectedEmployee.butikkid);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ansatt) {
      console.error('Ansatt er ikke valgt. Tjenesten kan ikke registreres uten ansatt.');
      return;
    }

    if (!formData.type) {
      console.error('Tjenestetype er ikke valgt. Tjenesten kan ikke registreres uten tjenestetype.');
      return;
    }

    const newService = {
      ...formData,
      serviceid: formData.serviceid,
      butikkid: Cookies.get('butikkid') || formData.butikkid,
      registrertDato: new Date().toLocaleString('no-NO', { timeZone: 'Europe/Oslo' }),
      status: 'Aktiv',
      endretdato: '',
      servicetype: formData.type // Sender tjenestetype til serveren
    };

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        const addedService = await response.json();
        navigate(`/service-details/${addedService._id}`);
      } else {
        const responseText = await response.text();
        console.error('Feil ved registrering av tjeneste:', response.statusText, responseText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };


  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold mb-4">Registrer ny tjeneste</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type tjeneste</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Velg en tjeneste</option>
            {serviceTypes.length > 0 && serviceTypes.map(serviceType => (
              <option key={serviceType._id} value={serviceType.type}>
                {serviceType.type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Varemerke</label>
          <input
            type="text"
            name="Varemerke"
            value={formData.Varemerke}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Produkt</label>
          <input
            type="text"
            name="Produkt"
            value={formData.Produkt}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Størrelse</label>
          <input
            type="text"
            name="Størrelse"
            value={formData.Størrelse}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Farge</label>
          <input
            type="text"
            name="Farge"
            value={formData.Farge}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <input
            type="text"
            name="Beskrivelse"
            value={formData.Beskrivelse}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ansatt</label>
          <select
            name="ansatt"
            value={formData.ansatt}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Velg en ansatt</option>
            {employees.map(employee => (
              <option key={employee._id} value={employee.navn}>
                {employee.navn}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Registrer Tjeneste
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateService;
