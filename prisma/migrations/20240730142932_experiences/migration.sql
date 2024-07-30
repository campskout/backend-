-- CreateEnum
CREATE TYPE "CategoryExperiences" AS ENUM ('Experiences', 'Tips');

-- CreateEnum
CREATE TYPE "FiltreCategory" AS ENUM ('ShelterAndSleeping', 'CookingAndEating', 'ClothingAndFootwear', 'NavigationAndSafety', 'PersonalItemsAndComfort', 'Miscellaneous', 'OptionalButUseful');

-- CreateTable
CREATE TABLE "ExperiencesTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imagesUrl" TEXT[],
    "location" TEXT NOT NULL,
    "category" "CategoryExperiences" NOT NULL,
    "filterCategory" "FiltreCategory" NOT NULL,
    "likeCounter" INTEGER NOT NULL,
    "shareCounter" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperiencesTips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExperiencesTips" ADD CONSTRAINT "ExperiencesTips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
