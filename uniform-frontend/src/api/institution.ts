// src/api/institution.ts
import api from "./axios";
import type { Institution } from "@/components/student/types";

// Get Institutions
export const getInstitutions = async (): Promise<Institution[]> => {
  try {
    const response = await api.get<Institution[]>("/institutions");
    return response.data;
  } catch (error) {
    console.error("Get Institutions Failed:", error);
    return [];
  }
};

// Get Institution by ID
export const getInstitutionById = async (
  institutionId: string
): Promise<Institution | null> => {
  try {
    const response = await api.get<Institution>(
      `/institutions/${institutionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Get Institution Failed:", error);
    return null;
  }
};