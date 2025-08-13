// uniform-frontend/src/components/student/AcademicInfoPage.tsx
import { useState } from 'react';
import type { AcademicInfo } from '@/components/student/types';
import AcademicInfoSection from './AcademicInfoSection';
import AcademicInfoForm from './AcademicInfoForm';
import { saveAcademicInfo } from '@/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface AcademicInfoPageProps {
  academicInfo: AcademicInfo | null;
  loading?: boolean;
  userId: string;
  onAcademicInfoUpdate?: (academicInfo: AcademicInfo) => void;
}

export default function AcademicInfoPage({
  academicInfo,
  loading = false,
  userId,
  onAcademicInfoUpdate
}: AcademicInfoPageProps) {
  const [isEditing, setIsEditing] = useState(!academicInfo);

  const handleSaveAcademicInfo = async (data: AcademicInfo) => {
    try {
      const savedInfo = await saveAcademicInfo(data);
      if (savedInfo) {
        toast.success("Academic Information Saved", {
          description: "Your academic information has been saved successfully."
        });
        setIsEditing(false);
        if (onAcademicInfoUpdate) {
          onAcademicInfoUpdate(savedInfo);
        }
      } else {
        toast.error("Save Failed", {
          description: "Could not save academic information. Please try again."
        });
      }
    } catch (error) {
      console.error("Error saving academic info:", error);
      toast.error("Save Failed", {
        description: "An error occurred while saving. Please try again."
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
          <p className="mt-1 text-gray-600">Your academic details</p>
        </div>
        {academicInfo && !isEditing && (
          <Button onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <AcademicInfoForm
          academicInfo={academicInfo || undefined}
          userId={userId}
          onSave={handleSaveAcademicInfo}
          onCancel={handleCancelEdit}
          isEditing={!!academicInfo}
        />
      ) : academicInfo ? (
        <AcademicInfoSection
          academicInfo={academicInfo}
        />
      ) : (
        <AcademicInfoForm
          userId={userId}
          onSave={handleSaveAcademicInfo}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}