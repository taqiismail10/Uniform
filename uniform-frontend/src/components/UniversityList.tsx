// UniversityList.tsx
import type { Institution } from '@/api';
import { University, Search, Filter, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface UniversityListProps {
  institutions: Institution[]
}

export default function UniversityList({ institutions }: UniversityListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Filter institutions based on search term and type
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || institution.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Get unique institution types for filter dropdown
  const institutionTypes = ['all', ...new Set(institutions.map(inst => inst.type))];

  // Format establishment year to just the year
  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Universities</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Browse and apply to universities</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {institutionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Institutions Grid */}
        {filteredInstitutions.length === 0 ? (
          <div className="text-center py-12">
            <University className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInstitutions.map((institution) => (
              <div key={institution.institutionId} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <University className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{institution.institutionName}</h4>
                      <p className="text-sm text-gray-500">{institution.location}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Type:</span>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded">
                        {institution.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Established:</span>
                      <span>{formatYear(institution.establishedIn)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {institution.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Visit Website
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mt-6 text-sm text-gray-500">
          Showing {filteredInstitutions.length} of {institutions.length} universities
        </div>
      </div>
    </div>
  )
}