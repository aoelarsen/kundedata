import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreateOrder() {
    const { customerNumber } = useParams(); // Hent customerNumber fra URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Varemerke: '',
        Produkt: '',
        Størrelse: '',
        Farge: '',
        Kommentar: '',
        Ansatt: '',
        kundeid: customerNumber // Bruk customerNumber som kundeid
    });

    useEffect(() => {
        // Når komponenten lastes inn, sett en ny ordre-ID
        const generateOrderNumber = async () => {
            try {
                const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders');
                const orders = await response.json();
                const nextOrderNumber = orders.length > 0 ? Math.max(...orders.map(order => order.orderNumber || 0)) + 1 : 1;

                setFormData(prevData => ({
                    ...prevData,
                    orderNumber: nextOrderNumber
                }));
            } catch (error) {
                console.error('Feil ved henting av ordrer:', error);
            }
        };

        generateOrderNumber();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const addedOrder = await response.json();
                console.log('Ny ordre registrert:', addedOrder);
                navigate(`/order-list`); // Naviger til OrderList.js etter vellykket registrering
            } else {
                console.error('Feil ved registrering av ordre:', response.statusText);
            }
        } catch (error) {
            console.error('Feil ved kommunikasjon med serveren:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Registrer Ny Ordre</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Varemerke</label>
                    <input
                        type="text"
                        name="Varemerke"
                        value={formData.Varemerke}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Produkt</label>
                    <input
                        type="text"
                        name="Produkt"
                        value={formData.Produkt}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Størrelse</label>
                    <input
                        type="text"
                        name="Størrelse"
                        value={formData.Størrelse}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Farge</label>
                    <input
                        type="text"
                        name="Farge"
                        value={formData.Farge}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kommentar</label>
                    <input
                        type="text"
                        name="Kommentar"
                        value={formData.Kommentar}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ansatt</label>
                    <input
                        type="text"
                        name="Ansatt"
                        value={formData.Ansatt}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Registrer Ordre
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateOrder;
