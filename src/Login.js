// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './auth';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(username, password)) {
            navigate('/'); // Tilpass dette til ønsket innloggingsside
        } else {
            setError('Feil brukernavn eller passord');
        }
    };

    return (
        <div>
            <h2>Logg inn</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Brukernavn:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Passord:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Logg inn</button>
            </form>
        </div>
    );
}

export default Login;
