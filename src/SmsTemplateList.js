import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SmsTemplateList() {
    const [smsTemplates, setSmsTemplates] = useState([]); // Sett tom array som initial verdi
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSmsTemplates = async () => {
            try {
                const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/smsmaler');
                if (!response.ok) {
                    throw new Error('Feil ved henting av SMS-maler');
                }
                const data = await response.json();
                setSmsTemplates(data); // Oppdaterer smsTemplates med data fra API
            } catch (error) {
                console.error('Feil ved henting av SMS-maler:', error);
            }
        };

        fetchSmsTemplates();
    }, []);

    const handleSelectSmsTemplate = (smsTemplateId) => {
        navigate(`/sms-template-change/${smsTemplateId}`); // Naviger til SmsTemplateChange for å endre en SMS-mal
    };

    const handleAddSmsTemplate = () => {
        navigate('/sms-template-form'); // Naviger til SmsTemplateForm for å registrere nye SMS-maler
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            {/* Flexbox for å plassere overskrift og knapp på samme rad */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">SMS-maler</h2>
                {/* Knapp for å legge til nye SMS-maler */}
                <button
                    onClick={handleAddSmsTemplate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Legg til SMS-mal
                </button>
            </div>
            {smsTemplates.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Tittel</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Type</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {smsTemplates.map((smsTemplate) => (
                            <tr
                                key={smsTemplate._id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectSmsTemplate(smsTemplate._id)} // Når man klikker på raden, gå til SmsTemplateChange
                            >
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{smsTemplate.tittel}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{smsTemplate.type}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{smsTemplate.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">Ingen SMS-maler funnet</p>
            )}
        </div>
    );
}

export default SmsTemplateList;
