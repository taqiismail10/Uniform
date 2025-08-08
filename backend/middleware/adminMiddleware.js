import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next) => {
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
        message: "Unauthorized access",
      });
    }

    // Check if the user has the "ADMIN" role
    // if (user.role !== "INSTITUTION_ADMIN") {
    //   return res.status(403).json({
    //     status: 403,
    //     message: "Access denied",
    //   });
    // }

    req.admin = user; // Attach the decoded admin data to the request
    next();
  });
};

export default adminMiddleware;
