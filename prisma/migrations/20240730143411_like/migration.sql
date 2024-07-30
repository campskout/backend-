-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "experienceId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "ExperiencesTips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
