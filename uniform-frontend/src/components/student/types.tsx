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
  examPath: 'NATIONAL' | 'MADRASHA' | '';
  medium: 'Bangla' | 'English' | 'Arabic' | '';
  // SSC Details
  sscRoll?: string;
  sscRegistration?: string;
  sscGpa?: string;
  sscYear?: string;
  sscBoard?: string;
  // HSC Details
  hscRoll?: string;
  hscRegistration?: string;
  hscGpa?: string;
  hscYear?: string;
  hscBoard?: string;
  // Dakhil Details
  dakhilRoll?: string;
  dakhilRegistration?: string;
  dakhilGpa?: string;
  dakhilYear?: string;
  dakhilBoard?: string;
  // Alim Details
  alimRoll?: string;
  alimRegistration?: string;
  alimGpa?: string;
  alimYear?: string;
  alimBoard?: string;
}

export interface AcademicInfo {
  id?: string;
  userId: string;
  examPath: 'NATIONAL' | 'MADRASHA';
  // National Curriculum Fields
  sscRoll: string;
  sscRegistration: string;
  sscGpa: number;
  sscYear: number;
  sscBoard: string;
  hscRoll: string;
  hscRegistration: string;
  hscGpa: number;
  hscYear: number;
  hscBoard: string;
  // Madrasha Curriculum Fields
  dakhilRoll: string;
  dakhilRegistration: string;
  dakhilGpa: number;
  dakhilYear: number;
  dakhilBoard: string;
  alimRoll: string;
  alimRegistration: string;
  alimGpa: number;
  alimYear: number;
  alimBoard: string;
}

export interface Application {
  id: string;
  userId: string;
  university: string;
  unit: string;
  appliedDate: string;
  status: 'Approved' | 'Under Review' | 'Rejected' | 'Pending';
}