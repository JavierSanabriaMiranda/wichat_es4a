// This hole code has been taken from this source: https://github.com/Arquisoft/wiq_es1c/blob/master/webapp/src/routers/AuthRoute.js
// It is from a project of the last year of the Software Architecture course in the University of Oviedo

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { isValidToken } from "../services/user.service";

export const PrivateRoute = ({ children }) =>
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => 
    {
        const verifyToken = async () => 
        {
            const token = localStorage.getItem('token');
            
            if (!token) 
            {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
            
            try {
                const valid = await isValidToken(token);
                
                setIsAuthenticated(valid);

            } catch (error) {
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        verifyToken();
    }, []);

    if (isLoading)
        return <></>;

    if (isAuthenticated)
        return children;

    localStorage.removeItem("token");

    return <Navigate to='/login' replace />;
}