// backend/controllers/ProfileController.js
import prisma from "../DB/db.config.js";
import { generateRandomNum, imageValidator } from "../utils/helper.js";

class ProfileController {
	static async index(req, res) {
		try {
                        const { studentId } = req.user;

                        // req.user only contains data from the JWT token which
                        // does not include the student's exam path. Retrieve the
                        // exam path from the database first so we can select the
                        // correct academic fields for the profile response.
                        const studentExamPath = await prisma.student.findUnique({
                                where: { studentId },
                                select: { examPath: true },
                        });

                        const examPath = studentExamPath?.examPath;

                        const profile = await prisma.student.findUnique({
                                where: { studentId: studentId },
                                select: {
                                        studentId: true,
                                        fullName: true,
                                        email: true,
                                        phone: true,
                                        address: true,
                                        role: true,
                                        dob: true,
                                        examPath: true, // Added
                                        medium: true, // Added
                                        profile: true,
                                        // Academic details based on examPath
                                        ...(examPath === "NATIONAL" && {
                                                sscRoll: true,
                                                sscRegistration: true,
                                                sscGpa: true,
                                                sscYear: true,
                                                sscBoard: true,
                                                hscRoll: true,
                                                hscRegistration: true,
                                                hscGpa: true,
                                                hscYear: true,
                                                hscBoard: true,
                                        }),
                                        ...(examPath === "MADRASHA" && {
                                                dakhilRoll: true,
                                                dakhilRegistration: true,
                                                dakhilGpa: true,
                                                dakhilYear: true,
                                                dakhilBoard: true,
                                                alimRoll: true,
                                                alimRegistration: true,
                                                alimGpa: true,
                                                alimYear: true,
                                                alimBoard: true,
                                        }),
                                        createdAt: true,
                                        updatedAt: true,
                                },
                        });

			if (!profile) {
				return res.status(404).json({ message: "Profile not found." });
			}

			return res.status(200).json({
				status: 200,
				profile,
				user: req.user,
			});
		} catch (error) {
			console.error("Error fetching profile:", error);
			return res.status(500).json({ message: "Something went wrong." });
		}
	}

