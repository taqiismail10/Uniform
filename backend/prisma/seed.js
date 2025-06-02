// uniform/backend/prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
	console.log("Start seeding...");

	// --- Common Data ---
	const adminPassword = await bcrypt.hash("adminpassword123", 10);
	const systemAdmin = await prisma.admin.upsert({
		where: { email: "system.admin@uniform.com" },
		update: {},
		create: {
			email: "system.admin@uniform.com",
			password: adminPassword,
			role: "SYSTEM_ADMIN",
		},
	});
	console.log(`Created system admin with ID: ${systemAdmin.adminId}`);

	// --- Dhaka University Data ---
	const dhakaUniversity = await prisma.institution.upsert({
		where: { name: "Dhaka University" },
		update: {},
		create: {
			name: "Dhaka University",
			type: "UNIVERSITY",
			description: "The oldest university in Bangladesh.",
			website: "https://www.du.ac.bd",
			location: "Dhaka, Bangladesh",
			establishedIn: new Date("1921-07-01T00:00:00Z"),
		},
	});
	console.log(`Created institution: ${dhakaUniversity.name}`);

	const duUnitA = await prisma.admissionUnit.upsert({
		where: { unitId: "du-unit-a" },
		update: {
			minSscGPA: 4.5,
			minHscGPA: 4.5,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			totalSeats: 1000,
			applicationFee: 1000,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
		create: {
			unitId: "du-unit-a",
			name: "Unit A (Science & Engineering)",
			institutionId: dhakaUniversity.institutionId,
			minSscGPA: 4.5,
			minHscGPA: 4.5,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			description:
				"Admission unit for Science and Engineering faculties.",
			totalSeats: 1000,
			applicationFee: 1000,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${duUnitA.name} for ${dhakaUniversity.name}`
	);

	const duUnitB = await prisma.admissionUnit.upsert({
		where: { unitId: "du-unit-b" },
		update: {
			minSscGPA: 3.5,
			minHscGPA: 3.5,
			allowedSscStreams: ["Humanities", "Business Studies"],
			allowedHscStreams: ["Humanities", "Business Studies"],
			totalSeats: 800,
			applicationFee: 800,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
		create: {
			unitId: "du-unit-b",
			name: "Unit B (Arts & Social Sciences)",
			institutionId: dhakaUniversity.institutionId,
			minSscGPA: 3.5,
			minHscGPA: 3.5,
			allowedSscStreams: ["Humanities", "Business Studies"],
			allowedHscStreams: ["Humanities", "Business Studies"],
			description:
				"Admission unit for Arts and Social Sciences faculties.",
			totalSeats: 800,
			applicationFee: 800,
			applicationDeadline: new Date("2025-11-30T23:59:59Z"),
			admissionStart: new Date("2025-10-01T09:00:00Z"),
			admissionEnd: new Date("2025-10-31T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${duUnitB.name} for ${dhakaUniversity.name}`
	);

	const adminInstitutionDU = await prisma.adminInstitution.upsert({
		where: {
			id: `${systemAdmin.adminId}-${dhakaUniversity.institutionId}`,
		},
		update: {},
		create: {
			adminId: systemAdmin.adminId,
			institutionId: dhakaUniversity.institutionId,
		},
	});
	console.log(
		`Linked admin ${systemAdmin.email} to institution ${dhakaUniversity.name}`
	);

	// --- University of Chittagong Data ---
	const chittagongUniversity = await prisma.institution.upsert({
		where: { name: "University of Chittagong" },
		update: {},
		create: {
			name: "University of Chittagong",
			type: "UNIVERSITY",
			description:
				"A public university located in Chittagong, Bangladesh.",
			website: "https://cu.ac.bd",
			location: "Chittagong, Bangladesh",
			establishedIn: new Date("1966-11-18T00:00:00Z"),
		},
	});
	console.log(`Created institution: ${chittagongUniversity.name}`);

	const cuUnitScience = await prisma.admissionUnit.upsert({
		where: { unitId: "cu-unit-science" },
		update: {
			minSscGPA: 4.0,
			minHscGPA: 4.0,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			totalSeats: 700,
			applicationFee: 950,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
		create: {
			unitId: "cu-unit-science",
			name: "Unit A (Science Faculty)",
			institutionId: chittagongUniversity.institutionId,
			minSscGPA: 4.0,
			minHscGPA: 4.0,
			allowedSscStreams: ["Science"],
			allowedHscStreams: ["Science"],
			description: "Admission unit for various Science disciplines.",
			totalSeats: 700,
			applicationFee: 950,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${cuUnitScience.name} for ${chittagongUniversity.name}`
	);

	const cuUnitArts = await prisma.admissionUnit.upsert({
		where: { unitId: "cu-unit-arts" },
		update: {
			minSscGPA: 3.0,
			minHscGPA: 3.0,
			allowedSscStreams: ["Humanities"],
			allowedHscStreams: ["Humanities"],
			totalSeats: 500,
			applicationFee: 750,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
		create: {
			unitId: "cu-unit-arts",
			name: "Unit B (Arts & Social Sciences)",
			institutionId: chittagongUniversity.institutionId,
			minSscGPA: 3.0,
			minHscGPA: 3.0,
			allowedSscStreams: ["Humanities"],
			allowedHscStreams: ["Humanities"],
			description:
				"Admission unit for Arts and Social Sciences faculties.",
			totalSeats: 500,
			applicationFee: 750,
			applicationDeadline: new Date("2025-11-25T23:59:59Z"),
			admissionStart: new Date("2025-10-05T09:00:00Z"),
			admissionEnd: new Date("2025-10-25T17:00:00Z"),
		},
	});
	console.log(
		`Created admission unit: ${cuUnitArts.name} for ${chittagongUniversity.name}`
	);

	const adminInstitutionCU = await prisma.adminInstitution.upsert({
		where: {
			id: `${systemAdmin.adminId}-${chittagongUniversity.institutionId}`,
		},
		update: {},
		create: {
			adminId: systemAdmin.adminId,
			institutionId: chittagongUniversity.institutionId,
		},
	});
	console.log(
		`Linked admin ${systemAdmin.email} to institution ${chittagongUniversity.name}`
	);

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
