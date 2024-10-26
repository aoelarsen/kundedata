import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function StatusList() {
    const [statuses, setStatuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/statuses`);
                if (!response.ok) {
                    throw new Error('Feil ved henting av statuser');
                }
                const data = await response.json();
                setStatuses(data);
            } catch (error) {
                console.error('Feil ved henting av statuser:', error);
            }
        };

        fetchStatuses();
    }, []);

    const handleSelectStatus = (statusId) => {
        navigate(`/status-change/${statusId}`); // Naviger til StatusChange for å endre en status
    };

    const handleAddStatus = () => {
        navigate('/status-form'); // Naviger til StatusForm for å registrere nye statuser
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            {/* Flex for toppseksjon med overskrift og legg-til-knapp */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Statuser</h2>
                <button
                    onClick={handleAddStatus}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Legg til status
                </button>
            </div>

            {statuses.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Navn</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Beskrivelse</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map((status) => (
                            <tr
                                key={status._id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectStatus(status._id)} // Klikk for å navigere til endring av status
                            >
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{status.navn}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{status.beskrivelse}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">Ingen statuser funnet</p>
            )}
        </div>
    );
}

export default StatusList;
