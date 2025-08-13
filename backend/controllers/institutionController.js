// backend/controllers/institutionController.js

import { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";

class institutionController {
  static async fetchInstitutions(req, res) {
    try {
      const institutions = await prisma.institution.findMany();
      // institutionService.getAllInstitutions();
      return res.status(200).json({ status: 200, institutions });
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

  static async getInstitutionFormRequirements(req, res) {
    try {
      const { institutionId } = req.params;
      const formRequirements = await prisma.institution.findUnique(
        institutionId
      );
      // getFormRequirements(institutionId);

      if (!formRequirements) {
        return res.status(404).json({ message: "Institution not found." });
      }

      return res.status(200).json({ status: 200, formRequirements });
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
  static async updateInstitution(req, res) {
    const { id } = req.params; // institutionId from URL
    // Extract updatable fields from request body
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      establishedYear,
    } = req.body;

    try {
      // Update the institution record
      const updated = await prisma.institution.update({
        where: { institutionId: id },
        data: {
          name,
          description,
          address,
          phone,
          email,
          website,
          establishedYear,
        },
      });
      return res.json({ status: 200, data: updated });
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
}

export default institutionController;
