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
      if (page <= 0) page = 1;
      if (limit <= 0 || limit > 100) limit = 20;
      const skip = (page - 1) * limit;

      const { adminId } = req.admin;
      const admin = await prisma.admin.findUnique({ where: { adminId } });
      if (!admin || !admin.institutionId) {
        return res.status(403).json({ status: 403, message: "Not authorized" });
      }

      const where = {
        institutionId: admin.institutionId,
        ...(unitId ? { unitId } : {}),
        ...(search
          ? {
              OR: [
                { student: { fullName: { contains: search, mode: "insensitive" } } },
                { student: { email: { contains: search, mode: "insensitive" } } },
                { unit: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...(status === 'approved'
          ? { reviewedAt: { not: null } }
          : status === 'under_review'
          ? { reviewedAt: null }
          : {}),
        ...(examPath || medium || board
          ? {
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
            }
          : {}),
      };

      const [rows, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            student: { select: { studentId: true, fullName: true, email: true, examPath: true, medium: true, sscBoard: true, hscBoard: true } },
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

      const updated = await prisma.application.update({
        where: { id },
        data: { reviewedAt: new Date(), notes: req.body?.notes ?? app.notes ?? null },
        select: { id: true, reviewedAt: true },
      });

      return res.json({ status: 200, message: "Application approved", application: updated });
    } catch (error) {
      return res.status(500).json({ status: 500, message: "Something went wrong" });
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
