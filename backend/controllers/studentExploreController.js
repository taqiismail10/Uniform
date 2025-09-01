import prisma from "../DB/db.config.js";

class studentExploreController {
  static async eligibleInstitutions(req, res) {
    try {
      const { studentId } = req.user;
      const student = await prisma.student.findUnique({
        where: { studentId },
        select: {
          sscGpa: true,
          hscGpa: true,
          examPath: true,
          sscStream: true,
          hscStream: true,
          sscYear: true,
          hscYear: true,
        },
      });

      if (!student) {
        return res.status(404).json({ status: 404, message: "Student not found" });
      }

      const now = new Date();
      const units = await prisma.unit.findMany({
        where: {
          isActive: true,
        },
        include: {
          institution: {
            select: {
              institutionId: true,
              name: true,
              shortName: true,
              website: true,
              description: true,
              address: true,
              type: true,
              ownership: true,
              establishedYear: true,
              logoUrl: true,
            },
          },
          requirements: true,
        },
      });

      const ssc = student.sscGpa ?? 0;
      const hsc = student.hscGpa ?? 0;
      const sscYear = student.sscYear ?? 0;
      const hscYear = student.hscYear ?? 0;
      const combined = ssc + hsc;

      const eligibleByInstitution = new Map();

      for (const u of units) {
        // Deadline check
        if (u.autoCloseAfterDeadline && u.applicationDeadline && new Date(u.applicationDeadline) < now) {
          continue;
        }

        // If no requirements, consider open to all
        const reqs = u.requirements ?? [];
        let ok = reqs.length === 0;
        if (!ok) {
          ok = reqs.some((r) => {
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

        if (!ok) continue;

        const instId = u.institution.institutionId;
        if (!eligibleByInstitution.has(instId)) {
          eligibleByInstitution.set(instId, {
            institutionId: instId,
            name: u.institution.name,
            shortName: u.institution.shortName,
            website: u.institution.website,
            description: u.institution.description,
            address: u.institution.address,
            type: u.institution.type,
            ownership: u.institution.ownership,
            establishedYear: u.institution.establishedYear,
            logoUrl: u.institution.logoUrl,
            units: [],
          });
        }
        const bucket = eligibleByInstitution.get(instId);
        bucket.units.push({
          unitId: u.unitId,
          name: u.name,
          description: u.description,
          applicationDeadline: u.applicationDeadline,
          isActive: u.isActive,
        });
      }

      const institutions = Array.from(eligibleByInstitution.values());
      return res.json({ status: 200, data: institutions });
    } catch (error) {
      console.error("eligibleInstitutions error:", error);
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  static async eligibleInstitutionById(req, res) {
    try {
      const { studentId } = req.user;
      const { institutionId } = req.params;
      const student = await prisma.student.findUnique({
        where: { studentId },
        select: { sscGpa: true, hscGpa: true, sscStream: true, hscStream: true },
      });
      if (!student) return res.status(404).json({ status: 404, message: 'Student not found' });

      const inst = await prisma.institution.findUnique({ where: { institutionId }, select: { institutionId: true, name: true, shortName: true, website: true, description: true, address: true, type: true, ownership: true, establishedYear: true, logoUrl: true } });
      if (!inst) return res.status(404).json({ status: 404, message: 'Institution not found' });

      const now = new Date();
      const units = await prisma.unit.findMany({ where: { institutionId, isActive: true }, include: { requirements: true } });
      const ssc = student.sscGpa ?? 0;
      const hsc = student.hscGpa ?? 0;
      const combined = ssc + hsc;

      const eligibleUnits = units.filter((u) => {
        if (u.autoCloseAfterDeadline && u.applicationDeadline && new Date(u.applicationDeadline) < now) return false;
        const reqs = u.requirements ?? [];
        if (reqs.length === 0) return true;
        return reqs.some((r) => {
          const passSSC = r.minSscGPA == null || ssc >= r.minSscGPA;
          const passHSC = r.minHscGPA == null || hsc >= r.minHscGPA;
          const passCombined = r.minCombinedGPA == null || combined >= r.minCombinedGPA;
          const passStream = (!student.sscStream || !student.hscStream) || (r.sscStream === student.sscStream && r.hscStream === student.hscStream);
          return passSSC && passHSC && passCombined && passStream;
        });
      }).map((u) => ({ unitId: u.unitId, name: u.name, description: u.description, applicationDeadline: u.applicationDeadline, isActive: u.isActive }));

      return res.json({ status: 200, data: { ...inst, units: eligibleUnits } });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  }
}

export default studentExploreController;
