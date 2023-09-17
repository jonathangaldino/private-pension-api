-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "identity" VARCHAR(11) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" VARCHAR(9) NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_identity_key" ON "Customer"("identity");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
