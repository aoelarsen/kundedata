import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns'; // Importer date-fns for formatering

import Cookies from 'js-cookie'; // Importer Cookies for å hente butikkid

function CustomerDetails() {
  const { id } = useParams(); // Dette vil nå referere til _id fra MongoDB
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]); // Ny state for tjenester
  const [smsArchive, setSmsArchive] = useState([]); // Lagrer SMS-er sendt til kunden
  const [hoveredOrder, setHoveredOrder] = useState(null); // For å holde styr på hvilken ordre som er hoveret over
  const [tooltipStyle, setTooltipStyle] = useState({}); // Style for tooltip plassering
  const navigate = useNavigate();

  // Hent butikkid fra cookies
  const butikkid = Cookies.get('butikkid') || null;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customers/${id}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
          fetchOrders(customerData.customerNumber);
          fetchServices(customerData.customerNumber); // Hent tjenester for denne kunden
          fetchSmsArchive(customerData.phoneNumber); // Hent SMS-er for denne kunden
        } else {
          console.error('Kunde ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av kunden:', error);
      }
    };

    const fetchOrders = async (customerNumber) => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders?kundeid=${customerNumber}`);
        if (response.ok) {
          let ordersData = await response.json();
          
          // Filtrer ordrer basert på butikkid
          if (butikkid) {
            ordersData = ordersData.filter(order => order.butikkid === parseInt(butikkid, 10));
          }

          ordersData = ordersData.sort((a, b) => new Date(b.RegistrertDato) - new Date(a.RegistrertDato));
          setOrders(ordersData);
        } else {
          console.error('Ordre ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av ordrer:', error);
      }
    };

    const fetchServices = async (customerNumber) => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services?kundeid=${customerNumber}`);
        if (response.ok) {
          let servicesData = await response.json();

          // Filtrer tjenester basert på butikkid
          if (butikkid) {
            servicesData = servicesData.filter(service => service.butikkid === parseInt(butikkid, 10));
          }

          servicesData = servicesData.sort((a, b) => new Date(b.RegistrertDato) - new Date(a.RegistrertDato));
          setServices(servicesData);
        } else {
          console.error('Tjenester ble ikke funnet');
        }
      } catch (error) {
        console.error('Feil ved henting av tjenester:', error);
      }
    };

    const fetchSmsArchive = async (phoneNumber) => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsarchives?telefonnummer=${phoneNumber}`);
        if (response.ok) {
          const smsData = await response.json();
          setSmsArchive(smsData.sort((a, b) => new Date(b.sendtDato) - new Date(a.sendtDato)));
        } else {
          console.error('Ingen SMS-er funnet for dette telefonnummeret');
        }
      } catch (error) {
        console.error('Feil ved henting av SMS-arkiv:', error);
      }
    };

    fetchCustomer();
  }, [id, butikkid]);

  // Resten av komponenten forblir den samme...


  // Formaterer dato til "dd.MM.yy, HH:mm"
  const formatDateTime = (dateString) => {
    try {
      if (!dateString) return 'Ukjent dato'; // Håndterer tomme eller ugyldige datoer
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Ugyldig dato'; // Håndterer ugyldige datoer
      return format(date, 'dd.MM.yy, HH:mm'); // Formaterer gyldig dato
    } catch (error) {
      console.error('Feil ved formatering av dato:', error);
      return 'Ukjent dato';
    }
  };
  

  const handleMouseEnter = (order, event) => {
    setHoveredOrder(order); // Sett hover til ordren som er hoveret over
    const tooltipX = event.clientX;
    const tooltipY = event.clientY + window.scrollY; // Legg til scroll-offset for riktig plassering
    setTooltipStyle({ left: tooltipX + 'px', top: tooltipY + 'px' });
  };

  const handleMouseLeave = () => {
    setHoveredOrder(null); // Fjern hover når musen forlater
  };

  if (!customer) {
    return <p className="text-red-500 text-center mt-4">Kunde ikke funnet</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
    
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Kundedetaljer</h2>
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
        <div>
          <span className="font-semibold">Registrert dato: </span>
          {formatDateTime(customer.registrationDate)}
          {customer.lastModified && (
            <span className="text-gray-600">
              {' '}({formatDateTime(customer.lastModified)})
            </span>
          )}
        </div>
      </div>
      <Link
        to={`/edit-customer/${customer._id}`}
        className="text-blue-500 mt-4 block hover:underline"
      >
        Endre Kunde
      </Link>
    </div>

    {/* Knappene plassert med mer plass over */}
    <div className="flex justify-between items-center mt-8 mb-6">
      <div className="flex space-x-4">
        <Link
          to={`/create-order/${customer.customerNumber}`}
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Ny Ordre
        </Link>
        <Link
          to={`/create-service/${customer.customerNumber}`}
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Ny Service
        </Link>
      </div>
      <Link
  to={{
    pathname: '/sendsms',
  }}
  state={{ customer }} // Send customer data to SendSMS component
  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
>
  Send SMS
</Link>

    </div>
      {/* SMS Historikk */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Sendte SMS-er</h3>
        {smsArchive.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg relative">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Meldingstekst</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Sendt dato</th>
              </tr>
            </thead>
            <tbody>
              {smsArchive
                .filter((sms) => sms.telefonnummer === customer.phoneNumber)
                .map((sms) => (
                  <tr key={sms._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{sms.meldingstekst}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{formatDateTime(sms.sendtDato)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Ingen SMS-er sendt til dette telefonnummeret.</p>
        )}
      </div>

      {/* Ordrer */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Kundens Ordrer</h3>
        {orders.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg relative">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Merke</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Str.</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Farge</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Registrert dato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/order-details/${order._id}`)}
                  onMouseEnter={(event) => handleMouseEnter(order, event)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.ordreid}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Varemerke}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{order.Produkt}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Størrelse}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Farge}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{order.Status}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{formatDateTime(order.RegistrertDato)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Ingen ordrer funnet for denne kunden.</p>
        )}
      </div>



      {/* Kundens Tjenester */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Kundens Tjenester</h3>
        {services.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg relative">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Merke</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Str.</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Farge</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Registrert dato</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/service-details/${service._id}`)}
                  onMouseEnter={(event) => handleMouseEnter(service, event, 'service')}
                  onMouseLeave={handleMouseLeave}
                >
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.serviceid}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.Varemerke}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{service.Produkt}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.Størrelse}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.Farge}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{service.status}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{formatDateTime(service.registrertDato)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Ingen tjenester funnet for denne kunden.</p>
        )}
      </div>



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
  );
}

export default CustomerDetails;
