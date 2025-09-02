// uniform-frontend/src/routes/student/dashboard.tsx
import ProtectedRoutes from '@/utils/ProtectedRoutes';
import { ROLES } from '@/utils/role';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/student/useAuth';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import { getInstitutions, getApplications, getUserProfile, updateUserProfile } from '@/api';
import { getEligibleInstitutions, type EligibleInstitution } from '@/api/studentExplore';
import type { Application, UserData } from '@/components/student/types';
// Header is rendered by parent /student layout
import DashboardStats from '@/components/student/DashboardStats';
import ApplicationStatus from '@/components/student/ApplicationStatus';
import QuickActions from '@/components/student/QuickActions';
import ProfileInfo from '@/components/student/ProfileInfo';
// import AcademicInfoPage from '@/components/student/AcademicInfoPage';
// Other sections moved to their own routes

export const Route = createFileRoute('/student/dashboard')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <RouteComponent />
    </ProtectedRoutes>
  ),
  loader: async () => {
    try {
      return await getInstitutions();
    } catch (error) {
      console.error("Error loading institutions:", error);
      return []; // Return empty array on error
    }
  }
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [eligible, setEligible] = useState<EligibleInstitution[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState({
    applications: true
  });
  // activeSection handled by parent layout
  // const institutions = Route.useLoaderData() as Institution[];

  // Memoize handleLogout to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged Out", {
      description: "You have been successfully logged out."
    });
    navigate({ to: '/student/studentLogin' });
  }, [logout, navigate]);

  // Get user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Get user profile from API
        const userProfile = await getUserProfile();
        if (userProfile) {
          setUserData(userProfile);
          // Academic info is shown in its own route now
          // Fetch applications
          try {
            const applicationsData = await getApplications(userProfile.userId);
            setApplications(applicationsData || []); // Ensure we always set an array
          } catch (error) {
            console.error("Error fetching applications:", error);
            setApplications([]); // Set empty array on error
            toast.error("Data Error", {
              description: "Could not load applications."
            });
          } finally {
            setDataLoading(prev => ({ ...prev, applications: false }));
          }
          // Fetch eligible institutions (with units & deadlines) for dynamic dashboard
          try {
            const eligibleData = await getEligibleInstitutions();
            setEligible(eligibleData || []);
          } catch (e) {
            setEligible([]);
          }
        } else {
          toast.error("Authentication Error", {
            description: "Please login again to continue."
          });
          handleLogout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Data Error", {
          description: "Could not load user data. Please login again."
        });
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, handleLogout]); // Added handleLogout to dependencies

  // Handle profile update
  const handleProfileUpdate = useCallback(async (updatedData: Partial<UserData>) => {
    if (!userData) return;
    try {
      const success = await updateUserProfile(userData.userId, updatedData);
      if (success) {
        // Refetch the updated user profile
        const updatedUserProfile = await getUserProfile();
        if (updatedUserProfile) {
          setUserData(updatedUserProfile);
          // Update localStorage with new user data
          localStorage.setItem('user', JSON.stringify(updatedUserProfile));
          toast.success("Profile Updated", {
            description: "Your profile has been updated successfully."
          });
        } else {
          toast.error("Update Failed", {
            description: "Profile updated but failed to refresh data."
          });
        }
      } else {
        toast.error("Update Failed", {
          description: "Could not update your profile. Please try again."
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update Failed", {
        description: "An error occurred while updating your profile."
      });
    }
  }, [userData]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to load user data</h2>
          <p className="text-gray-600 mb-4">Please try logging in again</p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Calculate next deadline from eligible units
  const nextDeadlineDate = (() => {
    const allDeadlines: Date[] = [];
    (eligible || []).forEach((inst) => {
      (inst.units || []).forEach((u) => {
        if (u.applicationDeadline) {
          const d = new Date(u.applicationDeadline);
          if (!isNaN(d.getTime()) && d.getTime() >= Date.now()) allDeadlines.push(d);
        }
      });
    });
    if (allDeadlines.length === 0) return null;
    return allDeadlines.sort((a, b) => a.getTime() - b.getTime())[0];
  })();

  const dashboardStats = {
    applications: applications?.length || 0,
    paymentStatus: (applications && applications.length > 0 && applications.some((app: Application) => app.status === 'Approved')) ? 'Completed' : 'Pending',
    nextDeadline: nextDeadlineDate ? nextDeadlineDate.toLocaleDateString() : 'N/A'
  };

  return (
    <>
      <DashboardStats stats={dashboardStats} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <ProfileInfo
            userData={userData}
            onLogout={handleLogout}
            onUpdate={handleProfileUpdate}
          />
          {(userData?.sscStream || userData?.hscStream) && (
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Academic Background</h3>
              </div>
              <div className="px-4 py-4 sm:p-6 flex flex-wrap gap-2 text-sm">
                {userData?.sscStream && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    SSC Stream: {userData.sscStream.charAt(0) + userData.sscStream.slice(1).toLowerCase()}
                  </span>
                )}
                {userData?.hscStream && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    HSC Stream: {userData.hscStream.charAt(0) + userData.hscStream.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          {dataLoading.applications ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Application Status</h3>
              </div>
              <div className="px-4 py-5 sm:p-6 flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading applications...</p>
                </div>
              </div>
            </div>
          ) : (
            <ApplicationStatus applications={applications} />
          )}
          <QuickActions />
        </div>
      </div>
    </>
  );
}
