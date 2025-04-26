// components/routers/PublicRouter.js
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import AuthContext from "../contextProviders/AuthContext";

/**
 * 
 * @param {Component} children Component that will be wrapped by the provider
 * @returns Router to avoid an authenticated user to access pages like login or adduser
 */
export const NotAuthorizedRouter = ({ children }) => {
    const { token, isValidToken, isLoading: authLoading } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsAuthenticated(false);
                setIsChecking(false);
                return;
            }

            try {
                const valid = await isValidToken(token);
                setIsAuthenticated(valid);
            } catch {
                setIsAuthenticated(false);
            }

            setIsChecking(false);
        };

        if (!authLoading) {
            checkAuth();
        }
    }, [authLoading, token, isValidToken]);

    if (authLoading || isChecking) return <></>;

    // If the user is authenticated, redirect to home 
    if (isAuthenticated) return <Navigate to="/" replace />;

    // If the user is not authenticated, render the children (the login page or add user page)
    return children;
};
