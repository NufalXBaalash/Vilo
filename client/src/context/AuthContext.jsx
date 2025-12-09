import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (username, password) => {
        // Simple validation: admin/admin -> Ahmed Khaled
        if (username === 'admin' && password === 'admin') {
            const userData = { name: 'Ahmed Khaled', username: 'admin' };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        // Clear cache will be handled by Dashboard component
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
