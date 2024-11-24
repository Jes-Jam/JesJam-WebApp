import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { challengeAnswers, challengeProgress, challenges, chapters, classEnrollments, classes, lessons, userProgress } from "./schema";
import { eq } from "drizzle-orm";


export const getClasses = cache(async () => {
    const classes = await db.query.classes.findMany();
    console.log("Classes", classes)
    return classes
});

export const getClassById = cache(async (classId: number) =>{
    const data = await db.query.classes.findFirst({
        where : eq(classes.id, classId)
    })
    return data
})

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if(!userId) {
        return;
    }

    try {
        const data = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
            with: {
                activeClass: true
            }
        });

        console.log("User progress: ", data);

        if (!data) {
            return;
        } 
        return data;
    } catch (error) {
        console.error("[getUserProgress] Error fetching user progress: ", error);
    }
});

// Get all chapters
export const getChapters = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress) {
        return [];
    }

    const data = await db.query.chapters.findMany({
        where: eq(chapters.classId, userProgress.activeClassId!),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(
                                    challengeProgress.userId, 
                                    userId
                                )
                            }
                        }
                    }
                }
            }
        }
    })

    const chaptersWithProgress = data.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => ({
            ...lesson,
            completed: lesson.challenges.every((challenge) =>
                challenge.challengeProgress?.every((progress) => progress.completed)
            )
        }))
    }));

    return chaptersWithProgress;
})


// Get all enrollments with class details
export const getEnrollments = cache(async () => {
    const { userId } = await auth();

    if(!userId) {
        return [];
    }

    const data = await db.query.classEnrollments.findMany({
        where: eq(classEnrollments.userId, userId),
        with: {
            class: true
        }
    })

    return data;
})    

