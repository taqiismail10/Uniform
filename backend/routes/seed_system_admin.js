import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admins = [
    { email: 'taqiismail10@uniform.com', password: 'admin' },
    { email: 'aongcho880@uniform.com', password: 'admin' },
    { email: 'samisadman10@uniform.com', password: 'admin' },
  ];

  for (const admin of admins) {
    await prisma.systemadmin.create({
      data: {
        email: admin.email,
        password: bcrypt.hashSync(admin.password, 10),
        role: 'SYSTEM_ADMIN',
      },
    });
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());