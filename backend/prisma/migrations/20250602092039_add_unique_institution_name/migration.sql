-- CreateEnum
CREATE TYPE "ExamPath" AS ENUM ('NATIONAL', 'MADRASHA', 'BRITISH');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('UNIVERSITY', 'MEDICAL', 'ENGINEERING', 'PRIVATE_UNIVERSITY', 'OTHER');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'NUMBER', 'FILE');

-- CreateTable
CREATE TABLE "Student" (
    "studentId" TEXT NOT NULL,
    "firstName" VARCHAR(190) NOT NULL,
    "lastName" VARCHAR(190) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(15),
    "password" VARCHAR(255) NOT NULL,
    "address" VARCHAR(300),
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "dob" TIMESTAMP(3) NOT NULL,
    "examPath" "ExamPath" NOT NULL,
    "medium" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "Form" (
    "formId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sscBoard" TEXT NOT NULL,
    "hscBoard" TEXT NOT NULL,
    "sscRoll" TEXT NOT NULL,
    "hscRoll" TEXT NOT NULL,
    "reg" TEXT NOT NULL,
    "sscGPA" DOUBLE PRECISION NOT NULL,
    "hscGPA" DOUBLE PRECISION NOT NULL,
    "sscStream" TEXT NOT NULL,
    "hscStream" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("formId")
);

-- CreateTable
CREATE TABLE "Institution" (
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InstitutionType" NOT NULL DEFAULT 'UNIVERSITY',
    "description" TEXT,
    "website" TEXT,
    "location" TEXT,
    "establishedIn" TIMESTAMP(3),

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("institutionId")
);

-- CreateTable
CREATE TABLE "AdmissionUnit" (
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "minSscGPA" DOUBLE PRECISION NOT NULL,
    "minHscGPA" DOUBLE PRECISION NOT NULL,
    "allowedSscStreams" TEXT[],
    "allowedHscStreams" TEXT[],
    "description" TEXT,
    "totalSeats" INTEGER NOT NULL DEFAULT 0,
    "applicationFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "applicationDeadline" TIMESTAMP(3),
    "admissionStart" TIMESTAMP(3),
    "admissionEnd" TIMESTAMP(3),

    CONSTRAINT "AdmissionUnit_pkey" PRIMARY KEY ("unitId")
);

-- CreateTable
CREATE TABLE "AppliedUnit" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusHistory" JSONB,

    CONSTRAINT "AppliedUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'INSTITUTION_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "AdminInstitution" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "AdminInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isReusable" BOOLEAN NOT NULL DEFAULT false,
    "institutionId" TEXT,
    "unitId" TEXT,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldAnswer" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "appliedUnitId" TEXT,
    "value" TEXT NOT NULL,

    CONSTRAINT "FieldAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Form_studentId_key" ON "Form"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionUnit" ADD CONSTRAINT "AdmissionUnit_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("institutionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedUnit" ADD CONSTRAINT "AppliedUnit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedUnit" ADD CONSTRAINT "AppliedUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "AdmissionUnit"("unitId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInstitution" ADD CONSTRAINT "AdminInstitution_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("adminId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInstitution" ADD CONSTRAINT "AdminInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("institutionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("institutionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "AdmissionUnit"("unitId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAnswer" ADD CONSTRAINT "FieldAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAnswer" ADD CONSTRAINT "FieldAnswer_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAnswer" ADD CONSTRAINT "FieldAnswer_appliedUnitId_fkey" FOREIGN KEY ("appliedUnitId") REFERENCES "AppliedUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
