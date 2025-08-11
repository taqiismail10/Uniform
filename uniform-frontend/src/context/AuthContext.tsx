// uniform-frontend/src/context/AuthContext.tsx
import { createContext } from "react";

export interface User {
  userId: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: string;
  dob: string;
  examPath: string;
  medium: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);