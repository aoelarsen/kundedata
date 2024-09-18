import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function StatusChange() {
  const { id } = useParams();  // Henter ID fra URL
  const [status, setStatus] = useState({ navn: '', beskrivelse: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Henter statusdetaljer basert på ID
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/statuses/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Status ikke funnet');
          } else {
            setError('En feil oppstod ved henting av status');
          }
          return;
        }
        const data = await response.json();
        setStatus({ navn: data.navn, beskrivelse: data.beskrivelse || '' });
      } catch (error) {
        setError('En feil oppstod ved kommunikasjon med serveren');
      }
    };

    fetchStatus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus((prevStatus) => ({
      ...prevStatus,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/statuses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      if (response.ok) {
        setSuccessMessage('Status oppdatert');
        setTimeout(() => {
          navigate('/status-list'); // Navigerer tilbake til liste over statuser
        }, 2000);
      } else {
        setError('Feil ved oppdatering av status');
      }
    } catch (error) {
      setError('En feil oppstod ved lagring av endringer');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!status) {
    return <p>Laster status...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Endre status</h1>
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Navn</label>
          <input
            type="text"
            name="navn"
            value={status.navn}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            name="beskrivelse"
            value={status.beskrivelse}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Lagre endringer
          </button>
        </div>
      </form>
    </div>
  );
}

export default StatusChange;
