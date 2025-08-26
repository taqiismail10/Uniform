// backend/controllers/systemAdminAuthController.js
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
import { adminLoginSchema } from "../validations/AuthValidation.js";
import { institutionSystemSchema } from "../validations/institutionValidation.js";

function toTitleCase(str) {
	return str
		.toLowerCase()
		.split(" ")
		.filter((word) => word.trim() !== "") // remove accidental double spaces
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

class systemAdminAuthController {
	static async login(req, res) {
		try {
			const body = req.body;
			const validator = vine.compile(adminLoginSchema);
			const payload = await validator.validate(body);

			// Use the correct Prisma accessor for Systemadmin
			const findAdmin = await prisma.systemadmin.findUnique({
				where: { email: payload.email },
			});

			if (!findAdmin) {
				return res
					.status(400)
					.json({ status: 400, message: "User not found" });
			}

			// Check password
			const isPasswordValid = bcrypt.compareSync(
				payload.password,
				findAdmin.password
			);
			if (!isPasswordValid) {
				return res
					.status(400)
					.json({ status: 400, message: "Invalid Credentials" });
			}

			// Generate JWT token
			const payloadData = {
				systemAdminId: findAdmin.systemAdminId,
				email: findAdmin.email,
				role: findAdmin.role,
			};
			console.log(payloadData);
			const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
				expiresIn: "365d",
			});

			return res.json({
				status: 200,
				message: "System admin logged in successfully",
				access_token: `Bearer ${token}`,
			});
		} catch (error) {
			console.error("Error during system admin login:", error);
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ errors: error.messages });
			} else {
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}

	static async createInstitution(req, res) {
		try {
			const user = req.user;
			const validator = vine.compile(institutionSystemSchema);
			const payload = await validator.validate(req.body);

			let categoryId = null;

			if (payload.categoryName && payload.categoryName.trim() !== "") {
				const categoryTitleCase = toTitleCase(payload.categoryName);

				// Search category case-insensitively
				const existingCategory =
					await prisma.institutionCategory.findFirst({
						where: {
							name: {
								equals: categoryTitleCase,
								mode: "insensitive",
							},
						},
					});

				if (existingCategory) {
					categoryId = existingCategory.institutionCategoryId;
				} else {
					const newCategory = await prisma.institutionCategory.create(
						{
							data: { name: categoryTitleCase },
						}
					);
					categoryId = newCategory.institutionCategoryId;
				}
			}

			// Create institution
			const institution = await prisma.institution.create({
				data: {
					name: payload.name.trim(),
					institutionCategoryInstitutionCategoryId: categoryId,
				},
			});

			return res.status(201).json({
				status: 201,
				message: "Institution added successfully!",
				institution,
			});
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ errors: error.messages });
			} else {
				console.error(error);
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}

	static async deleteInstitution(req, res) {
		try {
			const { institutionId } = req.params;

			// Delete institution from the database
			await prisma.institution.delete({
				where: { institutionId },
			});

			return res.status(200).json({
				status: 200,
				message: "Institution deleted successfully!",
			});
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				// console.log(error.messages)
				return res.status(400).json({ errors: error.messages });
			} else {
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}

	static async createAndAssignInstitutionAdmin(req, res) {
		try {
			const { email, password, institutionId } = req.body;
			// Add validation logic here if needed

			if (!email || !password || !institutionId) {
				return res.status(400).json({
					status: 400,
					message: "Email, password, and institutionId are required.",
				});
			}

			// Create institution admin
			// 2. Check if the institution exists
			const institutionExists = await prisma.institution.findUnique({
				where: {
					institutionId: institutionId,
				},
			});

			if (!institutionExists) {
				return res.status(404).json({
					status: 404,
					message: "Institution not found.",
				});
			}

			// Check if admin email already exists
			const existingAdmin = await prisma.admin.findUnique({
				where: { email },
			});
			if (existingAdmin) {
				return res.status(409).json({
					status: 409,
					message: "Admin with this email already exists.",
				});
			}

			// 3. Hash the password securely
			const hashedPassword = await bcrypt.hash(password, 10);

			// 4. Create the institution admin and link to the institution
			const newAdmin = await prisma.admin.create({
				data: {
					email: email,
					password: hashedPassword,
					role: "INSTITUTION_ADMIN",
					institutionId: institutionId, // Crucial: Link the admin to the institution
				},
				include: {
					institution: true, // Include institution details in the response
				},
			});

			return res.status(200).json({
				status: 200,
				message: "Institution admin created successfully",
				admin: newAdmin,
			});
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
	static async unassignInstitutionAdmin(req, res) {
		try {
			const { adminId } = req.params;

			// Check if the admin exists
			const existingAdmin = await prisma.admin.findUnique({
				where: { adminId },
			});

			if (!existingAdmin) {
				return res.status(404).json({
					status: 404,
					message: "Institution admin not found.",
				});
			}

			// Update admin's institutionId to null (unassign institution)
			const updatedAdmin = await prisma.admin.update({
				where: { adminId },
				data: { institutionId: null },
			});

			return res.status(200).json({
				status: 200,
				message: "Admin unassigned from institution successfully.",
				admin: updatedAdmin,
			});
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ errors: error.messages });
			} else {
				console.error(error);
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}

	static async index(req, res) {
		try {
			const { systemAdminId } = req.admin; // Coming from systemAdminMiddleware

			const profile = await prisma.systemadmin.findUnique({
				where: { systemAdminId: systemAdminId },
				select: {
					systemAdminId: true,
					email: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!profile) {
				return res.status(404).json({
					status: 404,
					message: "System admin profile not found.",
				});
			}

			return res.status(200).json({
				status: 200,
				profile,
				admin: req.admin, // Include the authenticated admin data
			});
		} catch (error) {
			console.error("Error fetching system admin profile:", error);
			return res.status(500).json({
				status: 500,
				message: "Something went wrong.",
			});
		}
	}

	static async fetchInstitutions(req, res) {
		try {
			const institutions = await prisma.institution.findMany();
			// institutionService.getAllInstitutions();
			return res.status(200).json({ status: 200, institutions });
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				// console.log(error.messages)
				return res.status(400).json({ errors: error.messages });
			} else {
				return res
					.status(500)
					.json({ status: 500, message: "Something went wrong" });
			}
		}
	}
}

export default systemAdminAuthController;
