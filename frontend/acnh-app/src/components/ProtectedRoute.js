import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = () => {
    const { currentUser } = useUser();
    const location = useLocation();
    console.log("Current user in ProtectedRoute:", currentUser);  

    if (!currentUser) {
        console.log("User not authenticated, redirecting to login.");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log("User authenticated, rendering outlet.");
    return <Outlet />;
};

export default ProtectedRoute;