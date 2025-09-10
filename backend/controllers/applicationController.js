// backend/controllers/applicationController.js
import prisma from "../DB/db.config.js";

class applicationController {
  static async list(req, res) {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 20;
      const search = (req.query.search || "").toString().trim();
      const unitId = req.query.unitId ? String(req.query.unitId) : undefined;
      const examPath = req.query.examPath ? String(req.query.examPath) : undefined; // 'NATIONAL' | 'MADRASHA'
      const medium = req.query.medium ? String(req.query.medium) : undefined; // 'Bangla' | 'English' | 'Arabic'
      const board = req.query.board ? String(req.query.board) : undefined; // e.g., 'Dhaka'
      const status = req.query.status ? String(req.query.status).toLowerCase() : undefined; // 'approved' | 'under_review'
      const center = req.query.center ? String(req.query.center).trim() : undefined; // exam center contains
      if (page <= 0) page = 1;
      if (limit <= 0 || limit > 100) limit = 20;
      const skip = (page - 1) * limit;

      const { adminId } = req.admin;
      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: "Not authorized" });
      }

      // Build composable filters to avoid clobbering OR conditions
      const andClauses = []
      if (unitId) andClauses.push({ unitId })
      if (search) {
        andClauses.push({
          OR: [
            { student: { fullName: { contains: search, mode: 'insensitive' } } },
            { student: { email: { contains: search, mode: 'insensitive' } } },
            { unit: { name: { contains: search, mode: 'insensitive' } } },
          ],
        })
      }
      if (status === 'approved') andClauses.push({ reviewedAt: { not: null } })
      else if (status === 'under_review') andClauses.push({ reviewedAt: null })

      if (center) {
        // Handle common synonyms for divisions (e.g., Chittagong/Chattogram, Barisal/Barishal)
        const synonyms = {
          Chattogram: ['Chittagong'],
          Chittagong: ['Chattogram'],
          Barishal: ['Barisal'],
          Barisal: ['Barishal'],
        }
        const terms = Array.from(new Set([center, ...(synonyms[center] || [])]))
        andClauses.push({
          OR: terms.flatMap((term) => [
            { examCenter: { contains: term, mode: 'insensitive' } },
            { centerPreference: { contains: term, mode: 'insensitive' } },
          ]),
        })
      }

      if (examPath || medium || board) {
        andClauses.push({
          student: {
            ...(examPath ? { examPath } : {}),
            ...(medium ? { medium } : {}),
            ...(board
              ? {
                  OR: [
                    { sscBoard: { equals: board } },
                    { hscBoard: { equals: board } },
                  ],
                }
              : {}),
          },
        })
      }

      const where = {
        institutionId: admin.institutionId,
        ...(andClauses.length ? { AND: andClauses } : {}),
      };

      const [rows, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            student: {
              select: {
                studentId: true,
                fullName: true,
                email: true,
                phone: true,
                examPath: true,
                medium: true,
                // Add registration and roll details for export needs
                sscRoll: true,
                sscRegistration: true,
                hscRoll: true,
                hscRegistration: true,
                sscBoard: true,
                hscBoard: true,
                sscYear: true,
                hscYear: true,
              },
            },
            unit: { select: { unitId: true, name: true } },
          },
          orderBy: { appliedAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.application.count({ where }),
      ]);

      return res.status(200).json({
        status: 200,
        data: rows,
        metadata: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  static async getById(req, res) {
    try {
      const { adminId } = req.admin;
      const { id } = req.params;
      if (!id) return res.status(400).json({ status: 400, message: 'Application id is required' });

      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: 'Not authorized' });
      }

      const app = await prisma.application.findFirst({
        where: { id, institutionId: admin.institutionId },
        include: {
          institution: { select: { institutionId: true, name: true, shortName: true } },
          unit: { select: { unitId: true, name: true, description: true } },
          student: {
            select: {
              studentId: true,
              fullName: true,
              email: true,
              phone: true,
              examPath: true,
              medium: true,
              sscStream: true,
              hscStream: true,
              sscGpa: true,
              hscGpa: true,
              sscBoard: true,
              hscBoard: true,
              sscYear: true,
              hscYear: true,
              dakhilGpa: true,
              alimGpa: true,
              dakhilBoard: true,
              alimBoard: true,
              dakhilYear: true,
              alimYear: true,
              address: true,
              dob: true,
            },
          },
        },
      });

      if (!app) return res.status(404).json({ status: 404, message: 'Application not found' });
      return res.json({ status: 200, data: app });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  }

  // Approve an application (institution admin)
  static async approve(req, res) {
    try {
      const { adminId } = req.admin;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ status: 400, message: "Application id is required" });
      }

      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: "Not authorized" });
      }

      const app = await prisma.application.findUnique({ where: { id } });
      if (!app || app.institutionId !== admin.institutionId) {
        return res.status(404).json({ status: 404, message: "Application not found" });
      }

      if (app.reviewedAt) {
        return res.status(400).json({ status: 400, message: "Application is already approved" });
      }

      // Determine exam center to use for seat assignment
      let center = req.body?.examCenter || app.examCenter || null
      if (!center) {
        // Fallback to unit-level center
        const unit = await prisma.unit.findUnique({ where: { unitId: app.unitId }, select: { examCenter: true } })
        center = unit?.examCenter || app.centerPreference || 'GENERAL'
      }
      const centerCodeMap = {
        'Dhaka': 'DHA', 'Chattogram': 'CTG', 'Chittagong': 'CTG', 'Rajshahi': 'RAJ', 'Khulna': 'KHL', 'Barishal': 'BAR', 'Sylhet': 'SYL', 'Rangpur': 'RGP', 'Mymensingh': 'MYM'
      }
      const makePrefix = (name) => {
        if (!name) return 'GEN'
        const n = String(name).trim()
        if (centerCodeMap[n]) return centerCodeMap[n]
        // Build from letters only
        const letters = n.replace(/[^A-Za-z]/g, '').toUpperCase()
        if (letters.length >= 3) return letters.slice(0,3)
        return (letters + 'GEN').slice(0,3)
      }
      let seatNo = app.seatNo
      if (!seatNo) {
        const prefix = makePrefix(center)
        const count = await prisma.application.count({ where: { institutionId: app.institutionId, OR: [{ examCenter: center }, { centerPreference: center }], seatNo: { not: null } } })
        seatNo = `${prefix}${String(count + 1).padStart(5,'0')}`
      }
      const updated = await prisma.application.update({
        where: { id },
        data: { reviewedAt: new Date(), notes: req.body?.notes ?? app.notes ?? null, examCenter: app.examCenter || center, seatNo },
        select: { id: true, reviewedAt: true, seatNo: true, examCenter: true },
      });

      return res.json({ status: 200, message: "Application approved", application: updated });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
    }
  }

  // Set or update exam details for an application (institution admin)
  static async setExamDetails(req, res) {
    try {
      const { adminId } = req.admin;
      const { id } = req.params;
      if (!id) return res.status(400).json({ status: 400, message: 'Application id is required' });

      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: 'Not authorized' });
      }

      const app = await prisma.application.findUnique({ where: { id } });
      if (!app || app.institutionId !== admin.institutionId) {
        return res.status(404).json({ status: 404, message: 'Application not found' });
      }

      const { seatNo, examDate, examTime, examCenter } = req.body || {};
      let dateVal = null;
      if (examDate) {
        const d = new Date(examDate);
        if (!isNaN(d.getTime())) dateVal = d;
      }

      const updated = await prisma.application.update({
        where: { id },
        data: {
          seatNo: seatNo ?? app.seatNo ?? null,
          examDate: dateVal ?? app.examDate ?? null,
          examTime: examTime ?? app.examTime ?? null,
          examCenter: examCenter ?? app.examCenter ?? null,
        },
        select: { id: true, seatNo: true, examDate: true, examTime: true, examCenter: true },
      });

      return res.json({ status: 200, message: 'Exam details updated', application: updated });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  }

  // Cancel (remove) an application by institution admin before approval
  static async remove(req, res) {
    try {
      const { adminId } = req.admin;
      const { id } = req.params;
      if (!id) return res.status(400).json({ status: 400, message: 'Application id is required' });

      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: 'Not authorized' });
      }

      const app = await prisma.application.findUnique({ where: { id } });
      if (!app || app.institutionId !== admin.institutionId) {
        return res.status(404).json({ status: 404, message: 'Application not found' });
      }
      if (app.reviewedAt) {
        return res.status(400).json({ status: 400, message: 'Approved applications cannot be cancelled' });
      }
      await prisma.application.delete({ where: { id } });
      return res.json({ status: 200, message: 'Application cancelled' });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  }
}

export default applicationController;
