// uniform-frontend/src/routes/student/dashboard.tsx
import ProtectedRoutes from '@/utils/ProtectedRoutes';
import { ROLES } from '@/utils/role';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/student/useAuth';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import { getInstitutions, getAcademicInfo, getApplications, getUserProfile, updateUserProfile } from '@/api';
import type { Application, UserData, AcademicInfo } from '@/components/student/types';
import Header from '@/components/student/Header';
import DashboardStats from '@/components/student/DashboardStats';
import ApplicationStatus from '@/components/student/ApplicationStatus';
import QuickActions from '@/components/student/QuickActions';
import UniversitiesSection from '@/components/student/UniversitiesSection';
import ProfileInfo from '@/components/student/ProfileInfo';
import AcademicInfoPage from '@/components/student/AcademicInfoPage';
import StudentSettings from '@/components/student/StudentSettings'; // Import the Settings component

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
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState({
    academicInfo: true,
    applications: true
  });
  const [activeSection, setActiveSection] = useState('dashboard');
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
          // Fetch academic info
          try {
            const academicData = await getAcademicInfo(userProfile.userId);
            if (academicData) {
              setAcademicInfo(academicData);
            }
          } catch (error) {
            console.error("Error fetching academic info:", error);
            toast.error("Data Error", {
              description: "Could not load academic information."
            });
          } finally {
            setDataLoading(prev => ({ ...prev, academicInfo: false }));
          }
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

  // Calculate dashboard stats
  const dashboardStats = {
    applications: applications?.length || 0,
    paymentStatus: (applications && applications.length > 0 && applications.some((app: Application) => app.status === 'Approved')) ? 'Completed' : 'Pending',
    nextDeadline: (applications && applications.length > 0) ? 'Jun 15, 2023' : 'N/A'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userData={userData}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {activeSection === 'dashboard' && (
          <>
            <DashboardStats stats={dashboardStats} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <ProfileInfo
                  userData={userData}
                  onLogout={handleLogout}
                  onUpdate={handleProfileUpdate}
                />
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
        )}
        {activeSection === 'universities' && (
          <UniversitiesSection />
        )}
        {activeSection === 'academic-info' && (
          <AcademicInfoPage
            academicInfo={academicInfo}
            loading={dataLoading.academicInfo}
          />
        )}
        {/* Add Settings section */}
        {activeSection === 'settings' && (
          <StudentSettings
            userData={userData}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}
