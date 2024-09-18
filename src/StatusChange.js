import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function StatusChange() {
  const { id } = useParams();  // Henter ID fra URL
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        setStatus(data);
      } catch (error) {
        setError('En feil oppstod ved kommunikasjon med serveren');
      }
    };

    fetchStatus();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!status) {
    return <p>Laster status...</p>;
  }

  // Resten av komponenten din for å vise status og gjøre endringer
  return (
    <div>
      <h1>Endre status</h1>
      {/* Implementer form her for å endre status */}
    </div>
  );
}

export default StatusChange;
