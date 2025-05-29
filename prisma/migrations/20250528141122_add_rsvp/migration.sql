/*
  Warnings:

  - You are about to drop the `RSVP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RSVP" DROP CONSTRAINT "RSVP_eventId_fkey";

-- DropForeignKey
ALTER TABLE "RSVP" DROP CONSTRAINT "RSVP_userId_fkey";

-- DropTable
DROP TABLE "RSVP";

-- CreateTable
CREATE TABLE "Rsvp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
