-- CreateTable
CREATE TABLE "public"."InstitutionForm" (
    "institutionFormId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InstitutionForm_pkey" PRIMARY KEY ("institutionFormId")
);

-- CreateTable
CREATE TABLE "public"."AppliedInstitution" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "AppliedInstitution_pkey" PRIMARY KEY ("id")
);
