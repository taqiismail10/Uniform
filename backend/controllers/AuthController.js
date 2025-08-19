// backend/controllers/AuthController.js
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
import { loginSchema, registerSchema } from "../validations/AuthValidation.js";

// Add email update validation schema
const updateEmailSchema = vine.object({
	userId: vine.string(),
	newEmail: vine.string().email(),
});

class authController {
	// User registration method
	static async register(req, res) {
		try {
			const body = req.body;
			const validator = vine.compile(registerSchema);
			const payload = await validator.validate(body);
			const findUser = await prisma.student.findUnique({
				where: {
					email: payload.email,
				},
			});
			if (findUser) {
				return res.status(400).json({
					error: "Email already exist",
				});
			}
			// * Encrypt the password
			const salt = bcrypt.genSaltSync(10);
			payload.password = bcrypt.hashSync(payload.password, salt);
			delete payload.password_confirmation;
			const user = await prisma.student.create({
				data: payload,
			});
			return res.json({
				status: 200,
				message: "User created successfully",
				user,
			});
		} catch (error) {
			console.log("Validation/other error:", error);
			if (error instanceof errors.E_VALIDATION_ERROR) {
				// console.log(error.messages)
				return res.status(400).json({ errors: error.messages });
			} else {
				console.error(error); // Add this line
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}

	// User Login Method
	static async login(req, res) {
		try {
			const body = req.body;
			const validator = vine.compile(loginSchema);
			const payload = await validator.validate(body);
			const findUser = await prisma.student.findUnique({
				where: {
					email: payload.email,
				},
			});
			if (findUser) {
				if (!bcrypt.compareSync(payload.password, findUser.password)) {
					return res.json({
						status: 400,
						message: "Invalid Credentials",
					});
				}
				// * Issue token to user
				const payloadData = {
					studentId: findUser.studentId, // Use correct property name as per Prisma schema
					email: findUser.email,
				};
				const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
					expiresIn: "365d",
				});
				return res.json({
					status: 200,
					message: "User logged in successfully",
					access_token: `Bearer ${token}`,
				});
			}
			return res.json({ status: 400, message: "User not found" });
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				// console.log(error.messages)
				return res.status(400).json({ errors: error.messages });
			} else {
				console.error(error); // Add this line
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}

	// Account Deletion Method
	static async deleteAccount(req, res) {
		try {
			const { password } = req.body;
			// Get user information from the JWT token (set by auth middleware)
			const studentId = req.user.studentId;
			if (!password) {
				return res.status(400).json({
					status: 400,
					message: "Password is required to delete account",
				});
			}
			// Find the user in the database
			const user = await prisma.student.findUnique({
				where: {
					studentId: studentId,
				},
			});
			if (!user) {
				return res.status(404).json({
					status: 404,
					message: "User not found",
				});
			}
			// Compare provided password with stored hash
			const isPasswordValid = bcrypt.compareSync(password, user.password);
			if (!isPasswordValid) {
				return res.status(401).json({
					status: 401,
					message: "Invalid password",
				});
			}
			// Delete the user account
			await prisma.student.delete({
				where: {
					studentId: studentId,
				},
			});
			// Return success response
			return res.status(200).json({
				status: 200,
				message: "Account successfully deleted",
			});
		} catch (error) {
			console.error("Error deleting account:", error);
			return res.status(500).json({
				status: 500,
				message: "Failed to delete account",
				error: error.message,
			});
		}
	}

	// Email Update Method
	static async updateEmail(req, res) {
		try {
			const { userId, newEmail } = req.body;
			const authenticatedStudentId = req.user.studentId;

			// Validate input
			const validator = vine.compile(updateEmailSchema);
			const payload = await validator.validate({ userId, newEmail });

			// Check if the authenticated user matches the requested userId
			if (userId !== authenticatedStudentId) {
				return res.status(403).json({
					status: 403,
					message: "Unauthorized: You can only update your own email",
				});
			}

			// Find the current user
			const currentUser = await prisma.student.findUnique({
				where: {
					studentId: userId,
				},
			});

			if (!currentUser) {
				return res.status(404).json({
					status: 404,
					message: "User not found",
				});
			}

			// Check if new email is same as current
			if (currentUser.email === newEmail) {
				return res.status(400).json({
					status: 400,
					message: "New email is the same as current email",
				});
			}

			// Check if email is already in use by another user
			const existingUser = await prisma.student.findUnique({
				where: {
					email: newEmail,
				},
			});

			if (existingUser) {
				return res.status(400).json({
					status: 400,
					message: "Email address is already in use",
				});
			}

			// Update the user's email
			await prisma.student.update({
				where: {
					studentId: userId,
				},
				data: {
					email: newEmail,
				},
			});

			return res.status(200).json({
				status: 200,
				message: "Email updated successfully",
			});
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ errors: error.messages });
			} else {
				console.error("Update Email Error:", error);
				return res.status(500).json({
					status: 500,
					message: "Failed to update email address",
				});
			}
		}
	}
}

export default authController;
