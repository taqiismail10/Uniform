// src/api/application.ts
import api from "./axios";
import type { Application } from "@/components/student/types";

// Get Applications by User ID
export const getApplications = async (
  userId: string
): Promise<Application[]> => {
  try {
    const response = await api.get<{ applications: Application[] }>(
      `/applications?userId=${userId}`
    );
    return response.data.applications;
  } catch (error) {
    console.error("Get Applications Failed:", error);
    return [];
  }
};

// Submit Application
export const submitApplication = async (
  application: Omit<Application, "id">
): Promise<Application | null> => {
  try {
    const response = await api.post<{ application: Application }>("/applications", application);
    return response.data.application;
  } catch (error) {
    console.error("Submit Application Failed:", error);
    return null;
  }
};

// Update Application Status
export const updateApplicationStatus = async (
  applicationId: string,
  status: Application["status"]
): Promise<Application | null> => {
  try {
    const response = await api.patch<{ application: Application }>(
      `/applications/${applicationId}`,
      { status }
    );
    return response.data.application;
  } catch (error) {
    console.error("Update Application Status Failed:", error);
    return null;
  }
};