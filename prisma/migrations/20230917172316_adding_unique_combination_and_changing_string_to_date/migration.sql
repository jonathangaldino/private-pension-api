/*
  Warnings:

  - A unique constraint covering the columns `[id,customerId,productId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `hiringDate` on the `Plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `saleExpiration` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Plan_id_customerId_productId_idx";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "hiringDate",
ADD COLUMN     "hiringDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "saleExpiration",
ADD COLUMN     "saleExpiration" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_id_customerId_productId_key" ON "Plan"("id", "customerId", "productId");
