// uniform-frontend/src/components/student/types.tsx

export interface Institution {
  institutionId: string;
  institutionName: string;
  type: string;
  description: string;
  website: string;
  location: string;
  establishedIn: string;
}

export interface UserData {
  userId: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: string;
  dob: string;
  examPath: string;
  medium: string;
}

export interface AcademicInfo {
  id?: string;
  userId: string;
  curriculum: 'national' | 'british';
  ssc?: {
    gpa: number;
    board: string;
    passingYear: number;
    roll?: string;
    registration?: string;
  };
  hsc?: {
    gpa: number;
    board: string;
    passingYear: number;
    roll?: string;
    registration?: string;
  };
  oLevel?: {
    subjects: { name: string; grade: string }[];
    board: string;
    passingYear: number;
    candidateNumber?: string;
  };
  aLevel?: {
    subjects: { name: string; grade: string }[];
    board: string;
    passingYear: number;
    candidateNumber?: string;
  };
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'profile' | 'ssc' | 'hsc' | 'oLevel' | 'aLevel' | 'other';
  url: string;
  uploadedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  university: string;
  unit: string;
  appliedDate: string;
  status: 'Approved' | 'Under Review' | 'Rejected' | 'Pending';
}