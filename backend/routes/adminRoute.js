// backend/routes/adminRoute.js

import { Router } from "express";
import adminAuthController from "../controllers/adminAuthController.js";
// import institutionController from "../controllers/institutionController.js";
import institutionController from "../controllers/institutionController.js";
import unitController from "../controllers/unitController.js";
import redisCache from "../DB/redis.config.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = Router();

// Admin Authentication Routes
router.post("/auth/login", adminAuthController.login);

router.put(
  "/update-password",
  adminMiddleware,
  adminAuthController.updatePassword
);

router.put(
  "/update-institution",
  adminMiddleware,
  institutionController.updateInstitution
);

router.post("/units", adminMiddleware, unitController.createUnit); // Create units
router.put("/units/:unitId", adminMiddleware, unitController.updateUnit);
router.get("/units/:unitId", adminMiddleware, unitController.getUnitById);
router.delete("/units/:unitId", adminMiddleware, unitController.deleteUnit);

// Add these routes to your adminRoute.js
router.post(
  "/units/:unitId/requirements",
  adminMiddleware,
  unitController.addUnitRequirements
);
router.delete(
  "/units/:unitId/requirements/:requirementId",
  adminMiddleware,
  unitController.removeUnitRequirement
);

router.get(
  "/units",
  redisCache.route(),
  adminMiddleware,
  unitController.listUnits
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
