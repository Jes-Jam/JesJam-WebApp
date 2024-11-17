"use server"

import { getClassById, getUserProgress } from "@/database/queries";
import { userProgress } from "@/database/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/database/drizzle";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { redirect } from "next/navigation";

// Insert or update user progress (When user open class for the first time)

export const upsertUserProgress = async (classId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if(!userId) return;

    const data = await getClassById(classId);

    if(!data) return;

    const existingUserProgress = await getUserProgress();

    if(!existingUserProgress) {
        await db.insert(userProgress).values({
            userId,
            userName: user?.firstName || "User",
            activeClassId: classId,
            patels: 10,
            points: 0
        })
    } else {
        await db.update(userProgress).set({
            userId,
            userName: user?.firstName || "User",
            activeClassId: classId,
            patels: 10,
            points: 0
        }).where(eq(userProgress.userId, userId))
    }

    revalidatePath("/study")
    revalidatePath("/classes")
    redirect(`/study`)
}