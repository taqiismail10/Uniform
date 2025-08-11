import type { User } from "@/context/AuthContext";
import axios from "axios";

const API_URL = "http://localhost:5000";

export interface Institution {
  institutionId: string;
  institutionName: string;
  type: string;
  description: string;
  website: string;
  location: string;
  establishedIn: string;
}

// Login User
export const userLogin = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users`, {
      params: {
        email,
        password
      }
    });
    console.log("Login Successful from api call: ", response.data[0]);
    return response.data[0] || null;
  } catch (error) {
    console.log("Login Failed from api call: ", error);
    return null;
  }
}

// Get Institutions
export const getInstitutions = async (): Promise<Institution[] | null> => {
  try {
    const response = await axios.get<Institution[]>(`${API_URL}/institutions`);
    return response.data;
  } catch (error) {
    console.log("Get Institutions Failed from api call: ", error);
    return null;
  }
}