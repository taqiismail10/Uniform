// uniform-frontend/src/components/student/AcademicInfoPage.tsx
import type { AcademicInfo } from '@/components/student/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AcademicInfoPageProps {
  academicInfo: AcademicInfo | null;
  loading?: boolean;
  sscStream?: 'SCIENCE' | 'ARTS' | 'COMMERCE';
  hscStream?: 'SCIENCE' | 'ARTS' | 'COMMERCE';
}

export default function AcademicInfoPage({
  academicInfo,
  loading = false,
  sscStream,
  hscStream,
}: AcademicInfoPageProps) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
          <p className="mt-1 text-gray-600">Your academic details</p>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading academic information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
        <p className="mt-1 text-gray-600">Your academic details</p>
      </div>

      {academicInfo ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Academic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {academicInfo.examPath === 'NATIONAL' ? 'National Curriculum' : 'Madrasha Curriculum'}
              </span>
            </div>
            <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 text-blue-800 text-xs px-3 py-2">
              Eligibility for applications is determined by your GPA and, where applicable, your SSC/HSC stream(s).
              Units must meet minimum GPA and stream requirements to appear as available to apply.
            </div>

            {academicInfo.examPath === 'NATIONAL' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(sscStream || hscStream) && (
                  <div className="md:col-span-2 -mt-2">
                    <div className="flex flex-wrap gap-2 text-sm">
                      {sscStream && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          SSC Stream: {sscStream.charAt(0) + sscStream.slice(1).toLowerCase()}
                        </span>
                      )}
                      {hscStream && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          HSC Stream: {hscStream.charAt(0) + hscStream.slice(1).toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {academicInfo.sscRoll && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">SSC</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">GPA</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.sscGpa}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Board</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.sscBoard}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Passing Year</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.sscYear}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Roll</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.sscRoll}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Registration</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.sscRegistration}</dd>
                      </div>
                    </dl>
                  </div>
                )}
                {academicInfo.hscRoll && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">HSC</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">GPA</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.hscGpa}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Board</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.hscBoard}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Passing Year</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.hscYear}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Roll</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.hscRoll}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Registration</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.hscRegistration}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {academicInfo.dakhilRoll && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Dakhil</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">GPA</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhilGpa}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Board</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhilBoard}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Passing Year</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhilYear}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Roll</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhilRoll}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Registration</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhilRegistration}</dd>
                      </div>
                    </dl>
                  </div>
                )}
                {academicInfo.alimRoll && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Alim</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">GPA</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.alimGpa}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Board</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.alimBoard}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Passing Year</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.alimYear}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Roll</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.alimRoll}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Registration</dt>
                        <dd className="text-sm font-medium text-gray-900">{academicInfo.alimRegistration}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No academic information found.</p>
              <p className="text-sm text-gray-500">Academic information will be added based on your registration details.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
