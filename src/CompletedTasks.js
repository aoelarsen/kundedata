// CompletedTasks.js
import React, { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


function CompletedTasks() {
    const [completedTasks, setCompletedTasks] = useState([]);

    const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;

    // Hent fullførte oppgaver
    const fetchCompletedTasks = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/completedtasks`);
            const data = await response.json();

            const filteredTasks = data.filter(task => task.store === butikkid);
            setCompletedTasks(filteredTasks.slice(-10).reverse()); // Hent de siste 10 oppgavene og sorter nyeste først
        } catch (error) {
            console.error('Feil ved henting av fullførte oppgaver:', error);
        }
    }, [butikkid]);

    useEffect(() => {
        fetchCompletedTasks();
    }, [fetchCompletedTasks]);

    return (
        <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
            <h3 className="text-2xl font-bold mb-4">Siste 10 fullførte oppgaver</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Oppgave</th>
                        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Utført av</th>
                        <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Dato</th>
                    </tr>
                </thead>
                <tbody>
                    {completedTasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{task.task}</td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{task.employee}</td>
                            <td className="hidden md:table-cell px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                {new Date(task.dateCompleted).toLocaleDateString()} {new Date(task.dateCompleted).toLocaleTimeString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompletedTasks;
