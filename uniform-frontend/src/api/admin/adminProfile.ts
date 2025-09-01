// uniform-frontend/src/api/admin/adminProfile.ts
import type { AdminUser } from "@/context/admin/authContext";
import api from "@/api/axios";

// Get System Admin Profile
export const getAdminProfile = async (): Promise<AdminUser | null> => {
  try {
    const response = await api.get("/system/admins/profile");
    if (response.data.status === 200) {
      const backendProfile = response.data.profile;
      const frontendProfile: AdminUser = {
        userId: backendProfile.systemAdminId,
        email: backendProfile.email,
        password: "",
        role: backendProfile.role,
      }
      return frontendProfile;
    }
    return null;
  } catch (error) {
    console.log("Get Admin Profile Error:---\n", error);
    return null;
  }
}