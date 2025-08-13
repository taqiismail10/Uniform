import { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";

class unitController {
  static async createUnit(req, res) {
    const { adminId } = req.admin; // from JWT
    const { name, description, isActive } = req.body;

    // Optionally ensure the admin belongs to an institution
    const admin = await prisma.admin.findUnique({ where: { adminId } });
    if (!admin || !admin.institutionId) {
      return res
        .status(403)
        .json({ status: 403, message: "Not authorized to create units" });
    }

    // Create the unit linked to the admin's institution
    const newUnit = await prisma.unit.create({
      data: {
        name,
        description,
        isActive: isActive !== undefined ? isActive : true,
        institutionId: admin.institutionId,
      },
    });
    return res.status(201).json({ status: 201, data: newUnit });
  }catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // console.log(error.messages)
        return res.status(400).json({ errors: error.messages });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: "Something went wrong" });
      }
    }

  static async listUnits(req, res) {
    const { adminId } = req.admin;
    const admin = await prisma.admin.findUnique({ where: { adminId } });
    if (!admin || !admin.institutionId) {
      return res.status(403).json({ status: 403, message: "Not authorized" });
    }
    // Find all units for this institution
    const units = await prisma.unit.findMany({
      where: { institutionId: admin.institutionId },
    });
    return res.json({ status: 200, data: units });
  }

  static async updateUnit(req, res) {
    const { unitId } = req.params;
    const { name, description, isActive } = req.body;
    try {
      // Update the unit record by its primary key
      const updated = await prisma.unit.update({
        where: { unitId },
        data: { name, description, isActive },
      });
      return res.json({ status: 200, data: updated });
    } catch (error) {
      console.error("Error updating unit:", error);
      return res.status(400).json({ status: 400, message: "Update failed" });
    }
  }

  static async dashboard(req, res) {
    // Example stats; adjust as needed for actual requirements
    const totalInstitutions = await prisma.institution.count();
    const totalUnits = await prisma.unit.count();
    const totalStudents = await prisma.student.count();
    const totalApplications = await prisma.application.count();
    return res.json({
      status: 200,
      data: {
        institutions: totalInstitutions,
        units: totalUnits,
        students: totalStudents,
        applications: totalApplications,
      },
    });
  }
}

export default unitController;
