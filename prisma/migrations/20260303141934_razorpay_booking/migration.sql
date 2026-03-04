/*
  Warnings:

  - You are about to drop the column `paid` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Booking` table. All the data in the column will be lost.
  - You are about to alter the column `discount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `finalAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `months` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerMonth` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paid",
DROP COLUMN "price",
ADD COLUMN     "months" INTEGER NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "pricePerMonth" INTEGER NOT NULL,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT,
ADD COLUMN     "subtotal" INTEGER NOT NULL,
ALTER COLUMN "discount" SET DATA TYPE INTEGER,
ALTER COLUMN "finalAmount" SET DATA TYPE INTEGER;
