// backend/routes/api.js
import { Router } from "express";
import authController from "../controllers/AuthController.js";
import profileController from "../controllers/ProfileController.js";
import authMiddleware from "../middleware/Authenticate.js";
const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.put("/auth/update-email", authMiddleware, authController.updateEmail);
router.delete(
	"/auth/delete-account",
	authMiddleware,
	authController.deleteAccount
);

// Profile routes
router.get("/profile", authMiddleware, profileController.index); // Private route
router.put("/profile/:id", authMiddleware, profileController.update); // Private route

// AcademicInfo routes
router.get(
	"/academicInfo",
	authMiddleware,
	profileController.getAcademicDetails
); // Private route
router.get(
	"/academicInfo/:id",
	authMiddleware,
	profileController.getAcademicDetails
); // Private route

export default router;
