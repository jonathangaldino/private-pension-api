-- CreateTable
CREATE TABLE "PlanInvestment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "contributionAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PlanInvestment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanInvestment" ADD CONSTRAINT "PlanInvestment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanInvestment" ADD CONSTRAINT "PlanInvestment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
