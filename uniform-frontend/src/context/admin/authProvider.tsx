// uniform-frontend/src/context/admin/authProvider.tsx
import { useEffect, useState } from "react";
import { AuthContext, type AdminUser } from "./authContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    let storedUser = localStorage.getItem('user');
    if (!storedUser) {
      storedUser = sessionStorage.getItem('user');
    }
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setUser(null);
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
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


  const login = (userData: AdminUser) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }

  return (
    <AuthContext.Provider value={{ isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )

}