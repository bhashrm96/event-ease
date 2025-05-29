/*
  Warnings:

  - You are about to drop the column `userId` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userId",
ADD COLUMN     "additionalFields" JSONB;
