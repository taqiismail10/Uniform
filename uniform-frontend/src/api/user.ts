// src/api/user.ts
import api from "./axios";
import type { UserData } from "@/components/student/types";

// Get User by ID
export const getUserById = async (userId: string): Promise<UserData | null> => {
  try {
    const response = await api.get<UserData>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get User Failed:", error);
    return null;
  }
};