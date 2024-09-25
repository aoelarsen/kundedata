import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element }) => {
    const selectedEmployee = Cookies.get('selectedEmployee');

    if (!selectedEmployee) {
        // Hvis ansatt ikke er valgt, omdiriger til startsiden eller vis modal
        return <Navigate to="/" />;
    }

    // Hvis ansatt er valgt, tillat navigasjon til det beskyttede elementet
    return element;
};

export default ProtectedRoute;
