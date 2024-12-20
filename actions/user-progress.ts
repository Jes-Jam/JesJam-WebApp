"use server"

import { getClassById, getUserProgress } from "@/database/queries";
import { challengeProgress, challenges, classEnrollments, userProgress } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

import { redirect } from "next/navigation";
import { handleGuestProgress } from "./guest-progress";
import { POINTS_TO_REFILL } from "@/app/profile/flower-store";

// Insert or update user progress (When user open class for the first time)
    // In addition to that, it also creates an enrollment record for the user
export const upsertUserProgress = async (classId: number, isGuest: boolean = false) => {
    if (isGuest) {
        return handleGuestProgress(classId);
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) return;

    const data = await getClassById(classId);

    if (!data) return;


    const existingUserProgress = await getUserProgress();

    if (!existingUserProgress) {
        await db.insert(userProgress).values({
            userId,
            userName: user?.firstName || "User",
            activeClassId: classId,
            patels: 5,
            points: 0
        })
    } else {
        await db.update(userProgress)
            .set({
                activeClassId: classId
            })
            .where(eq(userProgress.userId, userId))
    }

    // Check if enrollment already exists
    const existingEnrollment = await db.query.classEnrollments.findFirst({
        where: and(eq(classEnrollments.userId, userId), eq(classEnrollments.classId, classId))
    })

    // Create enrollment if it doesn't exist
    if (!existingEnrollment) {
        await db.insert(classEnrollments).values({
            userId,
            classId,
            enrolledAt: new Date()
        })
    }


    revalidatePath("/study")
    revalidatePath("/classes")
    redirect(`/study`)
}

// When user get the question wrong

export const reducePetals = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) return;


    const existingUserProgress = await getUserProgress();

    if (!existingUserProgress) {
        throw new Error("User progress not found")
    }

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        )
    })

    const isPractice = !!existingChallengeProgress;

    if (isPractice) {
        return { error: "practice" }
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    })
    
    if (!challenge) {
        throw new Error("Challenge not found")
    }

    const lessonId = challenge.lessonId;

    if (!lessonId) {
        throw new Error("Lesson ID not found")
    }

    if (existingUserProgress.patels === 0) {
        return { error: "petals" }
    }

    await db.update(userProgress).set({
        patels: Math.max(existingUserProgress.patels - 1, 0),
    }).where(eq(userProgress.userId, userId))


    revalidatePath("/study")
    revalidatePath(`/study/${lessonId}`)
    revalidatePath("/leaderboard")
    revalidatePath("/explore")
}


// When user refill petals
export const refillPetals = async () => {
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }


if (currentUserProgress.patels === 5) {
        throw new Error("Petals is already full");
    }

    if (currentUserProgress.points < 10) {
        throw new Error("Not enough points");
    }

    await db.update(userProgress).set({
        patels: Math.min(currentUserProgress.patels + 1, 5),
        points: currentUserProgress.points - 10,
    }).where(eq(userProgress.userId, currentUserProgress.userId));


    revalidatePath("/study");
    revalidatePath("/profile");
    revalidatePath("/leaderboard");
}