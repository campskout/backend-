/*
  Warnings:

  - Added the required column `status` to the `JoinCampingPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoiningStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "JoinCampingPost" ADD COLUMN     "status" "JoiningStatus" NOT NULL;
