// uniform-frontend/src/components/student/AcademicInfoSection.tsx
import type { AcademicInfo } from './types';
import AcademicDetails from './AcademicDetails';

interface AcademicInfoSectionProps {
  academicInfo: AcademicInfo;
}

export default function AcademicInfoSection({ academicInfo }: AcademicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <AcademicDetails academicInfo={academicInfo} />
    </div>
  );
}