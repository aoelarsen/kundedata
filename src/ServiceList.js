import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ServiceList() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/services');
        if (response.ok) {
          const data = await response.json();
          const filteredServices = data.filter(service => service.butikkid === butikkid);
          setServices(filteredServices);
        } else {
          console.error('Feil ved henting av tjenester:', response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };
    fetchServices();
  }, [butikkid]);

  const handleSelectService = (service) => {
    navigate(`/service-details/${service._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tjenester</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Beskrivelse</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Registrert Dato</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectService(service)}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.serviceid}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.beskrivelse}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.status}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.registrertDato}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServiceList;
