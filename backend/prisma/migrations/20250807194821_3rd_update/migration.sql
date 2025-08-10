-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "institutionId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'INSTITUTION_ADMIN';

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("institutionId") ON DELETE SET NULL ON UPDATE CASCADE;
