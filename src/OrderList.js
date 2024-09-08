import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [hoveredOrderId, setHoveredOrderId] = useState(null); // For å holde styr på hvilken ordre som er hoveret over
  const [tooltipPosition, setTooltipPosition] = useState('top-full'); // Standard posisjon for tooltip
  const navigate = useNavigate();
  const tableRef = useRef(); // Referanse til tabellen for å beregne posisjon

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data); // Setter state med alle ordrene
        } else {
          console.error('Feil ved henting av ordrer:', response.statusText);
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    };

    fetchOrders(); // Kall funksjonen når komponenten laster
  }, []); // Tom avhengighetsliste for å kjøre denne koden kun én gang

  const handleSelectOrder = (order) => {
    navigate(`/order-details/${order._id}`); // Ruter til OrderDetails-siden med MongoDB ObjectId
  };

  const handleMouseEnter = (orderId, event) => {
    setHoveredOrderId(orderId); // Sett hover til ordren som er hoveret over

    // Beregn posisjonen for tooltipen
    const rowRect = event.currentTarget.getBoundingClientRect();
    const tableRect = tableRef.current.getBoundingClientRect();
    
    if (rowRect.bottom > tableRect.bottom - 50) {
      setTooltipPosition('bottom-full'); // Plasser tooltipen over raden hvis den er nær bunnen
    } else {
      setTooltipPosition('top-full'); // Plasser tooltipen under raden hvis det er plass
    }
  };

  const handleMouseLeave = () => {
    setHoveredOrderId(null); // Fjern hover når musen forlater
  };

  // Funksjon for å formatere dato til DD.MM.YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Ordre</h3>
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg relative">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Merke</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Str.</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Farge</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Ansatt</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Registrert Dato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id} // Sørg for at du bruker _id som nøkkel
                  className="hover:bg-gray-50 cursor-pointer relative"
                  onClick={() => handleSelectOrder(order)}
                  onMouseEnter={(event) => handleMouseEnter(order._id, event)} // Når vi hover over en rad
                  onMouseLeave={handleMouseLeave} // Når vi forlater en rad
                >
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.ordreid}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Størrelse}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Farge}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Status}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Ansatt}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">
                    {formatDate(order.RegistrertDato)}
                  </td>

                  {/* Tooltip for kommentar */}
                  {hoveredOrderId === order._id && (
                    <div className={`absolute left-0 ${tooltipPosition} mt-1 p-2 w-64 bg-gray-200 border border-gray-400 rounded-lg shadow-lg z-10`}>
                      <p className="text-sm text-gray-700">{order.Kommentar ? order.Kommentar : 'Ingen kommentar'}</p>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
