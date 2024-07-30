/*
  Warnings:

  - Added the required column `category` to the `CampingPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryCamping" AS ENUM ('Hiking', 'Kayaking', 'Fishing', 'Climbing', 'Hitchhiking');

-- AlterTable
ALTER TABLE "CampingPost" ADD COLUMN     "category" "CategoryCamping" NOT NULL;
