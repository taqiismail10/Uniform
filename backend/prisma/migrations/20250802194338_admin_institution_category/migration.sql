-- CreateTable
CREATE TABLE "public"."Admin" (
    "adminId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "public"."Institution" (
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requirementsHscGPA" DOUBLE PRECISION NOT NULL,
    "requirementsSscGPA" DOUBLE PRECISION NOT NULL,
    "institutionCategoryInstitutionCategoryId" VARCHAR(255),

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("institutionId")
);

-- CreateTable
CREATE TABLE "public"."InstitutionCategory" (
    "institutionCategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "InstitutionCategory_pkey" PRIMARY KEY ("institutionCategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."Institution" ADD CONSTRAINT "Institution_institutionCategoryInstitutionCategoryId_fkey" FOREIGN KEY ("institutionCategoryInstitutionCategoryId") REFERENCES "public"."InstitutionCategory"("institutionCategoryId") ON DELETE SET NULL ON UPDATE CASCADE;
