import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { GraduationCap, Eye, EyeOff, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/useAuth'
import { toast } from 'sonner'
import { registerUser } from '@/api'
import studentImage from '@/assets/student_using_laptop.svg'
import axios from 'axios'

export const Route = createFileRoute('/_auth/registration')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    dob: '',
    examPath: '',
    medium: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match. Please try again."
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data for API
      const userData = {
        userName: formData.userName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        role: "STUDENT",
        dob: formData.dob,
        examPath: formData.examPath,
        medium: formData.medium,
      };

      // Call the register API
      const newUser = await registerUser(userData);

      if (newUser) {
        // Log the user in
        login(newUser);

        toast.success("Registration Successful", {
          description: "Your account has been created successfully."
        });

        // Navigate to dashboard
        navigate({ to: '/student/dashboard' });
      } else {
        toast.error("Registration Failed", {
          description: "There was a problem creating your account. Please try again."
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "There was a problem creating your account. Please try again.";

      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        // Handle axios specific errors
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          if (status === 409) {
            errorMessage = "An account with this email already exists.";
          } else if (status === 400) {
            errorMessage = "Invalid registration data. Please check your inputs.";
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = "Network error. Please check your internet connection.";
        }
      } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        errorMessage = error.message;
      }

      toast.error("Registration Failed", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white shadow-lg">
        {/* Left side - Image and Info */}
        <div className="hidden md:flex md:w-2/5 lg:w-1/2 items-center justify-center p-8 bg-gray-50">
          <div className="max-w-md">
            <Link to='/'>
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-900 rounded-full">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Join UniForm</h2>
                <p className="mt-2 text-gray-600">Centralized University Admission System</p>
              </div>
            </Link>
            <img
              className="w-full h-auto"
              src={studentImage}
              alt="Student using UniForm"
            />
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="w-full md:w-3/5 lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join thousands of students applying through UniForm</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                value={formData.userName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="username@domain.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+880 1XXX XXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 font-medium">
                Address
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-700 font-medium">
                Date of Birth
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  id="dob"
                  name="dob"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <Calendar className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examPath" className="text-gray-700 font-medium">
                  Exam Path
                </Label>
                <Select value={formData.examPath} onValueChange={(value) => handleSelectChange('examPath', value)} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exam path" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NATIONAL">National Curriculum</SelectItem>
                    <SelectItem value="BRITISH">British Curriculum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medium" className="text-gray-700 font-medium">
                  Medium
                </Label>
                <Select value={formData.medium} onValueChange={(value) => handleSelectChange('medium', value)} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangla">Bangla</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                required
                disabled={isLoading}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the
                <Link to="/terms" className="text-gray-900 font-medium hover:text-gray-700 transition">
                  Terms of Service
                </Link>
                and
                <Link to="/privacy" className="text-gray-900 hover:text-gray-700 transition">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center gap-2 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <GraduationCap className="h-5 w-5" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700 transition">
              Login
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
  )
}