// uniform-frontend/src/components/admin/Breadcrumb.tsx

import { LayoutDashboard } from 'lucide-react';

interface BreadcrumbProps {
  activeTab: string;
}

export function Breadcrumb({ activeTab }: BreadcrumbProps) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <a href="#" className="text-gray-400 hover:text-gray-500">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500 capitalize">
                    {activeTab}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}