// backend/controllers/applicationController.js
import prisma from "../DB/db.config.js";

class applicationController {
  static async list(req, res) {
    try {
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 20;
      const search = (req.query.search || "").toString().trim();
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
        ...(search
          ? {
              OR: [
                { student: { fullName: { contains: search, mode: "insensitive" } } },
                { student: { email: { contains: search, mode: "insensitive" } } },
                { unit: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      };

      const [rows, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            student: { select: { studentId: true, fullName: true, email: true } },
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
}

export default applicationController;

