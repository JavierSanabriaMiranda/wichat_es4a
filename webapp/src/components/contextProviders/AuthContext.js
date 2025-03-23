import { createContext, useState, useEffect, Component } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';


const AuthContext = createContext();

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

/**
 * Component that provides the authentication context to its children. 
 * It will bring to the children the user and token stored in the local and session storage and the login and logout functions.
 * It keeps the user in the local storage to persist his information in the browser.
 * The token is stored in the session storage to avoid persisting it in the browser (for more security).
 * 
 * @param {Component} children that will be wrapped by the provider and receive the context
 * @returns component that provides the authentication context
 */
export const AuthProvider = ({ children }) => {

    const { t } = useTranslation();

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post(apiEndpoint + "/login", {username, password});

            const { token, id } = res.data;
            setUser({ username, id });
            setToken(token);

            localStorage.setItem("user", JSON.stringify({ username, id }));
            sessionStorage.setItem("token", token);
        } catch (error) {
            setError(t('auth-error-bad-credentials'));
            console.error("Error en el login:", error.response?.data || error.message);
        }
    };


    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
