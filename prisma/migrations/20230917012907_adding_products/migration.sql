-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "susep" VARCHAR(150) NOT NULL,
    "saleExpiration" TEXT NOT NULL,
    "minimumInitialContributionAmount" DOUBLE PRECISION NOT NULL,
    "minimumExtraContributionAmount" DOUBLE PRECISION NOT NULL,
    "minEntryAge" INTEGER NOT NULL,
    "maxEntryAge" INTEGER NOT NULL,
    "initialNeedForRedemption" INTEGER NOT NULL,
    "waitingPeriodBetweenRedemptions" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_susep_key" ON "Product"("susep");
