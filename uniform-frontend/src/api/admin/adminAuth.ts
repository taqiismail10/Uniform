import type { AdminUser } from "@/context/admin/authContext";
import api from "@/api/axios";
import { getAdminProfile } from "@/api/admin/adminProfile";

// System Admin Login
export const adminLogin = async (
  email: string,
  password: string,
  role: string
): Promise<AdminUser | null> => {
  try {
    const response = await api.post("/system/auth/login", {
      email, password, role
    });
    if (response.data.status === 200) {
      localStorage.setItem('accessToken', response.data.access_token);
      const adminProfile = await getAdminProfile();
      return adminProfile;
    }
    return null;
  } catch (error) {
    console.log("System Admin Login Faliled:---\n", error);
    throw error;
  }
}