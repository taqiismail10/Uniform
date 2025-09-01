import prisma from "../DB/db.config.js";

class studentApplicationController {
  static async create(req, res) {
    try {
      const { studentId } = req.user;
      const { unitId } = req.body || {};
      if (!unitId) {
        return res.status(400).json({ status: 400, message: "unitId is required" });
      }
      const unit = await prisma.unit.findUnique({ where: { unitId }, select: { unitId: true, institutionId: true } });
      if (!unit) {
        return res.status(404).json({ status: 404, message: "Unit not found" });
      }
      // Ensure no duplicate application for same unit by this student
      const existing = await prisma.application.findFirst({ where: { studentId, unitId } });
      if (existing) {
        return res.status(400).json({ status: 400, message: "You have already applied to this unit" });
      }
      const app = await prisma.application.create({
        data: { studentId, unitId, institutionId: unit.institutionId },
        select: { id: true, unitId: true, institutionId: true, appliedAt: true },
      });
      return res.status(201).json({ status: 201, message: "Application submitted", application: app });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  static async list(req, res) {
    try {
      const { studentId } = req.user;
      const apps = await prisma.application.findMany({
        where: { studentId },
        include: { unit: { select: { name: true } }, institution: { select: { name: true } } },
        orderBy: { appliedAt: 'desc' },
      });
      return res.json({ status: 200, applications: apps });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
}

export default studentApplicationController;

