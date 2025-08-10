-- CreateTable
CREATE TABLE "public"."Form" (
    "formId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "reg" INTEGER NOT NULL,
    "hscRoll" INTEGER NOT NULL,
    "sscRoll" INTEGER NOT NULL,
    "hscGPA" DOUBLE PRECISION NOT NULL,
    "sscGPA" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("formId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_studentId_key" ON "public"."Form"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_reg_key" ON "public"."Form"("reg");

-- CreateIndex
CREATE UNIQUE INDEX "Form_hscRoll_key" ON "public"."Form"("hscRoll");

-- CreateIndex
CREATE UNIQUE INDEX "Form_sscRoll_key" ON "public"."Form"("sscRoll");
