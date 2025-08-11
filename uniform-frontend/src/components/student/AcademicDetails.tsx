import type { AcademicInfo } from './types';

interface AcademicDetailsProps {
  academicInfo: AcademicInfo;
}

export default function AcademicDetails({ academicInfo }: AcademicDetailsProps) {
  const { curriculum } = academicInfo;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Academic Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {curriculum === 'national' ? 'SSC and HSC details' : 'O-Level and A-Level details'}
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {curriculum === 'national' ? 'National Curriculum' : 'British Curriculum'}
          </span>
        </div>

        {curriculum === 'national' ? (
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
                  {academicInfo.ssc.roll && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Roll</dt>
                      <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.roll}</dd>
                    </div>
                  )}
                  {academicInfo.ssc.registration && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Registration</dt>
                      <dd className="text-sm font-medium text-gray-900">{academicInfo.ssc.registration}</dd>
                    </div>
                  )}
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
                  {academicInfo.hsc.roll && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Roll</dt>
                      <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.roll}</dd>
                    </div>
                  )}
                  {academicInfo.hsc.registration && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Registration</dt>
                      <dd className="text-sm font-medium text-gray-900">{academicInfo.hsc.registration}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicInfo.oLevel && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">O-Level</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Board</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.oLevel.board}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Passing Year</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.oLevel.passingYear}</dd>
                  </div>
                  {academicInfo.oLevel.candidateNumber && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Candidate Number</dt>
                      <dd className="text-sm font-medium text-gray-900">{academicInfo.oLevel.candidateNumber}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-gray-500 mb-2">Subjects & Grades</dt>
                    <dd className="text-sm text-gray-900">
                      <ul className="list-disc pl-5 space-y-1">
                        {academicInfo.oLevel.subjects.map((subject, index) => (
                          <li key={index}>{subject.name}: {subject.grade}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            {academicInfo.aLevel && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">A-Level</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Board</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.aLevel.board}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Passing Year</dt>
                    <dd className="text-sm font-medium text-gray-900">{academicInfo.aLevel.passingYear}</dd>
                  </div>
                  {academicInfo.aLevel.candidateNumber && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Candidate Number</dt>
                      <dd className="text-sm font-medium text-gray-900">{academicInfo.aLevel.candidateNumber}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-gray-500 mb-2">Subjects & Grades</dt>
                    <dd className="text-sm text-gray-900">
                      <ul className="list-disc pl-5 space-y-1">
                        {academicInfo.aLevel.subjects.map((subject, index) => (
                          <li key={index}>{subject.name}: {subject.grade}</li>
                        ))}
                      </ul>
                    </dd>
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