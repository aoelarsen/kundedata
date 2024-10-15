import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    beskrivelse: '',
    arbeid: [], // Liste over flere arbeid
    deler: [], // Ny array for deler
    utførtArbeid: '', // Kommentarer for utført arbeid
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
  const [isEditable, setIsEditable] = useState(false);
  const [customWork, setCustomWork] = useState({ title: '', price: '' }); // Nytt state for egendefinert arbeid
  const [customPart, setCustomPart] = useState({ ean: '', brand: '', product: '', price: '', discount: '' });
  const [parts, setParts] = useState([]); // State for lagring av alle deler
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParts, setFilteredParts] = useState([]);

  // Funksjon for å filtrere deler basert på søk, minimum 2 bokstaver
  const handleSearchParts = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue.length >= 2) {
      const filtered = parts.filter(
        (part) =>
          part.ean.toLowerCase().includes(searchValue) ||
          part.product.toLowerCase().includes(searchValue) ||
          part.brand.toLowerCase().includes(searchValue)
      );
      setFilteredParts(filtered);
    } else {
      setFilteredParts([]); // Fjern treff hvis søket er kortere enn 2 bokstaver
    }
  };

  // Funksjon for å legge til del
  const handleAddPartToWork = async (selectedPart) => {
    const updatedParts = [...formData.deler, selectedPart];

    setFormData((prevData) => ({
      ...prevData,
      deler: updatedParts,
    }));

    // Oppdater backend
    try {
      const updatedService = { deler: updatedParts };
      await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      });
    } catch (error) {
      console.error('Feil ved oppdatering av deler:', error);
    }
  };



  // Hent deler fra serveren (nytt useEffect)
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/parts');
        if (!response.ok) {
          throw new Error(`Feil ved henting av deler: ${response.statusText}`);
        }
        const partsData = await response.json();
        setParts(partsData); // Sett delene i state
      } catch (error) {
        console.error("Feil ved henting av deler:", error);
      }
    };

    fetchParts();
  }, []);




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

  // Hent deler fra serveren (nytt useEffect)
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/parts'); // URL til serveren din
        if (!response.ok) {
          throw new Error(`Feil ved henting av deler: ${response.statusText}`);
        }
        const partsData = await response.json();
        setParts(partsData); // Sett delene i state
        console.log("Deler hentet:", partsData); // Legg til logging her
      } catch (error) {
        console.error("Feil ved henting av deler:", error); // Logg eventuelle feil
      }
    };

    fetchParts();
  }, []);


  const handleAddWork = async (e) => {
    const selectedWork = fixedPrices.find(price => price._id === e.target.value);
    if (selectedWork) {

      console.log("Selected work description:", selectedWork.description); // Logg beskrivelsen

      // Legg til title, price, og description i arbeid-arrayen
      const updatedWork = [...formData.arbeid, {
        title: selectedWork.title,
        price: selectedWork.price,
        description: selectedWork.description || "Ingen beskrivelse tilgjengelig" // Bruk description eller fallback
      }];

      setFormData((prevData) => ({
        ...prevData,
        arbeid: updatedWork, // Oppdaterer arbeid med title, price, og description
      }));

      // Send oppdatering til backend inkludert description
      try {
        const updatedService = {
          arbeid: updatedWork.map(work => ({
            title: work.title,
            price: work.price,
            description: work.description  // Inkluderer beskrivelse i oppdateringen
          })),
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




  const handleCopyWork = (indexToCopy) => {
    const selectedWork = formData.arbeid[indexToCopy];

    console.log("Copying description:", selectedWork.description); // Logg beskrivelsen

    // Bruk beskrivelsen hvis tilgjengelig
    const descriptionToCopy = selectedWork.description;

    // Hvis descriptionToCopy er undefined eller tom, fall tilbake til tittel
    const newUtførtArbeid = `${descriptionToCopy ? descriptionToCopy : "Ingen beskrivelse tilgjengelig"}\n\n${formData.utførtArbeid}`.trim();

    // Oppdater utførtArbeid-feltet med ny kommentar øverst
    setFormData((prevData) => ({
      ...prevData,
      utførtArbeid: newUtførtArbeid, // Legger til valgt arbeid sin beskrivelse i utført arbeid-feltet
    }));

    console.log("Updated utførtArbeid:", newUtførtArbeid); // Logg den oppdaterte verdien
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
            deler: service.deler || [], // Endret her for å hente delene fra service
            utførtArbeid: service.utførtArbeid || '',  // Hent utførtArbeid
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




  const handleSaveFields = async () => {
    const updatedFields = {
      Varemerke: formData.Varemerke,
      Produkt: formData.Produkt,
      Størrelse: formData.Størrelse,
      Farge: formData.Farge,
    };

    console.log("Lagrer følgende felt i databasen:", updatedFields);

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        console.log('Oppdatering vellykket');
        setUpdateMessage('Produktinfo oppdatert');
      } else {
        console.error('Feil ved oppdatering av produktinfo:', response.statusText);
        console.log('Response status:', response.status);
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

    // Opprett et objekt med de oppdaterte dataene som skal sendes til backend
    const updatedService = {
      Beskrivelse: formData.beskrivelse,
      arbeid: formData.arbeid.map(work => ({ title: work.title, price: work.price })),
      utførtArbeid: formData.utførtArbeid, // Inkluderer "Utført arbeid"
      Varemerke: formData.Varemerke, // Oppdater Varemerke
      Produkt: formData.Produkt, // Oppdater Produkt
      Størrelse: formData.Størrelse, // Oppdater Størrelse
      Farge: formData.Farge, // Oppdater Farge
      status: formData.status, // Oppdater Status
      ansatt: formData.ansatt, // Oppdater Ansatt
      endretdato: new Date().toLocaleString('no-NO', { timeZone: 'Europe/Oslo' }) // Legg til endringsdato
    };

    console.log('Oppdaterer tjeneste med data:', updatedService); // Logger oppdaterte data

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService), // Send oppdaterte felter til backend
      });

      if (response.ok) {
        setUpdateMessage('Tjenesten er oppdatert');
        // Fjern navigate funksjonen slik at brukeren forblir på samme side
      } else {
        console.error('Feil ved oppdatering av tjeneste:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };


  // Legg til egendefinert arbeid
  const handleAddCustomWork = async () => {
    if (customWork.title && customWork.price) {
      const updatedWork = [...formData.arbeid, { title: customWork.title, price: parseFloat(customWork.price) }];

      // Oppdater front-end
      setFormData((prevData) => ({ ...prevData, arbeid: updatedWork }));

      // Tøm feltene etter at arbeidet er lagt til
      setCustomWork({ title: '', price: '' });

      // Send oppdatering til backend
      try {
        const updatedService = {
          arbeid: updatedWork.map(work => ({
            title: work.title,
            price: work.price
          }))
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
        } else {
          console.log('Egendefinert arbeid lagret');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
    }
  };


  // Funksjon for å legge til egendefinert del
  const handleAddCustomPart = async () => {
    if (customPart.ean && customPart.brand && customPart.product && customPart.price) {
      const updatedParts = [...formData.deler, {
        ean: customPart.ean,
        brand: customPart.brand,
        product: customPart.product,
        price: parseFloat(customPart.price),
        discount: parseFloat(customPart.discount || 0)
      }];

      // Oppdater front-end
      setFormData((prevData) => ({
        ...prevData,
        deler: updatedParts
      }));

      // Tøm feltene etter at delen er lagt til
      setCustomPart({ ean: '', brand: '', product: '', price: '', discount: '' });

      // Send oppdatering til backend
      try {
        const updatedService = {
          deler: updatedParts.map(part => ({
            ean: part.ean,
            brand: part.brand,
            product: part.product,
            price: part.price,
            discount: part.discount
          }))
        };

        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedService),
        });

        if (!response.ok) {
          console.error('Feil ved oppdatering av deler på serveren:', response.statusText);
        } else {
          console.log('Egendefinert del lagret');
        }
      } catch (error) {
        console.error('Feil ved kommunikasjon med serveren:', error);
      }
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

  // Beregn totalprisen for arbeid
  const calculateTotalWorkPrice = () => {
    return formData.arbeid.reduce((total, work) => total + work.price, 0);
  };

  // Beregn totalprisen for deler
  const calculateTotalPartsPrice = () => {
    return formData.deler.reduce((total, part) => total + part.price, 0);
  };

  // Beregn totalprisen for både arbeid og deler
  const calculateTotalPrice = () => {
    return calculateTotalWorkPrice() + calculateTotalPartsPrice();
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

      <div className="flex justify-between mb-6 hidden md:flex">
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
        <div className="p-4 border border-gray-300 rounded-lg">

          <div className="flex space-x-4">
            {isEditable ? (
              <>
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
              </>
            ) : (
              <p>
                <strong>Varemerke:</strong> {formData.Varemerke} &nbsp;&nbsp;
                <strong>Produkt:</strong> {formData.Produkt}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            {isEditable ? (
              <>
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
              </>
            ) : (
              <p>
                <strong>Størrelse:</strong> {formData.Størrelse} &nbsp;&nbsp;
                <strong>Farge:</strong> {formData.Farge}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={async () => {
              console.log('Lukker redigeringsmodus...');
              if (isEditable) {
                console.log('Oppdaterer produktinfo før lukking...');
                await handleSaveFields(); // Lagre feltene når redigeringsmodus lukkes
              }
              setIsEditable(!isEditable); // Lukk redigeringsmodus
            }}
            className="text-blue-500 hover:underline"
          >
            {isEditable ? 'Lukk redigeringsmodus' : 'Rediger'}
          </button>
        </div>




        {/* Velg arbeid fra listen */}
        <div className="p-4 border border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">Velg arbeid fra liste:</label>
          <select onChange={handleAddWork} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <option value="">Velg arbeid</option>
            {fixedPrices.map((price) => (
              <option key={price._id} value={price._id}>
                {price.title} - {price.price} kr
              </option>
            ))}
          </select>
        </div>
        {/* Valgt arbeid */}
        <div className="p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Arbeid:</h3>
          <ul>
            {formData.arbeid.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.title} - {item.price} kr</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCopyWork(index)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Kopi
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      // Oppdaterer kun state
                      const updatedWork = formData.arbeid.filter((_, i) => i !== index);
                      setFormData((prevData) => ({
                        ...prevData,
                        arbeid: updatedWork
                      }));

                      // Oppdater backend asynkront
                      try {
                        const updatedService = { arbeid: updatedWork };
                        await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updatedService),
                        });
                      } catch (error) {
                        console.error('Feil ved fjerning av arbeid:', error);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Fjern
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-lg font-bold mt-4 text-right">Totalsum arbeid: {calculateTotalWorkPrice()} kr</p>

          {/* Valgte deler */}
          <h3 className="text-lg font-semibold mb-4">Deler:</h3>
          <ul>
            {formData.deler.map((part, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{part.ean} - {part.product} - {part.price} kr</span>
                <button
                  type="button"
                  onClick={async () => {
                    // Oppdaterer kun state
                    const updatedParts = formData.deler.filter((_, i) => i !== index);
                    setFormData((prevData) => ({
                      ...prevData,
                      deler: updatedParts
                    }));

                    // Oppdater backend asynkront
                    try {
                      const updatedService = { deler: updatedParts };
                      await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/services/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedService),
                      });
                    } catch (error) {
                      console.error('Feil ved fjerning av del:', error);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Fjern
                </button>
              </li>
            ))}
          </ul>

          {/* Totalsum deler til høyre */}
          <p className="text-lg font-bold mt-4 text-right">Totalsum deler: {calculateTotalPartsPrice()} kr</p>

          {/* Totalpris arbeid og deler */}
          <h3 className="text-xl font-semibold mb-4">Totalt arbeid og deler:</h3>
          {/* Totalpris til høyre */}
          <p className="text-lg font-bold mt-4 text-right">Totalt: {calculateTotalPrice()} kr</p>
        </div>




        {/* Beskrivelse */}
        <div className={`p-4 border ${isDescriptionEmpty ? 'border-red-500' : 'border-gray-300'} rounded-lg`}>
          <label className="block text-sm font-medium text-gray-700">Kundens ønsker til servicen: (Skriv utfyllende om hvilket arbeid som ønskes utføres)</label>
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



        {/* Søkefelt for deler */}
        <div className="p-4 border border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700">Søk etter deler (EAN, Merke, Produkt):</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchParts}
            placeholder="Skriv inn minst 2 bokstaver for å søke etter deler"
            className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
          />

          {/* Vise filtrerte deler som nedtrekksliste */}
          {filteredParts.length > 0 && (
            <ul className="mt-2 border border-gray-300 rounded-md">
              {filteredParts.map((part, index) => (
                <li
                  key={index}
                  onClick={() => handleAddPartToWork(part)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {part.ean} - {part.product} - {part.brand} - {part.price} kr
                </li>
              ))}
            </ul>
          )}






          {/* Egendefinert arbeid */}
          <label className="block text-sm font-medium text-gray-700">Legg til egendefinert arbeid:</label>
          <div className="mt-2 flex space-x-4">
            <input
              type="text"
              placeholder="Arbeid"
              value={customWork.title}
              onChange={(e) => setCustomWork({ ...customWork, title: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Pris"
              value={customWork.price}
              onChange={(e) => setCustomWork({ ...customWork, price: e.target.value })}
              className="block w-1/2 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleAddCustomWork}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              +
            </button>
          </div>

          <label className="block text-sm font-medium text-gray-700">Legg til egendefinert del:</label>

          {/* Alle feltene på én linje */}
          <div className="mt-2 flex space-x-4">
            <input
              type="text"
              placeholder="EAN/PLU"
              value={customPart.ean}
              onChange={(e) => setCustomPart({ ...customPart, ean: e.target.value })}
              className="block w-1/5 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Varemerke"
              value={customPart.brand}
              onChange={(e) => setCustomPart({ ...customPart, brand: e.target.value })}
              className="block w-1/5 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Produkt"
              value={customPart.product}
              onChange={(e) => setCustomPart({ ...customPart, product: e.target.value })}
              className="block w-1/5 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Pris"
              value={customPart.price}
              onChange={(e) => setCustomPart({ ...customPart, price: e.target.value })}
              className="block w-1/6 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Rabatt (%)"
              value={customPart.discount}
              onChange={(e) => setCustomPart({ ...customPart, discount: e.target.value })}
              className="block w-1/6 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleAddCustomPart}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              +
            </button>
          </div>

        </div>

        <div className="p-4 border border-gray-300 rounded-lg">

          <div>
            <label className="block text-sm font-medium text-gray-700">Utført arbeid:</label>
            <textarea
              name="utførtArbeid"
              value={formData.utførtArbeid}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md resize-y"
            />
          </div>
        </div>
        <div className="p-4 border border-gray-300 rounded-lg">

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