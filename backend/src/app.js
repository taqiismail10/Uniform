// uniform/backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config(); // Load environment variables from .env file

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("UniForm Backend API is running!");
});

app.get("/test-db", async (req, res) => {
	try {
		await prisma.$connect();
		res.status(200).json({ message: "Database connection successful!" });
	} catch (error) {
		console.error("Database connection error:", error);
		res.status(500).json({
			message: "Database connection failed.",
			error: error.message,
		});
	} finally {
		await prisma.$disconnect();
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Access it at http://localhost:${PORT}`);
});

process.on("beforeExit", async () => {
	await prisma.$disconnect();
});
