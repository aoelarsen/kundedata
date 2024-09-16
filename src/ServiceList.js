import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]); // State for filtrerte tjenester
  const [hoveredService, setHoveredService] = useState(null); // For å holde hover til beskrivelse
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Søkefelt
  const [statusFilter, setStatusFilter] = useState('Aktiv'); // Status-filter
  const navigate = useNavigate();
  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;
  const tableRef = useRef();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/services');
        if (response.ok) {
          const data = await response.json();

          // Filtrer tjenester basert på butikkid og status
          const filteredData = data.filter(service => service.butikkid === butikkid && service.status === statusFilter);
          setServices(filteredData);
          setFilteredServices(filteredData);
        } else {
          console.error('Feil ved henting av tjenester:', response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };
    fetchServices();
  }, [butikkid, statusFilter]);

  // Funksjon for å håndtere søk
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = services.filter(service =>
      service.serviceid.toString().includes(query) ||
      service.Varemerke.toLowerCase().includes(query) ||
      service.Produkt.toLowerCase().includes(query) ||
      service.Størrelse?.toLowerCase().includes(query) ||
      service.Farge?.toLowerCase().includes(query) ||
      service.beskrivelse?.toLowerCase().includes(query)
    );

    setFilteredServices(filtered);
  };

  // Funksjon for å håndtere valg av tjeneste
  const handleSelectService = (service) => {
    navigate(`/service-details/${service._id}`);
  };

  const handleMouseEnter = (service, event) => {
    setHoveredService(service);
    const tooltipX = event.clientX;
    const tooltipY = event.clientY + window.scrollY;
    setTooltipStyle({ left: tooltipX + 'px', top: tooltipY + 'px' });
  };

  const handleMouseLeave = () => {
    setHoveredService(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">Tjenester</h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="Aktiv">Aktiv</option>
          <option value="Avsluttet">Avsluttet</option>
        </select>
      </div>

      {/* Søkefelt */}
      <input
        type="text"
        placeholder="Søk etter ID, merke, produkt, størrelse, farge, eller beskrivelse"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      {/* Tabell for tjenester */}
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Merke</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Str.</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Farge</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Registrert Dato</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr
                key={service._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectService(service)}
                onMouseEnter={(event) => handleMouseEnter(service, event)}
                onMouseLeave={handleMouseLeave}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.serviceid}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.Varemerke}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.Produkt}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.Størrelse}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.Farge}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.status}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{formatDate(service.registrertDato)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tooltip for beskrivelse */}
        {hoveredService && (
          <div
            className="absolute bg-gray-200 border border-gray-400 rounded-lg shadow-lg p-2 text-sm z-10"
            style={tooltipStyle}
          >
            {hoveredService.beskrivelse ? hoveredService.beskrivelse : 'Ingen beskrivelse'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceList;
