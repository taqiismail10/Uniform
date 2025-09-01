// backend/routes/api.js
import { Router } from "express";
import authController from "../controllers/AuthController.js";
import profileController from "../controllers/ProfileController.js";
import redisCache from "../DB/redis.config.js";
import authMiddleware from "../middleware/Authenticate.js";
import studentMiddleware from "../middleware/studentMiddleware.js";
const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.put("/auth/update-email", studentMiddleware, authController.updateEmail);
router.delete(
  "/auth/delete-account",
  studentMiddleware,
  authController.deleteAccount
);
router.post(
  "/auth/change-password",
  studentMiddleware,
  authController.changePassword
);

// Profile routes
router.get(
  "/profile",
  studentMiddleware,
  profileController.index
); // Private route (no cache to avoid stale profile image)
router.put("/profile/:id", studentMiddleware, profileController.update); // Private route

// AcademicInfo routes
router.get(
  "/academicInfo",
  studentMiddleware,
  profileController.getAcademicDetails
); // Private route
router.get(
  "/academicInfo/:id",
  studentMiddleware,
  profileController.getAcademicDetails
); // Private route

export default router;
