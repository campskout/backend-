    -- CreateEnum
    CREATE TYPE "AgeCategory" AS ENUM ('ADULT', 'TEEN', 'KIDS');

    -- CreateTable
    CREATE TABLE "CampingPost" (
        "id" SERIAL NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "startDate" TIMESTAMP(3) NOT NULL,
        "endDate" TIMESTAMP(3) NOT NULL,
        "equipment" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "places" INTEGER NOT NULL,
        "ageCategory" "AgeCategory" NOT NULL,
        "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "organizerId" INTEGER NOT NULL,

        CONSTRAINT "CampingPost_pkey" PRIMARY KEY ("id")
    );

    -- AddForeignKey
    ALTER TABLE "CampingPost" ADD CONSTRAINT "CampingPost_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
