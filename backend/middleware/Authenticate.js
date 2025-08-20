// backend/middleware/Authenticate.js
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		// Check if authorization header exists
		if (!authHeader) {
			return res.status(401).json({
				status: 401,
				message: "Authorization header is required",
			});
		}

		// Check if the header has the correct format (Bearer token)
		if (!authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				status: 401,
				message: "Invalid authorization format. Use 'Bearer [token]'",
			});
		}

		const token = authHeader.split(" ")[1];

		// Verify token
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				// Handle different types of token errors
				if (err.name === "TokenExpiredError") {
					return res.status(401).json({
						status: 401,
						message: "Token expired. Please log in again",
					});
				} else if (err.name === "JsonWebTokenError") {
					return res.status(401).json({
						status: 401,
						message: "Invalid token",
					});
				} else {
					return res.status(401).json({
						status: 401,
						message: "Authentication failed",
					});
				}
			}

			// Attach user information to request object
			req.user = decoded;
			next();
		});
	} catch (error) {
		console.error("Authentication middleware error:", error);
		return res.status(500).json({
			status: 500,
			message: "Internal server error during authentication",
		});
	}
};

export default authMiddleware;
