import type { AcademicInfo, Document } from './types';
import AcademicDetails from './AcademicDetails';
import DocumentUpload from './DocumentUpload';

interface AcademicInfoSectionProps {
  academicInfo: AcademicInfo;
  documents: Document[];
  onDocumentUpload: (type: Document['type'], file: File) => void;
  onDocumentDelete: (id: string) => void;
}

export default function AcademicInfoSection({
  academicInfo,
  documents,
  onDocumentUpload,
  onDocumentDelete
}: AcademicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <AcademicDetails academicInfo={academicInfo} />
      <DocumentUpload
        documents={documents}
        academicInfo={academicInfo}
        onUpload={onDocumentUpload}
        onDelete={onDocumentDelete}
      />
    </div>
  );
}