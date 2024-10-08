import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FixedPriceList() {
    const [fixedPrices, setFixedPrices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFixedPrices = async () => {
            try {
                const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/fixedprices');
                const data = await response.json();
                setFixedPrices(data);
            } catch (error) {
                console.error('Feil ved henting av fastpriser:', error);
            }
        };

        fetchFixedPrices();
    }, []);

    const handleAddFixedPrice = () => {
        navigate('/fixed-price-form'); // Naviger til FixedPriceForm for å legge til ny fastpris
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
            {fixedPrices.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Tittel</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Pris</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Beskrivelse</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Tjenestetype</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixedPrices.map((price) => (
                            <tr key={price._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.title}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.price} NOK</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.description}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{price.serviceType}</td>
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
