import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
import { adminLoginSchema } from "../validations/AuthValidation.js";

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
        return res.status(400).json({ status: 400, message: "User not found" });
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

  static async createInstitutionAdmin(req, res) {
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
}

export default systemAdminAuthController;
