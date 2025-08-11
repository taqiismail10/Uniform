import { useAuth } from "@/context/useAuth"
import { Navigate } from "@tanstack/react-router";

const ProtectedRoutes = (
  {
    children,
    role,
  }:
    {
      children: React.ReactNode;
      role: string;
    }
) => {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />
  }

  // Rediret to unauthorized if the user lack of STUDENT role
  if (user.role !== role) {
    return <Navigate to="/unauthorized" />
  }


  return children;
}

export default ProtectedRoutes