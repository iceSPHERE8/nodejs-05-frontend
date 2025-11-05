import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(localStorage.getItem("userId") || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const login = (newToken, userId) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userId", userId)
        setToken(newToken);
        setUser(userId);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);   