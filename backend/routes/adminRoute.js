// backend/routes/adminRoute.js

import { Router } from "express";
import adminAuthController from "../controllers/adminAuthController.js";
// import institutionController from "../controllers/institutionController.js";
import institutionController from "../controllers/institutionController.js";
import unitController from "../controllers/unitController.js";
import adminStatsController from "../controllers/adminStatsController.js";
import applicationController from "../controllers/applicationController.js";
import { cacheRoute } from "../middleware/cache.js";
import { bustUserCache } from "../middleware/cacheBust.js";
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

router.post(
  "/units",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  unitController.createUnit
); // Create units
router.put(
  "/units/:unitId",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  unitController.updateUnit
);
router.get(
  "/units/:unitId",
  adminMiddleware,
  cacheRoute({ ttl: 300 }),
  unitController.getUnitById
);
router.delete(
  "/units/:unitId",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  unitController.deleteUnit
);
// Update unit-level exam details
router.put(
  "/units/:unitId/exam",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  unitController.setUnitExamDetails
);

// Add these routes to your adminRoute.js
router.post(
  "/units/:unitId/requirements",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  unitController.addUnitRequirements
);
router.delete(
  "/units/:unitId/requirements/:requirementId",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  unitController.removeUnitRequirement
);

router.get("/units", adminMiddleware, cacheRoute({ ttl: 300 }), unitController.listUnits);

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
  bustUserCache({ scope: "/api/admin" }),
  institutionController.updateOwnInstitution
);

// Applications overview for institution
router.get(
  "/applications",
  adminMiddleware,
  // Applications list changes often; skip caching to avoid stale data
  applicationController.list
);
router.get(
  "/applications/:id",
  adminMiddleware,
  cacheRoute({ ttl: 120 }),
  applicationController.getById
);
router.put(
  "/applications/:id/approve",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  applicationController.approve
);
router.put(
  "/applications/:id/exam",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  applicationController.setExamDetails
);
router.delete(
  "/applications/:id",
  adminMiddleware,
  bustUserCache({ scope: "/api/admin" }),
  applicationController.remove
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
