// import adminAuthController from "../controllers/adminAuthController.js";
import { Router } from "express";
import {
  default as institutionController,
  default as systemAdminAuthController,
} from "../controllers/systemAdminAuthController.js";
import systemAdminMiddleware from "../middleware/systemAdminMiddleware.js";

const router = Router();

router.post("/auth/login", systemAdminAuthController.login);

// System_Admin routes
router.post(
  "/admins/create-and-assign",
  systemAdminMiddleware, // Only SYSTEM_ADMIN can access
  systemAdminAuthController.createAndAssignInstitutionAdmin
);

// Institution routes
router.post(
  "/institutions",
  systemAdminMiddleware,
  institutionController.createInstitution
);

router.delete(
  "/institutions/:institutionId",
  systemAdminMiddleware,
  institutionController.deleteInstitution
);

router.patch(
  "/admins/:adminId/unassign-institution",
  systemAdminMiddleware, // Only SYSTEM_ADMIN allowed
  systemAdminAuthController.unassignInstitutionAdmin
);

export default router;
