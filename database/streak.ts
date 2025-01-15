import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { userProgress } from "./schema";
import { eq } from "drizzle-orm";


const getStreak = cache(async() => {
  const { userId } = auth();

  if (!userId) return;

  const currentUserProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!currentUserProgress) return;

  const { streakCount, lastStreakDate } = currentUserProgress;

  return { streakCount, lastStreakDate };
})

export const updateStreak = cache(async () => {
  const { userId } = await auth();

  if (!userId) return;

  const currentUserProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!currentUserProgress) return;

  await db.update(userProgress).set({
    streakCount: currentUserProgress.streakCount + 1,
    lastStreakDate: new Date().toISOString(),
  }).where(eq(userProgress.userId, userId));
})