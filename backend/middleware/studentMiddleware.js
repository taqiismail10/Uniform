import jwt from "jsonwebtoken";

const studentMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: 401, message: "Unauthorized access" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ status: 401, message: "Invalid authorization format" });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }

    if (decoded.role !== "STUDENT" || !decoded.studentId) {
      return res.status(403).json({ status: 403, message: "Access denied" });
    }

    req.user = decoded;
    next();
  });
};

export default studentMiddleware;

