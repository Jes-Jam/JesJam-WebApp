"use server"

import  db  from "@/database/drizzle"
import { challengeContent, challengeProgress, challenges, userProgress } from "@/database/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { getUserProgress } from "@/database/queries"
import { revalidatePath } from "next/cache"

export const upsertChallengeProgress = async (challengeId: number) => {
    const {userId} = await auth()

    if (!userId) return;

    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found")
    };

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

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        )
    })
    const isPractice = !!existingChallengeProgress;

    // If the user has no patels and the challenge is not a practice challenge, throw an error
    if (currentUserProgress.patels === 0 && !isPractice) {
        return { error: "patels"}
    }

    if (isPractice) {
        await db.update(challengeProgress).set({
            completed: true
        }).where(eq(challengeProgress.id, existingChallengeProgress.id))

        await db.update(userProgress).set({
            patels: Math.max(currentUserProgress.patels - 1, 5),
            points: currentUserProgress.points + 10 
        }).where(eq(userProgress.userId, userId))

        revalidatePath('/lesson')
        revalidatePath(`/lesson/${lessonId}`)
        revalidatePath(`/study`)
        revalidatePath(`/leaderboard`)
        revalidatePath(`/profile`)
        revalidatePath(`/explore`)
        return
    }

    // If the user start learning for the first time, we need to create a new user progress record
    await db.insert(challengeProgress).values({
        challengeId,
        userId,
        completed: true
    })

    await db.update(userProgress).set({
        patels: Math.max(currentUserProgress.patels - 1, 5),
        points: currentUserProgress.points + 10 
    }).where(eq(userProgress.userId, userId))

    revalidatePath('/lesson')
    revalidatePath(`/lesson/${lessonId}`)
    revalidatePath(`/study`)
    revalidatePath(`/leaderboard`)
    revalidatePath(`/profile`)
    revalidatePath(`/explore`)

}