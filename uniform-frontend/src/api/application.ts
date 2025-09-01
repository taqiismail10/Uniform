// src/api/application.ts
import api from "./axios";
import type { Application } from "@/components/student/types";

// Get Applications by User ID
export const getApplications = async (
  _userId: string
): Promise<Application[]> => {
  try {
    // Backend uses auth context; userId query is ignored
    const response = await api.get<{ applications: any[] }>(`/applications`);
    const raw = response.data.applications || [];
    // Normalize server payload to Application shape expected by UI
    return raw.map((a: any) => ({
      id: a.id ?? a.applicationId ?? `${a.unitId || ''}-${a.institutionId || ''}-${a.appliedAt || ''}`,
      userId: a.studentId ?? '',
      university: a.institution?.name ?? a.institutionName ?? '-',
      unit: a.unit?.name ?? a.unitName ?? '-',
      appliedDate: a.appliedAt ?? a.appliedDate ?? '',
      status: (a.status as Application['status']) ?? 'Pending',
    })) as Application[];
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
