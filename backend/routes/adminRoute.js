// backend/routes/adminRoute.js

import { Router } from "express";
import adminAuthController from "../controllers/adminAuthController.js";
// import institutionController from "../controllers/institutionController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

// Admin Authentication Routes
router.post("/auth/login", adminAuthController.login);

router.put(
  "/update-password",
  adminMiddleware,
  adminAuthController.updatePassword
);

// Institution Management
// Get admin's institution details
// router.get(  "/institutions",  adminMiddleware, institutionController.fetchInstitutions);
// Update institution information
// router.put(  "/institution",  adminMiddleware,institutionController.updateInstitution);

// router.put(
//   "/institutions/:institutionId",
//   adminMiddleware,
//   institutionController.updateInstitution
// );
// router.delete(
//   "/institutions/:institutionId",
//   adminMiddleware,
//   institutionController.deleteInstitution
// );

export default router;
