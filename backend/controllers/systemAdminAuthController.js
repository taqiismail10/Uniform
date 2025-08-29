// backend/controllers/systemAdminAuthController.js
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
import { adminLoginSchema, createInstitutionAdminSchema } from "../validations/AuthValidation.js";
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

			// Update last login timestamp
			await prisma.systemadmin.update({
				where: { systemAdminId: findAdmin.systemAdminId },
				data: { lastLogin: new Date() },
			});

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

			// Create institution with optional fields
			const ownership = payload.ownership ? String(payload.ownership).toUpperCase() : undefined;
			const instType = payload.type ? String(payload.type).toUpperCase() : undefined;
			const institution = await prisma.institution.create({
				data: {
					name: payload.name.trim(),
					description: payload.description ?? null,
					address: payload.address ?? null,
					phone: payload.phone ?? null,
					email: payload.email ?? null,
					website: payload.website ?? null,
					establishedYear: payload.establishedYear ?? null,
					logoUrl: payload.logoUrl ?? null,
					ownership: ownership ?? null,
					type: instType ?? null,
					institutionCategoryInstitutionCategoryId: categoryId,
				},
				include: {
					InstitutionCategory: true,
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
			// Validate input
			const validator = vine.compile(createInstitutionAdminSchema);
			const { email, password, institutionId } = await validator.validate(req.body);

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
					lastLogin: true,
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
			let page = req.query.page !== undefined ? Number(req.query.page) : undefined;
			let limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;

			const include = { InstitutionCategory: true };
			const orderBy = { createdAt: 'desc' };

			if (page !== undefined || limit !== undefined) {
				page = !page || page <= 0 ? 1 : page;
				limit = !limit || limit <= 0 ? 50 : Math.min(limit, 100);
				const skip = (page - 1) * limit;

				const [institutions, totalInstitutions] = await Promise.all([
					prisma.institution.findMany({ take: limit, skip, include, orderBy }),
					prisma.institution.count(),
				]);

				const totalPages = Math.ceil(totalInstitutions / limit);
				return res.status(200).json({
					status: 200,
					institutions,
					metadata: {
						totalPages,
						currentPage: page,
						currentLimit: limit,
					},
				});
			} else {
				const institutions = await prisma.institution.findMany({ include, orderBy });
				return res.status(200).json({ status: 200, institutions });
			}
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

	static async updatePassword(req, res) {
		try {
			const { systemAdminId } = req.admin;
			const { oldPassword, newPassword } = req.body;
			if (!oldPassword || !newPassword) {
				return res.status(400).json({ status: 400, message: 'Old and new password are required' });
			}
			const admin = await prisma.systemadmin.findUnique({ where: { systemAdminId } });
			if (!admin) {
				return res.status(404).json({ status: 404, message: 'System admin not found' });
			}
			const valid = bcrypt.compareSync(oldPassword, admin.password);
			if (!valid) {
				return res.status(400).json({ status: 400, message: 'Old password is incorrect' });
			}
			const hashed = await bcrypt.hash(newPassword, 10);
			await prisma.systemadmin.update({ where: { systemAdminId }, data: { password: hashed } });
			return res.status(200).json({ status: 200, message: 'Password updated successfully' });
		} catch (error) {
			console.error('Error updating system admin password:', error);
			return res.status(500).json({ status: 500, message: 'Something went wrong' });
		}
	}

	static async updateEmail(req, res) {
		try {
			const { systemAdminId } = req.admin;
			let { email } = req.body;
			if (!email) return res.status(400).json({ status: 400, message: 'Email is required' });
			email = String(email).trim().toLowerCase();
			const exists = await prisma.systemadmin.findFirst({ where: { email, NOT: { systemAdminId } } });
			if (exists) {
				return res.status(409).json({ status: 409, message: 'Email already in use' });
			}
			const updated = await prisma.systemadmin.update({ where: { systemAdminId }, data: { email } });
			return res.status(200).json({ status: 200, message: 'Email updated successfully', profile: {
				systemAdminId: updated.systemAdminId,
				email: updated.email,
				role: updated.role,
				createdAt: updated.createdAt,
				updatedAt: updated.updatedAt,
			}});
		} catch (error) {
			console.error('Error updating system admin email:', error);
			return res.status(500).json({ status: 500, message: 'Something went wrong' });
		}
	}

	static async fetchAdmins(req, res) {
		try {
			let page = req.query.page !== undefined ? Number(req.query.page) : undefined;
			let limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;
			const search = req.query.search ? String(req.query.search) : undefined;
			const institutionId = req.query.institutionId ? String(req.query.institutionId) : undefined;

			const where = { role: 'INSTITUTION_ADMIN' };
			if (search) {
				where.OR = [
					{ email: { contains: search, mode: 'insensitive' } },
				];
			}
			if (institutionId) {
				where.institutionId = institutionId;
			}

			const include = { institution: { select: { institutionId: true, name: true } } };
			const orderBy = { createdAt: 'desc' };

			if (page !== undefined || limit !== undefined) {
				page = !page || page <= 0 ? 1 : page;
				limit = !limit || limit <= 0 ? 50 : Math.min(limit, 100);
				const skip = (page - 1) * limit;

				const [admins, totalAdmins] = await Promise.all([
					prisma.admin.findMany({ where, include, orderBy, skip, take: limit }),
					prisma.admin.count({ where }),
				]);

				const totalPages = Math.ceil(totalAdmins / limit);
				return res.status(200).json({
					status: 200,
					admins,
					metadata: {
						totalPages,
						currentPage: page,
						currentLimit: limit,
						totalItems: totalAdmins,
					},
				});
			} else {
				const admins = await prisma.admin.findMany({ where, include, orderBy });
				return res.status(200).json({ status: 200, admins });
			}
		} catch (error) {
			console.error('Error fetching admins:', error);
			return res.status(500).json({ status: 500, message: 'Something went wrong' });
		}
	}

	static async deleteAdmin(req, res) {
		try {
			const { adminId } = req.params;
			if (!adminId) {
				return res.status(400).json({ status: 400, message: 'adminId is required' });
			}
			const existing = await prisma.admin.findUnique({ where: { adminId } });
			if (!existing) {
				return res.status(404).json({ status: 404, message: 'Admin not found' });
			}
			await prisma.admin.delete({ where: { adminId } });
			return res.status(200).json({ status: 200, message: 'Admin deleted successfully', adminId });
		} catch (error) {
			console.error('Error deleting admin:', error);
			return res.status(500).json({ status: 500, message: 'Something went wrong' });
		}
	}

	static async getInstitutionById(req, res) {
		try {
			const { institutionId } = req.params;
			const institution = await prisma.institution.findUnique({
				where: { institutionId },
				include: { InstitutionCategory: true },
			});
			if (!institution) {
				return res.status(404).json({ status: 404, message: 'Institution not found' });
			}
			return res.status(200).json({ status: 200, institution });
		} catch (error) {
			return res.status(500).json({ status: 500, message: 'Something went wrong' });
		}
	}

	static async updateInstitution(req, res) {
		try {
			const { institutionId } = req.params;
			const validator = vine.compile(institutionSystemSchema);
			const payload = await validator.validate(req.body);

			let categoryId = null;
			if (payload.categoryName !== undefined) {
				const trimmed = payload.categoryName?.trim() || '';
				if (trimmed !== '') {
					const categoryTitleCase = toTitleCase(trimmed);
					const existingCategory = await prisma.institutionCategory.findFirst({
						where: { name: { equals: categoryTitleCase, mode: 'insensitive' } },
					});
					if (existingCategory) {
						categoryId = existingCategory.institutionCategoryId;
					} else {
						const newCategory = await prisma.institutionCategory.create({
							data: { name: categoryTitleCase },
						});
						categoryId = newCategory.institutionCategoryId;
					}
				} else {
					categoryId = null; // Explicitly clear category if empty string provided
				}
			}

			const ownership = payload.ownership !== undefined ? String(payload.ownership).toUpperCase() : undefined;
			const instType = payload.type !== undefined ? String(payload.type).toUpperCase() : undefined;
			const updated = await prisma.institution.update({
				where: { institutionId },
				data: {
					name: payload.name.trim(),
					description: payload.description ?? null,
					address: payload.address ?? null,
					phone: payload.phone ?? null,
					email: payload.email ?? null,
					website: payload.website ?? null,
					establishedYear: payload.establishedYear ?? null,
					logoUrl: payload.logoUrl ?? null,
					// Only set category if provided in payload; otherwise leave unchanged
					...(payload.categoryName !== undefined
						? { institutionCategoryInstitutionCategoryId: categoryId }
						: {}),
					// Only update enums if provided
					...(ownership !== undefined ? { ownership } : {}),
					...(instType !== undefined ? { type: instType } : {}),
				},
				include: { InstitutionCategory: true },
			});

			return res.status(200).json({ status: 200, institution: updated });
		} catch (error) {
			if (error instanceof errors.E_VALIDATION_ERROR) {
				return res.status(400).json({ errors: error.messages });
			} else {
				console.error(error);
				return res.status(500).json({ status: 500, message: 'Something went wrong' });
			}
		}
	}
}

export default systemAdminAuthController;
