import type { AcademicInfo } from './types';

interface AcademicDetailsProps {
  academicInfo: AcademicInfo;
}

export default function AcademicDetails({ academicInfo }: AcademicDetailsProps) {
  const { curriculumType } = academicInfo;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Academic Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {curriculumType === 'national' ? 'SSC and HSC details' : 'Dakhil and Alim details'}
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {curriculumType === 'national' ? 'National Curriculum' : 'Madrasha Curriculum'}
          </span>
        </div>

        {curriculumType === 'national' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicInfo.ssc && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">SSC</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">GPA</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.gpa}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Board</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.board}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Passing Year</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.passingYear}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Roll</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.roll}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Registration</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.registration}</dd>
                  </div>
                </dl>
              </div>
            )}
            {academicInfo.hsc && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">HSC</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">GPA</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.gpa}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Board</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.board}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Passing Year</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.passingYear}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Roll</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.roll}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Registration</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.registration}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicInfo.dakhil && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Dakhil</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">GPA</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhil.gpa}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Board</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhil.board}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Passing Year</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhil.passingYear}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Roll</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhil.roll}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Registration</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.dakhil.registration}</dd>
                  </div>
                </dl>
              </div>
            )}
            {academicInfo.alim && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Alim</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">GPA</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.alim.gpa}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Board</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.alim.board}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Passing Year</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.alim.passingYear}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Roll</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.alim.roll}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Registration</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.alim.registration}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}