import { User, Mail, Phone, Calendar, MapPin, BookOpen, Globe, LogOut } from 'lucide-react';
import type { UserData } from './types';

interface ProfileInfoProps {
  userData: UserData;
  onLogout: () => void;
}

export default function ProfileInfo({ userData, onLogout }: ProfileInfoProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
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
            onClick={onLogout}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}