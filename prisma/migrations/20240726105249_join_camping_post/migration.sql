-- CreateTable
CREATE TABLE "JoinCampingPost" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviews" TEXT NOT NULL,
    "favorite" TEXT NOT NULL,
    "notification" TEXT NOT NULL,

    CONSTRAINT "JoinCampingPost_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "JoinCampingPost" ADD CONSTRAINT "JoinCampingPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinCampingPost" ADD CONSTRAINT "JoinCampingPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CampingPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
