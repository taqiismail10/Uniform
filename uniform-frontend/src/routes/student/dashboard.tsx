import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GraduationCap, User, Mail, Phone, MapPin, Calendar, BookOpen, Globe, CreditCard, LogOut, Menu, X, Building, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/useAuth'
import { toast } from 'sonner'
import { useEffect, useState, useRef } from 'react'
import { getInstitutions } from '@/api'
import UniversityList from '@/components/UniversityList'
import { Button } from '@/components/ui/button'

// Create a types file or define the Institution interface here
interface Institution {
  institutionId: string
  institutionName: string
  type: string
  description: string
  website: string
  location: string
  establishedIn: string
  id: string
}

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

interface UserData {
  userId: string
  userName: string
  email: string
  phone: string
  password: string
  address: string
  role: string
  dob: string
  examPath: string
  medium: string
  id: string
}

function RouteComponent() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // Track active section
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Track user menu state
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const institutions = Route.useLoaderData() as Institution[];

  // Get user data from local storage
  useEffect(() => {
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const parsedUser = JSON.parse(userJson);
        setUserData(parsedUser);
      } else {
        // If no user data in local storage, redirect to login
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
  }, [logout, navigate]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged Out", {
      description: "You have been successfully logged out."
    });
    navigate({ to: '/login' });
    setMobileMenuOpen(false); // Close mobile menu when logging out
    setUserMenuOpen(false); // Close user menu when logging out
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('mobile-menu-button');
      if (
        mobileMenuOpen &&
        menu &&
        !menu.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Show loading state while fetching user data
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

  // Show error state if user data is not available
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gray-900 rounded-full">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-xl sm:text-2xl font-bold text-gray-900">Student Dashboard</h1>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-4">
                <Button
                  variant={"link"}
                  onClick={() => setActiveSection('dashboard')}
                  className={`px-3 py-2 text-base font-medium ${activeSection === 'dashboard'
                    ? 'text-black'
                    : 'text-gray-600'
                    }`}
                >
                  Dashboard
                </Button>
                <Button
                  variant={"link"}
                  onClick={() => setActiveSection('universities')}
                  className={`px-3 py-2 text-base font-medium ${activeSection === 'universities'
                    ? 'text-black'
                    : 'text-gray-600'
                    }`}
                >
                  Universities
                </Button>
              </nav>

              {/* User menu */}
              <div className="relative">
                <Button
                  ref={userButtonRef}
                  variant="ghost"
                  className="flex items-center text-base space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span>{userData.userName}</span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="font-medium text-gray-700">{userData.userName.charAt(0)}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userData.userName}</p>
                        <p className="text-sm text-gray-500 truncate">{userData.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Button
                          variant="link"
                          onClick={() => {
                            setActiveSection('dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-start px-4 py-3 text-base font-medium ${activeSection === 'dashboard'
                            ? 'text-black hover:bg-gray-50'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <User className="mr-3 h-5 w-5" />
                          Dashboard
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => {
                            setActiveSection('universities');
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-start px-4 py-3 text-base font-medium ${activeSection === 'universities'
                            ? 'text-black hover:bg-gray-50'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <Building className="mr-3 h-5 w-5" />
                          Universities
                        </Button>
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, slide in from right */}
        <div
          id="mobile-menu"
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="pt-5 pb-6 px-4 space-y-6">
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="font-medium text-gray-700">{userData.userName.charAt(0)}</span>
              </div>
              <div className="ml-4">
                <div className="text-base font-medium text-gray-800">{userData.userName}</div>
                <div className="text-sm font-medium text-gray-500">{userData.email}</div>
              </div>
            </div>
            <div className="space-y-1">
              <Button
                variant="link"
                onClick={() => {
                  setActiveSection('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-start px-4 py-3 text-base font-medium ${activeSection === 'dashboard'
                  ? 'text-black hover:bg-gray-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <User className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  setActiveSection('universities');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-start px-4 py-3 text-base font-medium ${activeSection === 'universities'
                  ? 'text-black hover:bg-gray-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Building className="mr-3 h-5 w-5" />
                Universities
              </Button>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                      <BookOpen className="h-6 w-6 text-gray-900" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                        <dd className="text-lg font-medium text-gray-900">3</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                      <CreditCard className="h-6 w-6 text-gray-900" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Payment Status</dt>
                        <dd className="text-lg font-medium text-gray-900">Completed</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                      <Calendar className="h-6 w-6 text-gray-900" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Next Deadline</dt>
                        <dd className="text-lg font-medium text-gray-900">Jun 15, 2023</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div id="profile-section" className="lg:col-span-1">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          Full Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.userName}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          Email Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.phone}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          Date of Birth
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(userData.dob)}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.address}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                          Exam Path
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.examPath}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-400" />
                          Medium
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.medium}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-4 bg-gray-50 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div id="applications-section" className="lg:col-span-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Application Status</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Track your university applications</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                University
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applied Date
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                University of Dhaka
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                Science Unit
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                May 15, 2023
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Approved
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Bangladesh University of Engineering and Technology
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                Engineering Unit
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                May 18, 2023
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Under Review
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rajshahi University
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                Arts Unit
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                May 20, 2023
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Under Review
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div id="actions-section" className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Common tasks and actions</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        New Application
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        Payment History
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        Download Documents
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        Help & Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Universities Section */}
        {activeSection === 'universities' && (
          <UniversityList institutions={institutions} />
        )}
      </main>
    </div>
  )
}