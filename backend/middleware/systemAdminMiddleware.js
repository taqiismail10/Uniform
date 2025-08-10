import jwt from "jsonwebtoken";

const systemAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === null || authHeader === undefined) {
    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || user.role !== "SYSTEM_ADMIN") {
      return res.status(403).json({ status: 403, message: "Access denied" });
    }
    req.admin = user;
    next();
  });
};

export default systemAdminMiddleware;
