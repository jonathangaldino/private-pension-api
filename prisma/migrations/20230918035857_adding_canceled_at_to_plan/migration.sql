-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;