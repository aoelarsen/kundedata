import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeChange() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        navn: '',
        telefon: '',
        epost: '',
        tilgang: '',
        butikk: '', // Nytt felt for butikkvalg
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.error('Feil ved henting av ansatt');
                }
            } catch (error) {
                console.error('Feil ved kommunikasjon med serveren:', error);
            }
        };

        fetchEmployee();
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
            const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/employees/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/employee-list');
            } else {
                console.error('Feil ved oppdatering av ansatt');
            }
        } catch (error) {
            console.error('Feil ved kommunikasjon med serveren:', error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Endre Ansatt</h2>
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
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <input
                        type="tel"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">E-post</label>
                    <input
                        type="email"
                        name="epost"
                        value={formData.epost}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tilgang</label>
                    <select
                        name="tilgang"
                        value={formData.tilgang}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="ansatt">Ansatt</option>
                        <option value="leder">Leder</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Butikk</label>
                    <select
                        name="butikk"
                        value={formData.butikk}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Velg butikk</option>
                        <option value="Sport1 Røyken">Sport1 Røyken</option>
                        <option value="Sport1 Slemmestad">Sport1 Slemmestad</option>
                        <option value="Begge butikker">Begge butikker</option>
                    </select>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                        Oppdater Ansatt
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeChange;
