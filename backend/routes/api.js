import { Router } from "express";
import authController from "../controllers/AuthController.js";

const router = Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// // * Profile routes
// router.get("/profile", authMiddleware, profileController.index); // Private route
// router.put("/profile/:id", authMiddleware, profileController.update); // Private route
// // router.get("/profile/:id", authMiddleware, profileController.show); // Private route

// // Form routes
// router.post("/form", authMiddleware, formController.submitForm);

// // Institution routes
// router.get("/institutions", institutionController.fetchInstitutions);
// router.get(
//   "/institutions/:institutionId/form-requirements",
//   institutionController.getInstitutionFormRequirements
// );

// // Application routes
// router.post(
//   "/applications",
//   authMiddleware,
//   applicationController.applyToInstitution
// );
// router.get(
//   "/applications",
//   authMiddleware,
//   applicationController.getApplications
// );
// router.get(
//   "/applications/:applicationId",
//   authMiddleware,
//   applicationController.getApplicationById
// );

export default router;
