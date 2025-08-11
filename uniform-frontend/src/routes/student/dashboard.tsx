import ProtectedRoutes from '@/utils/ProtectedRoutes';
import { ROLES } from '@/utils/role';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/useAuth';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  getInstitutions,
  getAcademicInfo,
  getDocuments,
  getApplications,
  getUserById
} from '@/api';
import type { Application, Institution, UserData, AcademicInfo, Document } from '@/components/student/types';
import Header from '@/components/student/Header';
import DashboardStats from '@/components/student/DashboardStats';
import ApplicationStatus from '@/components/student/ApplicationStatus';
import QuickActions from '@/components/student/QuickActions';
import UniversitiesSection from '@/components/student/UniversitiesSection';
import ProfileInfo from '@/components/student/ProfileInfo';
import AcademicInfoPage from '@/components/student/AcademicInfoPage';

export const Route = createFileRoute('/student/dashboard')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT} >
      <RouteComponent />
    </ProtectedRoutes>
  ),
  loader: async () => {
    return await getInstitutions();
  }
})

function RouteComponent() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState({
    academicInfo: true,
    documents: true,
    applications: true
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const institutions = Route.useLoaderData() as Institution[];

  // Get user data from local storage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const parsedUser = JSON.parse(userJson);
          setUserData(parsedUser);

          // Fetch complete user data from API
          if (parsedUser.userId) {
            const fullUserData = await getUserById(parsedUser.userId);
            if (fullUserData) {
              setUserData(fullUserData);
            }

            // Fetch academic info
            try {
              const academicData = await getAcademicInfo(parsedUser.userId);
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

            // Fetch documents
            try {
              const documentsData = await getDocuments(parsedUser.userId);
              setDocuments(documentsData);
            } catch (error) {
              console.error("Error fetching documents:", error);
              toast.error("Data Error", {
                description: "Could not load documents."
              });
            } finally {
              setDataLoading(prev => ({ ...prev, documents: false }));
            }

            // Fetch applications
            try {
              const applicationsData = await getApplications(parsedUser.userId);
              setApplications(applicationsData);
            } catch (error) {
              console.error("Error fetching applications:", error);
              toast.error("Data Error", {
                description: "Could not load applications."
              });
            } finally {
              setDataLoading(prev => ({ ...prev, applications: false }));
            }
          }
        } else {
          toast.error("Authentication Error", {
            description: "Please login again to continue."
          });
          logout();
          navigate({ to: '/login' });
        }
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
        toast.error("Data Error", {
          description: "Could not load user data. Please login again."
        });
        logout();
        navigate({ to: '/login' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged Out", {
      description: "You have been successfully logged out."
    });
    navigate({ to: '/login' });
  };

  // Handle document upload
  const handleDocumentUpload = async (type: Document['type'], file: File) => {
    if (!userData) return;

    try {
      // In a real app, you would upload the file to a server
      // For now, we'll simulate a successful upload
      const newDocument: Document = {
        id: Math.random().toString(36).substr(2, 9),
        userId: userData.userId, // Add the missing userId property
        name: file.name,
        type,
        url: URL.createObjectURL(file), // In real app, this would be the server URL
        uploadedAt: new Date().toISOString()
      };

      // Remove existing document of same type and add new one
      setDocuments(prev =>
        prev.filter(doc => doc.type !== type).concat(newDocument)
      );

      toast.success("Document Uploaded", {
        description: `${file.name} has been uploaded successfully.`
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Upload Failed", {
        description: "Could not upload the document. Please try again."
      });
    }
  };

  // Handle document deletion
  const handleDocumentDelete = async (id: string) => {
    const docToDelete = documents.find(doc => doc.id === id);
    if (docToDelete) {
      try {
        // In a real app, you would call the API to delete the document
        // For now, we'll simulate a successful deletion
        setDocuments(prev => prev.filter(doc => doc.id !== id));

        toast.success("Document Deleted", {
          description: `${docToDelete.name} has been removed.`
        });
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Deletion Failed", {
          description: "Could not delete the document. Please try again."
        });
      }
    }
  };

  // Handle academic info update
  const handleAcademicInfoUpdate = (updatedInfo: AcademicInfo) => {
    setAcademicInfo(updatedInfo);
  };

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
    applications: applications.length,
    paymentStatus: applications.some(app => app.status === 'Approved') ? 'Completed' : 'Pending',
    nextDeadline: applications.length > 0 ? 'Jun 15, 2023' : 'N/A'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userData={userData}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeSection === 'dashboard' && (
          <>
            <DashboardStats stats={dashboardStats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ProfileInfo userData={userData} onLogout={handleLogout} />
              </div>

              <div className="lg:col-span-2">
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
          <UniversitiesSection institutions={institutions} />
        )}

        {activeSection === 'academic-info' && (
          <AcademicInfoPage
            academicInfo={academicInfo}
            documents={documents}
            onDocumentUpload={handleDocumentUpload}
            onDocumentDelete={handleDocumentDelete}
            loading={dataLoading.academicInfo || dataLoading.documents}
            userId={userData.userId}
            onAcademicInfoUpdate={handleAcademicInfoUpdate}
          />
        )}
      </main>
    </div>
  );
}