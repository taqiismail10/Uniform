// uniform-frontend/src/utils/AdminProtectedRoutes.tsx
import { useAuth } from "@/context/admin/useAuth";
import { Navigate } from "@tanstack/react-router";

const AdminProtectedRoutes = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/adminLogin" />;
  }

  if (user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminProtectedRoutes;
