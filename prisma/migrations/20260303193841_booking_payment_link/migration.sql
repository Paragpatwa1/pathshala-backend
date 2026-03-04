/*
  Warnings:

  - The `paymentStatus` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "BookingStatus" NOT NULL DEFAULT 'PENDING';
