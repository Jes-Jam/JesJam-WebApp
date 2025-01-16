"use server"
import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { userProgress } from "./schema";
import { eq } from "drizzle-orm";
import { getCurrentDate, calculateDaysDifference } from "@/lib/date";
import { get } from "http";


export const getStreak = cache(async() => {
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

export const resetStreak = cache(async () => {
  const { userId } = await auth();

  if (!userId) return;  

  await db.update(userProgress).set({
    streakCount: 0,
    lastStreakDate: new Date().toISOString(),
  }).where(eq(userProgress.userId, userId));
})

export const validateStreak = cache(async () => {

  const currentStreak = await getStreak();

  if (!currentStreak) return;
  

  const { lastStreakDate } = currentStreak;
  const currentDate = getCurrentDate();

  const daysSinceLastStreak = calculateDaysDifference(getCurrentDate(lastStreakDate), currentDate);

  if (daysSinceLastStreak === 1) { // Check if it's a new day just 1 day after
    await updateStreak();
  }
  else if (daysSinceLastStreak > 1) {
    await resetStreak();
  }
  else return;
})