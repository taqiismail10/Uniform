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
  examPath: 'NATIONAL' | 'MADRASHA' | '';
  medium: 'Bangla' | 'English' | 'Arabic' | '';
  // Streams
  sscStream?: 'SCIENCE' | 'ARTS' | 'COMMERCE';
  hscStream?: 'SCIENCE' | 'ARTS' | 'COMMERCE';
  // Profile image absolute/data URL
  profile?: string; // absolute URL to profile image if available
  // SSC Details
  sscRoll?: string;
  sscRegistration?: string;
  sscGpa?: string;
  sscYear?: string;
  sscBoard?: string;
  // HSC Details
  hscRoll?: string;
  hscRegistration?: string;
  hscGpa?: string;
  hscYear?: string;
  hscBoard?: string;
  // Dakhil Details
  dakhilRoll?: string;
  dakhilRegistration?: string;
  dakhilGpa?: string;
  dakhilYear?: string;
  dakhilBoard?: string;
  // Alim Details
  alimRoll?: string;
  alimRegistration?: string;
  alimGpa?: string;
  alimYear?: string;
  alimBoard?: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
