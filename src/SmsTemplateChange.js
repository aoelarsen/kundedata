import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SmsTemplateChange() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        tittel: '',
        type: '',
        tekst: '',
        status: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        console.log("ID hentet fra URL:", id); // Logg ID-en som brukes
        const fetchSmsTemplate = async () => {
            try {
                const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/smstemplates/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.error('Feil ved henting av SMS-mal');
                }
            } catch (error) {
                console.error('Feil ved kommunikasjon med serveren:', error);
            }
        };
    
        fetchSmsTemplate();
    }, [id]);
    

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
            const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsmaler/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/sms-templates'); // Navigerer tilbake til listen over SMS-maler
            } else {
                console.error('Feil ved oppdatering av SMS-mal');
            }
        } catch (error) {
            console.error('Feil ved kommunikasjon med serveren:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Endre SMS-mal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tittel</label>
                    <input
                        type="text"
                        name="tittel"
                        value={formData.tittel}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="ordre">Ordre</option>
                        <option value="service">Service</option>
                        <option value="kunde">Kunde</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tekst</label>
                    <textarea
                        name="tekst"
                        value={formData.tekst}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="aktiv">Aktiv</option>
                        <option value="inaktiv">Inaktiv</option>
                    </select>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                        Oppdater SMS-mal
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SmsTemplateChange;
