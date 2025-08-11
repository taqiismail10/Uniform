// uniform-frontend/src/components/student/DashboardStats.tsx

import { BookOpen, CreditCard, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    applications: number;
    paymentStatus: string;
    nextDeadline: string;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
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
                <dd className="text-lg font-medium text-gray-900">{stats.applications}</dd>
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
                <dd className="text-lg font-medium text-gray-900">{stats.paymentStatus}</dd>
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
                <dd className="text-lg font-medium text-gray-900">{stats.nextDeadline}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}