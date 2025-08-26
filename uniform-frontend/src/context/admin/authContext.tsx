// uniform-frontend/src/context/admin/authContext.tsx
import { createContext } from "react";

export interface AdminUser {
  userId: string;
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (userData: AdminUser) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null); 