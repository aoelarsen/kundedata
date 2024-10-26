import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


function EmployeeList() {
    const [employees, setEmployees] = useState([]); // Sett tom array som initial verdi
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/employees`);
                if (!response.ok) {
                    throw new Error('Feil ved henting av ansatte');
                }
                const data = await response.json();
                setEmployees(data); // Oppdaterer employees med data fra API
            } catch (error) {
                console.error('Feil ved henting av ansatte:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleSelectEmployee = (employeeId) => {
        navigate(`/employee-change/${employeeId}`); // Naviger til EmployeeChange for å endre en ansatt
    };

    const handleAddEmployee = () => {
        navigate('/employee-form'); // Naviger til EmployeeForm for å registrere nye ansatte
    };

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            {/* Flexbox for å plassere overskrift og knapp på samme rad */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Ansatte</h2>
                {/* Knapp for å legge til nye ansatte */}
                <button
                    onClick={handleAddEmployee}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Legg til ansatt
                </button>
            </div>
            {employees.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Navn</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Telefon</th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 hidden md:table-cell">E-post</th> {/* Skjul på små skjermer */}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr
                                key={employee._id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectEmployee(employee._id)} // Når man klikker på raden, gå til EmployeeChange
                            >
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{employee.navn}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{employee.telefon}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{employee.epost}</td> {/* Skjul på små skjermer */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">Ingen ansatte funnet</p>
            )}
        </div>
    );
}

export default EmployeeList;
