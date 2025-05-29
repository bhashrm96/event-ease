/*
  Warnings:

  - You are about to drop the column `userId` on the `Rsvp` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rsvp" DROP CONSTRAINT "Rsvp_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Rsvp" DROP COLUMN "userId";
