"use server"

import { getClassById, getUserProgress } from "@/database/queries";
import { classEnrollments, userProgress } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

import { redirect } from "next/navigation";
import { handleGuestProgress } from "./guest-progress";

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
            patels: 0,
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