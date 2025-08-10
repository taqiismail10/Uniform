/*
  Warnings:

  - You are about to drop the column `firstName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullName" VARCHAR(190) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstitutionForm" ADD CONSTRAINT "InstitutionForm_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("institutionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppliedInstitution" ADD CONSTRAINT "AppliedInstitution_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppliedInstitution" ADD CONSTRAINT "AppliedInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."Institution"("institutionId") ON DELETE RESTRICT ON UPDATE CASCADE;
