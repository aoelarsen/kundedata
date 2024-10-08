import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FixedPriceChange() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        serviceType: ''
    });

    const [serviceTypes, setServiceTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Hent fastprisen basert på ID
        const fetchFixedPrice = async () => {
            try {
                const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/fixedprices/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.error('Feil ved henting av fastpris');
                }
            } catch (error) {
                console.error('Feil ved kommunikasjon med serveren:', error);
            }
        };

        // Hent tjenestetyper
        const fetchServiceTypes = async () => {
            try {
                const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/servicetypes');
                const data = await response.json();
                setServiceTypes(data);
            } catch (error) {
                console.error('Feil ved henting av tjenestetyper:', error);
            }
        };

        fetchFixedPrice();
        fetchServiceTypes();
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
            const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/fixedprices/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/fixed-price-list'); // Navigerer tilbake til listen over fastpriser
            } else {
                console.error('Feil ved oppdatering av fastpris');
            }
        } catch (error) {
            console.error('Feil ved kommunikasjon med serveren:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Endre Fastpris</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tittel</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pris</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tjenestetype</label>
                    <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Velg tjenestetype</option>
                        {serviceTypes.map(type => (
                            <option key={type._id} value={type.type}>{type.type}</option>
                        ))}
                    </select>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                        Oppdater Fastpris
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FixedPriceChange;
