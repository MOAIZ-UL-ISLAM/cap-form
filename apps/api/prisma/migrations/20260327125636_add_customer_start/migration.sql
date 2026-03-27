-- CreateEnum
CREATE TYPE "DebtAdviceFor" AS ENUM ('ME', 'PARTNER_AND_ME');

-- CreateEnum
CREATE TYPE "DebtAdviceReason" AS ENUM ('REPAY_AS_MUCH_AS_POSSIBLE', 'DEBT_FREE_QUICKLY', 'DEBT_FREE_LOW_COST', 'BUDGETING_ADVICE', 'PROTECT_CREDIT_FILE', 'PROTECT_HOME_OR_ASSETS', 'STOP_CREDITOR_ACTION', 'SHORT_TERM_HELP', 'OTHER');

-- CreateEnum
CREATE TYPE "DebtCause" AS ENUM ('RELATIONSHIP_BREAKDOWN', 'REDUNDANCY_UNEMPLOYMENT', 'REDUCTION_IN_INCOME', 'BEREAVEMENT', 'PHYSICAL_HEALTH', 'MENTAL_HEALTH', 'DISABILITY', 'ADDICTION', 'GAMBLING', 'BORROWED_TOO_MUCH', 'MISMANAGEMENT_OF_MONEY', 'INCREASED_COST_OF_LIVING', 'OTHER');

-- CreateEnum
CREATE TYPE "ResidentialStatus" AS ENUM ('RENTING', 'HOUSE_OWNER', 'LIVING_WITH_PARENTS', 'LODGER_HOUSE_SHARE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'CUSTOMER_START_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'CUSTOMER_START_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'CUSTOMER_START_SUBMITTED';

-- CreateTable
CREATE TABLE "customer_start" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "debtAdviceFor" "DebtAdviceFor" NOT NULL,
    "hadPreviousDebtSolution" BOOLEAN NOT NULL,
    "hadBreathingSpace" BOOLEAN NOT NULL,
    "mainReason" "DebtAdviceReason" NOT NULL,
    "debtCause" "DebtCause" NOT NULL,
    "hasPersonalBarriers" BOOLEAN NOT NULL,
    "personalBarriersDetail" TEXT,
    "country" "Country" NOT NULL,
    "residentialStatus" "ResidentialStatus" NOT NULL,
    "hadBailiffContact" BOOLEAN NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "submittedIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_start_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_start_customerId_key" ON "customer_start"("customerId");

-- AddForeignKey
ALTER TABLE "customer_start" ADD CONSTRAINT "customer_start_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
