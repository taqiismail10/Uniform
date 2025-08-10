/*
  Warnings:

  - You are about to drop the `SYSTEM_ADMIN` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."SYSTEM_ADMIN";

-- CreateTable
CREATE TABLE "public"."Systemadmin" (
    "systemAdminId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SYSTEM_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Systemadmin_pkey" PRIMARY KEY ("systemAdminId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Systemadmin_email_key" ON "public"."Systemadmin"("email");
