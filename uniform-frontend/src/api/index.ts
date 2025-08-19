// src/api/index.ts

// Auth functions
export {
  registerUser,
  userLogin,
  deleteAccount,
  updateEmail,
} from "./auth";

// Profile functions
export {
  getUserProfile,
  getAcademicDetails,
  updateUserProfile,
  getAcademicInfo,
  saveAcademicInfo,
  type ProfileData,
} from "./profile";

// Institution functions
export {
  getInstitutions,
  getInstitutionById,
} from "./institution";

// Application functions
export {
  getApplications,
  submitApplication,
  updateApplicationStatus,
} from "./application";

// User functions
export {
  getUserById,
} from "./user";

// Export types
export type {
  AcademicInfo,
  Application,
  Institution,
  UserData,
} from "@/components/student/types";