// uniform-frontend/src/routes/_auth/studentLogin.tsx

import { userLogin } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/useAuth'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { GraduationCap, Eye, EyeOff, Loader2, Check, Calendar, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import studentImage from '@/assets/student_using_laptop.svg'
import axios from 'axios'

export const Route = createFileRoute('/_auth/studentLogin')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error state
    setError('')

    // Basic validation
    if (!email || !password) {
      toast.error("Validation Error", {
        description: "Please enter both email and password."
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the updated userLogin API function
      const user = await userLogin(email, password);

      if (user) {
        // Store user data in localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(user));
        }

        // Update auth context
        authLogin(user);

        toast.success("Login Successful", {
          description: `Welcome back, ${user.userName}! Redirecting to dashboard...`
        });

        // Navigate to dashboard
        navigate({ to: '/student/dashboard' });
      } else {
        setError("Invalid email or password. Please try again.");
        toast.error("Login Failed", {
          description: "Invalid credentials. Please check your email and password."
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error scenarios
      let errorMessage = "An error occurred during login. Please try again later.";

      if (axios.isAxiosError(error)) {
        // Handle axios specific errors
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          if (status === 401) {
            errorMessage = "Invalid email or password.";
          } else if (status === 404) {
            errorMessage = "User not found. Please check your credentials.";
          } else if (status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = "Network error. Please check your internet connection.";
        }
      } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex min-h-screen w-full bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white shadow-lg">
          {/* Left side - Image and Info */}
          <div className="hidden md:flex md:w-1/2 lg:w-2/3 items-center justify-center p-8 bg-gray-50">
            <div className="max-w-md">
              <Link to='/'>
                <div className="mb-4 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-900 rounded-full">
                      <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Welcome to UniForm</h2>
                  <p className="mt-2 text-gray-600">Centralized University Admission Application System</p>
                </div>
              </Link>
              <img
                className="w-full h-auto"
                src={studentImage}
                alt="Student using UniForm"
              />
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-700">Admission Deadline: June 30, 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2 lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login to UniForm</h1>
              <p className="text-gray-600">Access your university admission portal</p>
            </div>

            {/* Error message display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="username@domain.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-gray-700 hover:text-gray-900 transition">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="sr-only" // Hide the default checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <div
                    className={`w-5 h-5 flex items-center justify-center border rounded cursor-pointer transition-colors ${rememberMe
                      ? 'bg-gray-900 border-gray-900'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onClick={() => !isLoading && setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer" onClick={() => !isLoading && setRememberMe(!rememberMe)}>
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-5 w-5" />
                    Login
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  disabled={isLoading}
                >
                  <div className="h-5 w-5 text-blue-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  disabled={isLoading}
                >
                  <div className="h-5 w-5 text-blue-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.311-.623-.311-1.543c0-1.446.839-2.526 1.885-2.526.888 0 1.318.666 1.318 1.466 0 .893-.568 2.229-.861 3.467-.245 1.04.52 1.888 1.546 1.888 1.856 0 3.283-1.958 3.283-4.789 0-2.503-1.799-4.253-4.37-4.253-2.977 0-4.727 2.234-4.727 4.546 0 .9.347 1.863.781 2.387.085.104.098.195.072.301-.079.329-.254 1.037-.289 1.183-.047.183-.173.263-.317.263-.259 0-.469-.241-.469-.541v-3.22c0-.939-.335-1.424-.335-1.424s-.134-.269-.362-.407C7.284 5.811 6.082 6.1 6.082 8.527c0 1.724.535 2.895.535 2.895s-1.823 3.884-2.133 4.631c-.349.832-.052 1.65.028 1.85.08.2.866.524 1.202.664.349.145.866.1 1.229-.084.866-.435 1.449-1.094 1.449-1.094s1.846-3.058 2.919-6.388c.646-1.776.9-3.196.9-3.196s.367.739.367 1.824c0 1.324-.485 3.01-.485 3.01s.834.259 1.833.259c2.337 0 4.145-1.314 4.145-4.585 0-2.494-1.452-4.254-3.512-4.254z" />
                    </svg>
                  </div>
                  Facebook
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/registration" className="font-medium text-gray-900 hover:text-gray-700 transition">
                Sign up
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                UniForm - A Web Engineering Lab Project for Bangladesh University Admissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}