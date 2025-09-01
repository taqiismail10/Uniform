// backend/controllers/institutionController.js

import { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";

class institutionController {


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
    try {
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
        ownership,
        type,
        shortName,
      } = req.body;
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
          ...(ownership !== undefined
            ? { ownership: String(ownership).toUpperCase() }
            : {}),
          ...(type !== undefined ? { type: String(type).toUpperCase() } : {}),
          ...(shortName !== undefined ? { shortName } : {}),
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
  static async getOwnInstitution(req, res) {
    try {
      const { adminId } = req.admin;
      const admin = await prisma.admin.findUnique({
        where: { adminId },
        include: { institution: true },
      });
      if (!admin || !admin.institution) {
        return res.status(404).json({ status: 404, message: 'Institution not found' });
      }
      const inst = admin.institution;
      return res.status(200).json({
        status: 200,
        institution: {
          institutionId: inst.institutionId,
          name: inst.name,
          shortName: inst.shortName || null,
          logoUrl: inst.logoUrl || null,
          description: inst.description || null,
          address: inst.address || null,
          phone: inst.phone || null,
          email: inst.email || null,
          website: inst.website || null,
          establishedYear: inst.establishedYear || null,
          ownership: inst.ownership || null,
          type: inst.type || null,
        },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  }

  static async updateOwnInstitution(req, res) {
    try {
      const { adminId } = req.admin;
      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: "Not authorized" });
      }

      const { shortName } = req.body || {};
      const data = {};
      if (typeof shortName === 'string') data.shortName = shortName.trim();

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ status: 400, message: 'No fields to update' });
      }

      const updated = await prisma.institution.update({
        where: { institutionId: admin.institutionId },
        data,
        select: { institutionId: true, name: true, shortName: true, logoUrl: true },
      });
      return res.status(200).json({ status: 200, institution: updated });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  }

}

export default institutionController;
