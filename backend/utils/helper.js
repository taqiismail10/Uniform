import { supportedMimeTypes } from "../config/fileSystem.js";
import { v4 as uuidv4 } from "uuid";
export const imageValidator = (size, mime) => {
  if (bytesToMb(size) > 2) {
    return "Image size should not be more than 2 MB";
  } else if (!supportedMimeTypes.includes(mime)) {
    return "Image type not supported";
  }
  return null;
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const generateRandomNum = () => {
  return uuidv4();
};

export const checkGPARequirements = (studentForm, institution) => {
  return (
    studentForm.hscGPA >= institution.requirementsHscGPA &&
    studentForm.sscGPA >= institution.requirementsSscGPA
  );
};
