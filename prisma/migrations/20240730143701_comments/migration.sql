-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "ExperiencesTips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
