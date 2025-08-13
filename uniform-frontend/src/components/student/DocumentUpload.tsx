import { useState, useRef } from 'react';
import type { Document } from './types';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, Download, X } from 'lucide-react';

interface DocumentUploadProps {
  documents: Document[];
  academicInfo: { curriculum: 'national' | 'british' };
  onUpload: (type: Document['type'], file: File) => void;
  onDelete: (id: string) => void;
}

export default function DocumentUpload({ documents, academicInfo, onUpload, onDelete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState<Document['type'] | null>(null);
  const fileInputRefs = {
    profile: useRef<HTMLInputElement>(null),
    ssc: useRef<HTMLInputElement>(null),
    hsc: useRef<HTMLInputElement>(null),
    oLevel: useRef<HTMLInputElement>(null),
    aLevel: useRef<HTMLInputElement>(null),
    other: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: Document['type']) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(type);

      // Simulate upload delay
      setTimeout(() => {
        onUpload(type, file);
        setUploading(null);
      }, 1500);
    }
  };

  const getDocumentTypes = (): Document['type'][] => {
    const baseTypes: Document['type'][] = ['profile', 'other'];

    if (academicInfo.curriculum === 'national') {
      return [...baseTypes, 'ssc', 'hsc'];
    } else {
      return [...baseTypes, 'oLevel', 'aLevel'];
    }
  };

  const documentTypes = getDocumentTypes();

  const getDocumentByType = (type: Document['type']) => {
    return documents.find(doc => doc.type === type);
  };

  const getDocumentTypeName = (type: Document['type']) => {
    switch (type) {
      case 'profile': return 'Profile Image';
      case 'ssc': return 'SSC Marksheet';
      case 'hsc': return 'HSC Marksheet';
      case 'oLevel': return 'O-Level Certificate';
      case 'aLevel': return 'A-Level Certificate';
      case 'other': return 'Other Documents';
      default: return type;
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    return type === 'profile' ? <Image className="h-5 w-5" /> : <FileText className="h-5 w-5" />;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Upload and manage your documents ({academicInfo.curriculum === 'national' ? 'National Curriculum' : 'British Curriculum'})
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {documentTypes.map(type => {
            const doc = getDocumentByType(type);
            return (
              <div key={type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 rounded-md p-2 mr-3">
                    {getDocumentIcon(type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{getDocumentTypeName(type)}</h4>
                    {doc ? (
                      <p className="text-sm text-gray-500">Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Not uploaded</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {doc && (
                    <>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs[type]}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, type)}
                    disabled={uploading === type}
                    accept={type === 'profile' ? 'image/*' : '.pdf,.jpg,.jpeg,.png'}
                  />
                  <Button
                    variant={doc ? "outline" : "default"}
                    size="sm"
                    disabled={uploading === type}
                    onClick={() => fileInputRefs[type].current?.click()}
                  >
                    {uploading === type ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        {doc ? 'Re-upload' : 'Upload'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}