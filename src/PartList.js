import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PartList() {
    const [parts, setParts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/parts`);
                const data = await response.json();
                setParts(data);
            } catch (error) {
                console.error('Feil ved henting av deler:', error);
            }
        };

        fetchParts();
    }, []);

    const handleAddPart = () => {
        navigate('/part-form'); // Naviger til skjema for å legge til ny del
    };

    const handleEditPart = (id) => {
        navigate(`/part-change/${id}`); // Naviger til skjema for å endre del
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Deler</h2>
                <button
                    onClick={handleAddPart}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Legg til del
                </button>
            </div>
            {parts.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">EAN-kode</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">Varemerke</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Produkt</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Pris</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parts.map((part) => (
                            <tr key={part._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEditPart(part._id)}>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{part.ean}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{part.brand}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{part.product}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{part.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">Ingen deler funnet</p>
            )}
        </div>
    );
    
}

export default PartList;
