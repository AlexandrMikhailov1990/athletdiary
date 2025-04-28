-- CreateTable
CREATE TABLE "WorkoutHistory" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "workoutName" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "exercises" JSONB NOT NULL,
    "notes" TEXT,
    "rating" INTEGER,

    CONSTRAINT "WorkoutHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutHistory" ADD CONSTRAINT "WorkoutHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
