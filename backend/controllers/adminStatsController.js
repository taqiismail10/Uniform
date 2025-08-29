// backend/controllers/adminStatsController.js
import prisma from "../DB/db.config.js";

class adminStatsController {
  static async stats(req, res) {
    try {
      const { adminId } = req.admin;
      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: "Not authorized" });
      }

      const institutionId = admin.institutionId;

      const [totalUnits, totalApplications, distinctApplicants] = await Promise.all([
        prisma.unit.count({ where: { institutionId } }),
        prisma.application.count({ where: { institutionId } }),
        prisma.application.findMany({
          where: { institutionId },
          distinct: ["studentId"],
          select: { studentId: true },
        }),
      ]);

      return res.status(200).json({
        status: 200,
        data: {
          totalUnits,
          totalApplications,
          appliedStudents: distinctApplicants.length,
        },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
}

export default adminStatsController;

