// backend/routes/adminRoute.js

import { Router } from "express";
import adminAuthController from "../controllers/adminAuthController.js";
// import institutionController from "../controllers/institutionController.js";
import institutionController from "../controllers/institutionController.js";
import unitController from "../controllers/unitController.js";
import adminStatsController from "../controllers/adminStatsController.js";
import applicationController from "../controllers/applicationController.js";
import redisCache from "../DB/redis.config.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = Router();

// Admin Authentication Routes
router.post("/auth/login", adminAuthController.login);

router.get(
  "/profile",
  adminMiddleware,
  adminAuthController.index
);

router.put(
  "/update-email",
  adminMiddleware,
  adminAuthController.updateEmail
);

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

// Institution details for current admin
router.get(
  "/institution",
  adminMiddleware,
  institutionController.getOwnInstitution
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

// Institution stats summary
router.get(
  "/stats",
  adminMiddleware,
  adminStatsController.stats
);

// Update current admin's institution minimal fields (e.g., shortName)
router.put(
  "/institution",
  adminMiddleware,
  institutionController.updateOwnInstitution
);

// Applications overview for institution
router.get(
  "/applications",
  adminMiddleware,
  applicationController.list
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
