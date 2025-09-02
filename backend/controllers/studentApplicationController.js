import prisma from "../DB/db.config.js";

class studentApplicationController {
  static async create(req, res) {
    try {
      const { studentId } = req.user;
      const { unitId } = req.body || {};
      if (!unitId) {
        return res.status(400).json({ status: 400, message: "unitId is required" });
      }
      // Load unit with requirements to validate eligibility
      const unit = await prisma.unit.findUnique({ where: { unitId }, include: { requirements: true } });
      if (!unit) {
        return res.status(404).json({ status: 404, message: "Unit not found" });
      }
      // Load student academic info
      const student = await prisma.student.findUnique({
        where: { studentId },
        select: { sscGpa: true, hscGpa: true, sscStream: true, hscStream: true, sscYear: true, hscYear: true },
      });
      if (!student) {
        return res.status(404).json({ status: 404, message: "Student not found" });
      }
      // Validate deadline and active status
      const now = new Date();
      if (unit.autoCloseAfterDeadline && unit.applicationDeadline && new Date(unit.applicationDeadline) < now) {
        return res.status(400).json({ status: 400, message: "Application deadline has passed" });
      }
      if (unit.isActive === false) {
        return res.status(400).json({ status: 400, message: "Unit is not active" });
      }
      // Validate academic eligibility (same logic as exploration endpoint)
      const ssc = Number(student.sscGpa ?? 0);
      const hsc = Number(student.hscGpa ?? 0);
      const sscYear = student.sscYear ?? 0;
      const hscYear = student.hscYear ?? 0;
      const combined = ssc + hsc;
      const reqs = unit.requirements ?? [];
      let eligible = reqs.length === 0;
      if (!eligible) {
        eligible = reqs.some((r) => {
          const passSSC = r.minSscGPA == null || ssc >= r.minSscGPA;
          const passHSC = r.minHscGPA == null || hsc >= r.minHscGPA;
          const passCombined = r.minCombinedGPA == null || combined >= r.minCombinedGPA;
          const passSscYear = (r.minSscYear == null || sscYear >= r.minSscYear) && (r.maxSscYear == null || sscYear <= r.maxSscYear);
          const passHscYear = (r.minHscYear == null || hscYear >= r.minHscYear) && (r.maxHscYear == null || hscYear <= r.maxHscYear);
          const passStream = (!student.sscStream || !student.hscStream) ||
            ((r.sscStream === student.sscStream) && (r.hscStream === student.hscStream));
          return passSSC && passHSC && passCombined && passStream && passSscYear && passHscYear;
        });
      }
      if (!eligible) {
        return res.status(400).json({ status: 400, message: "You are not eligible to apply to this unit" });
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
        include: {
          unit: { select: { name: true } },
          institution: { select: { name: true, logoUrl: true } },
        },
        orderBy: { appliedAt: 'desc' },
      });
      return res.json({ status: 200, applications: apps });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  static async delete(req, res) {
    try {
      const { studentId } = req.user;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ status: 400, message: "Application id is required" });
      }
      const app = await prisma.application.findUnique({ where: { id }, select: { id: true, studentId: true, reviewedAt: true } });
      if (!app || app.studentId !== studentId) {
        return res.status(404).json({ status: 404, message: "Application not found" });
      }
      if (app.reviewedAt) {
        return res.status(400).json({ status: 400, message: "Approved applications cannot be deleted" });
      }
      await prisma.application.delete({ where: { id } });
      return res.json({ status: 200, message: "Application deleted" });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }
}

export default studentApplicationController;
