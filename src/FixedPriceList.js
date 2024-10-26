import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function FixedPriceList() {
    const [fixedPrices, setFixedPrices] = useState([]);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState(''); // For filtrering
    const navigate = useNavigate();

    // Funksjon for å hente og sette cookies
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // Hent fastpriser og tjenestetyper når komponenten laster
    useEffect(() => {
        const fetchFixedPrices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/fixedprices`);
                const data = await response.json();
                setFixedPrices(data);

                // Hent lagret filtrering fra cookies og bruk den
                const savedServiceType = getCookie("selectedServiceType");
                if (savedServiceType) {
                    setSelectedServiceType(savedServiceType);
                    // Bruk lagret tjenestetype til å filtrere
                    const filtered = data
                        .filter(price => savedServiceType === '' || price.serviceType === savedServiceType)
                        .sort((a, b) => a.priority - b.priority);
                    setFilteredPrices(filtered);
                } else {
                    setFilteredPrices(data); // Ingen cookie, vis alle
                }
            } catch (error) {
                console.error('Feil ved henting av fastpriser:', error);
            }
        };

        const fetchServiceTypes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/servicetypes`);
                const data = await response.json();
                setServiceTypes(data);
            } catch (error) {
                console.error('Feil ved henting av tjenestetyper:', error);
            }
        };

        fetchFixedPrices();
        fetchServiceTypes();
    }, []);

    const handleAddFixedPrice = () => {
        navigate('/fixed-price-form'); // Naviger til skjema for å legge til ny fastpris
    };

    const handleEditFixedPrice = (id) => {
        navigate(`/fixed-price-change/${id}`); // Naviger til siden for å endre fastpris
    };

    const handleServiceTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedServiceType(selectedType);

        // Lagre valgt filtrering i en cookie (gyldig i 7 dager)
        setCookie("selectedServiceType", selectedType, 7);

        // Filtrer og sorter etter prioritet
        const filtered = fixedPrices
            .filter(price => selectedType === '' || price.serviceType === selectedType)
            .sort((a, b) => a.priority - b.priority);

        setFilteredPrices(filtered);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Fastpriser</h2>
                <button
                    onClick={handleAddFixedPrice}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Legg til fastpris
                </button>
            </div>

            {/* Nedtrekksmeny for filtrering etter servicetype */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer etter tjenestetype:</label>
                <select
                    value={selectedServiceType}
                    onChange={handleServiceTypeChange}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Alle tjenestetyper</option>
                    {serviceTypes.map((type) => (
                        <option key={type._id} value={type.type}>{type.type}</option>
                    ))}
                </select>
            </div>

            {filteredPrices.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Tittel</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Pris</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Beskrivelse</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Tjenestetype</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Prioritet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPrices.map((price) => (
                            <tr key={price._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEditFixedPrice(price._id)}>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.title}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.price} kr</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.description}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.serviceType}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.priority}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">Ingen fastpriser funnet</p>
            )}
        </div>
    );
}

export default FixedPriceList;
