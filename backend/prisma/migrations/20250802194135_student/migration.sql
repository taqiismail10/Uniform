-- CreateTable
CREATE TABLE "public"."Student" (
    "studentId" TEXT NOT NULL,
    "firstName" VARCHAR(190) NOT NULL,
    "lastName" VARCHAR(190) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(15),
    "password" VARCHAR(255) NOT NULL,
    "address" VARCHAR(300),
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "dob" TIMESTAMP(3) NOT NULL,
    "profile" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "public"."Student"("email");
