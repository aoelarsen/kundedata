// auth.js
export const login = async (username, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

// Hent token fra localStorage og legg det til i headers
export const getToken = () => localStorage.getItem('token');