	static async update(req, res) {
		try {
			const studentId = req.params.id;
			const authUser = req.user;

			// Authorization check
			if (
				authUser.studentId !== studentId &&
				authUser.role !== "SYSTEM_ADMIN"
			) {
				return res.status(403).json({
					status: 403,
					message: "Unauthorized to update this profile",
				});
			}

			// Get current student data
			const currentStudent = await prisma.student.findUnique({
				where: { studentId },
			});

			if (!currentStudent) {
				return res.status(404).json({
					status: 404,
					message: "Student not found",
				});
			}

			// Prepare update data
			const updateData = {};

			// Handle profile image upload if provided
			if (req.files && req.files.profile) {
				const profile = req.files.profile;
				const message = imageValidator(
					profile?.size,
					profile?.mimetype
				);
				console.log("Message ------- : \n", message);
				if (message !== null) {
					return res.status(400).json({
						status: 400,
						errors: { profile: message },
					});
				}

				const imgExt = profile?.name.split(".");
				const imgName = generateRandomNum() + "." + imgExt[1];
				const uploadPath = process.cwd() + "/public/images/" + imgName;

				profile.mv(uploadPath, (err) => {
					if (err) {
						console.error("File upload error:", err);
						return res.status(500).json({
							status: 500,
							message: "Failed to upload image",
						});
					}
				});

				updateData.profile = imgName;
			}

			// Handle basic profile fields
			const { fullName, email, phone, address, dob, examPath, medium } =
				req.body;

			if (fullName) updateData.fullName = fullName;
			if (email) {
				// Check if email is already in use by another student
				const existingStudent = await prisma.student.findFirst({
					where: {
						email,
						NOT: { studentId },
					},
				});

				if (existingStudent) {
					return res.status(400).json({
						status: 400,
						message: "Email is already in use by another account",
					});
				}

				updateData.email = email;
			}
			if (phone) updateData.phone = phone;
			if (address) updateData.address = address;
			if (dob) updateData.dob = new Date(dob);
			if (examPath) updateData.examPath = examPath;
			if (medium) updateData.medium = medium;

			// Handle academic details based on examPath
			if (examPath === "NATIONAL") {
				const {
					sscRoll,
					sscRegistration,
					sscGpa,
					sscYear,
					sscBoard,
					hscRoll,
					hscRegistration,
					hscGpa,
					hscYear,
					hscBoard,
				} = req.body;

				if (sscRoll) updateData.sscRoll = sscRoll;
				if (sscRegistration)
					updateData.sscRegistration = sscRegistration;
				if (sscGpa) updateData.sscGpa = parseFloat(sscGpa);
				if (sscYear) updateData.sscYear = parseInt(sscYear);
				if (sscBoard) updateData.sscBoard = sscBoard;

				if (hscRoll) updateData.hscRoll = hscRoll;
				if (hscRegistration)
					updateData.hscRegistration = hscRegistration;
				if (hscGpa) updateData.hscGpa = parseFloat(hscGpa);
				if (hscYear) updateData.hscYear = parseInt(hscYear);
				if (hscBoard) updateData.hscBoard = hscBoard;
			}

			if (examPath === "MADRASHA") {
				const {
					dakhilRoll,
					dakhilRegistration,
					dakhilGpa,
					dakhilYear,
					dakhilBoard,
					alimRoll,
					alimRegistration,
					alimGpa,
					alimYear,
					alimBoard,
				} = req.body;

				if (dakhilRoll) updateData.dakhilRoll = dakhilRoll;
				if (dakhilRegistration)
					updateData.dakhilRegistration = dakhilRegistration;
				if (dakhilGpa) updateData.dakhilGpa = parseFloat(dakhilGpa);
				if (dakhilYear) updateData.dakhilYear = parseInt(dakhilYear);
				if (dakhilBoard) updateData.dakhilBoard = dakhilBoard;

				if (alimRoll) updateData.alimRoll = alimRoll;
				if (alimRegistration)
					updateData.alimRegistration = alimRegistration;
				if (alimGpa) updateData.alimGpa = parseFloat(alimGpa);
				if (alimYear) updateData.alimYear = parseInt(alimYear);
				if (alimBoard) updateData.alimBoard = alimBoard;
			}

			// Update the student profile
			const updatedProfile = await prisma.student.update({
				data: updateData,
				where: { studentId },
				select: {
					studentId: true,
					fullName: true,
					email: true,
					phone: true,
					address: true,
					role: true,
					dob: true,
					examPath: true,
					medium: true,
					profile: true,
					// Include academic details based on examPath
					...(examPath === "NATIONAL" && {
						sscRoll: true,
						sscRegistration: true,
						sscGpa: true,
						sscYear: true,
						sscBoard: true,
						hscRoll: true,
						hscRegistration: true,
						hscGpa: true,
						hscYear: true,
						hscBoard: true,
					}),
					...(examPath === "MADRASHA" && {
						dakhilRoll: true,
						dakhilRegistration: true,
						dakhilGpa: true,
						dakhilYear: true,
						dakhilBoard: true,
						alimRoll: true,
						alimRegistration: true,
						alimGpa: true,
						alimYear: true,
						alimBoard: true,
					}),
					updatedAt: true,
				},
			});

			return res.json({
				status: 200,
				message: "Profile updated successfully!",
				profile: updatedProfile,
			});
		} catch (error) {
			console.error("Profile update error:", error);
			return res.status(500).json({
				status: 500,
				message: "Something went wrong. Try again",
			});
		}
	}

	// New method to get academic details specifically
	static async getAcademicDetails(req, res) {
		try {
			const studentId = req.user.studentId;
			const { examPath } = await prisma.student.findUnique({
				where: { studentId },
				select: { examPath: true },
			});

			const student = await prisma.student.findUnique({
				where: { studentId },
				select: {
					studentId: true,
					examPath: true,
					medium: true,
					// Academic details based on examPath
					...(examPath === "NATIONAL" && {
						sscRoll: true,
						sscRegistration: true,
						sscGpa: true,
						sscYear: true,
						sscBoard: true,
						hscRoll: true,
						hscRegistration: true,
						hscGpa: true,
						hscYear: true,
						hscBoard: true,
					}),
					...(examPath === "MADRASHA" && {
						dakhilRoll: true,
						dakhilRegistration: true,
						dakhilGpa: true,
						dakhilYear: true,
						dakhilBoard: true,
						alimRoll: true,
						alimRegistration: true,
						alimGpa: true,
						alimYear: true,
						alimBoard: true,
					}),
				},
			});

			if (!student) {
				return res.status(404).json({ message: "Student not found." });
			}

			return res.status(200).json({
				status: 200,
				academicDetails: student,
			});
		} catch (error) {
			console.error("Error fetching academic details:", error);
			return res.status(500).json({ message: "Something went wrong." });
		}
	}
}

export default ProfileController;
