// backend/routes/systemAdminRoute.js
// import adminAuthController from "../controllers/adminAuthController.js";
import { Router } from "express";
import {
	default as institutionController,
	default as systemAdminAuthController,
} from "../controllers/systemAdminAuthController.js";
import redisCache from "../DB/redis.config.js";
import systemAdminMiddleware from "../middleware/systemAdminMiddleware.js";

const router = Router();

router.post("/auth/login", systemAdminAuthController.login);

// System_Admin routes
router.post(
	"/admins/create-and-assign",
	systemAdminMiddleware, // Only SYSTEM_ADMIN can access
	systemAdminAuthController.createAndAssignInstitutionAdmin
);

router.get(
	"/admins/profile",
	redisCache.route(),
	systemAdminMiddleware, // Only SYSTEM_ADMIN can access
	systemAdminAuthController.index
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

router.get(
    "/institutions/:institutionId",
    systemAdminMiddleware,
    institutionController.getInstitutionById
);

router.put(
    "/institutions/:institutionId",
    systemAdminMiddleware,
    institutionController.updateInstitution
);

router.patch(
	"/admins/:adminId/unassign-institution",
	systemAdminMiddleware, // Only SYSTEM_ADMIN allowed
	systemAdminAuthController.unassignInstitutionAdmin
);

router.get(
	"/institutions",
	redisCache.route(),
	systemAdminMiddleware,
	systemAdminAuthController.fetchInstitutions
);

export default router;
