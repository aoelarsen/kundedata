// auth.js
export const users = [
    { username: 'store1', password: 'password1' },
    { username: 'store2', password: 'password2' }
];

export const login = (username, password) => {
    const user = users.find(
        (user) => user.username === username && user.password === password
    );
    if (user) {
        localStorage.setItem('authenticatedUser', JSON.stringify(user));
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem('authenticatedUser');
};

export const isAuthenticated = () => {
    return localStorage.getItem('authenticatedUser') !== null;
};
