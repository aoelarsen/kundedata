import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function StatusForm() {
    const [formData, setFormData] = useState({
        navn: '',
        beskrivelse: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/statuses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/status-list'); // Navigerer tilbake til listen over statuser
            } else {
                console.error('Feil ved opprettelse av status');
            }
        } catch (error) {
            console.error('Feil ved kommunikasjon med serveren:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Registrer Ny Status</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Navn</label>
                    <input
                        type="text"
                        name="navn"
                        value={formData.navn}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
                    <input
                        type="text"
                        name="beskrivelse"
                        value={formData.beskrivelse}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                        Registrer Status
                    </button>
                </div>
            </form>
        </div>
    );
}

export default StatusForm;
