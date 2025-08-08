// import adminAuthController from "../controllers/adminAuthController.js";
// import institutionController from "../controllers/institutionController.js";
import systemAdminMiddleware from "../middleware/systemAdminMiddleware.js";
import systemAdminAuthController from "../controllers/systemAdminAuthController.js";
import { Router } from "express";

const router = Router();



router.post("/auth/login", systemAdminAuthController.login);

// System_Admin routes
router.post(
  "/admins",
  systemAdminMiddleware, // Only SYSTEM_ADMIN can access
  systemAdminAuthController.createInstitutionAdmin
);

// Institution routes
// router.post(
//   "/institutions",
//   systemAdminMiddleware,
//   institutionController.createInstitution
// );


export default router;
