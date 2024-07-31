/*
  Warnings:

  - Added the required column `status` to the `CampingPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusCampingPost" AS ENUM ('PENDING', 'InProgress', 'Completed', 'Canceled', 'Delegated');

-- AlterTable
ALTER TABLE "CampingPost" ADD COLUMN     "status" "StatusCampingPost" NOT NULL;
