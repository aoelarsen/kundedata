import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtrerte ordrer
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Legg til søkestate
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' }); // Legg til state for sortering
  const [statusFilter, setStatusFilter] = useState('Aktiv'); // Sett "Aktiv" som standardverdi for status-filter
  const navigate = useNavigate();
  const tableRef = useRef();

  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders');
        if (response.ok) {
          const data = await response.json();

          // Filtrer ordrer basert på valgt butikkid og status
          const filteredOrders = butikkid
            ? data.filter(order => order.butikkid === butikkid && order.Status === statusFilter)
            : data.filter(order => order.Status === statusFilter);

          setOrders(filteredOrders);
          setFilteredOrders(filteredOrders); // Sett initialt filtrerte ordrer til samme som alle ordrer
        } else {
          console.error('Feil ved henting av ordrer:', response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchOrders();
  }, [butikkid, statusFilter]); // Kjør på nytt når statusFilter endres

  // Funksjon for å håndtere søk
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = orders.filter(order =>
      (order.ordreid.toString().includes(query) ||
        order.Varemerke.toLowerCase().includes(query) ||
        order.Produkt.toLowerCase().includes(query) ||
        order.Størrelse?.toLowerCase().includes(query) ||
        order.Farge?.toLowerCase().includes(query) ||
        order.Kommentar?.toLowerCase().includes(query)) &&
      (statusFilter === '' || order.Status === statusFilter) // Inkluder status-filter
    );

    setFilteredOrders(filtered);
  };

  // Funksjon for å håndtere statusfilter
  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
  };

  // Funksjon for å sortere ordrer
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredOrders].sort((a, b) => {
      // Numerisk sortering for ID
      if (key === 'ordreid' || key === 'butikkid') {
        return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      }

      // Dato sortering for RegistrertDato
      if (key === 'RegistrertDato') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      }

      // Alfabetisk sortering for tekstfelter
      const valueA = a[key] ? a[key].toString().toLowerCase() : '';
      const valueB = b[key] ? b[key].toString().toLowerCase() : '';
      return direction === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    setFilteredOrders(sorted);
  };

  const handleSelectOrder = (order) => {
    navigate(`/order-details/${order._id}`);
  };

  const handleMouseEnter = (order, event) => {
    setHoveredOrder(order);

    const tooltipX = event.clientX;
    const tooltipY = event.clientY + window.scrollY;
    setTooltipStyle({ left: tooltipX + 'px', top: tooltipY + 'px' });
  };

  const handleMouseLeave = () => {
    setHoveredOrder(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">Ordre</h3>

        {/* Status-filter */}
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="Aktiv">Aktiv</option>
          <option value="Avsluttet">Avsluttet</option>
        </select>
      </div>

      {/* Søkefelt */}
      <input
        type="text"
        placeholder="Søk etter ID, merke, produkt, størrelse, farge, eller kommentar"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      <div className="overflow-x-auto" ref={tableRef}>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                onClick={() => handleSort('ordreid')}
              >
                ID {renderSortIndicator('ordreid')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                onClick={() => handleSort('Varemerke')}
              >
                Merke {renderSortIndicator('Varemerke')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                onClick={() => handleSort('Produkt')}
              >
                Produkt {renderSortIndicator('Produkt')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('Størrelse')}
              >
                Str. {renderSortIndicator('Størrelse')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('Farge')}
              >
                Farge {renderSortIndicator('Farge')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('Status')}
              >
                Status {renderSortIndicator('Status')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('Ansatt')}
              >
                Ansatt {renderSortIndicator('Ansatt')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('RegistrertDato')}
              >
                Registrert Dato {renderSortIndicator('RegistrertDato')}
              </th>
              <th
                className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell cursor-pointer"
                onClick={() => handleSort('butikkid')}
              >
                ButikkID {renderSortIndicator('butikkid')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectOrder(order)}
                onMouseEnter={(event) => handleMouseEnter(order, event)}
                onMouseLeave={handleMouseLeave}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.ordreid}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Størrelse}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Farge}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Status}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Ansatt}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{formatDate(order.RegistrertDato)}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.butikkid}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tooltip for kommentar */}
        {hoveredOrder && (
          <div
            className="absolute bg-gray-200 border border-gray-400 rounded-lg shadow-lg p-2 text-sm z-10"
            style={tooltipStyle}
          >
            {hoveredOrder.Kommentar ? hoveredOrder.Kommentar : 'Ingen kommentar'}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderList;
