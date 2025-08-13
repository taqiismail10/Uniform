// backend/middleware/Authenticate.js

import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader === null || authHeader === undefined) {
		return res
			.status(401)
			.json({ status: 401, message: "Unauthorized access" });
	}

	const token = authHeader.split(" ")[1];

	// * Verify token
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(401).json({
				status: 401,
				messafe: "Unauthorized access",
			});
		}
		req.user = user;
		next();
	});
};

export default authMiddleware;
