-- CreateTable
CREATE TABLE "Share" (
    "id" SERIAL NOT NULL,
    "experienceId" INTEGER NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "ExperiencesTips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
