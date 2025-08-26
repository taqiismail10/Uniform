// uniform-frontend/src/context/AuthProvider.tsx
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in on app load
    // Try localStorage first, then sessionStorage
    let storedUser = localStorage.getItem('user');
    if (!storedUser) {
      storedUser = sessionStorage.getItem('user');
    }
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Also check for access token
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          // If no access token, clear user data
          setUser(null);
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing user from storage: ", error);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Always store in localStorage for now - can be modified based on rememberMe logic
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};