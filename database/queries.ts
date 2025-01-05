import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { challengeContent, challengeProgress, challenges, chapters, classEnrollments, classes, lessons, userProgress } from "./schema";
import { eq } from "drizzle-orm";


export const getClasses = cache(async () => {
    const classesList = await db.query.classes.findMany({
        where: eq(classes.isPrivateClass, false)
    });
    console.log("Classes", classes)
    return classesList
});

export const getClassById = cache(async (classId: number) =>{
    const data = await db.query.classes.findFirst({
        where : eq(classes.id, classId)
    })
    return data
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
    console.log("Starting getChapters function");

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
            completed: lesson.challenges.length > 0 ? lesson.challenges.every((challenge) =>
                challenge.challengeProgress?.every((progress) => progress.completed)
            ) : false
        }))
    }));

    console.log(`These are the chapters with progress: ${JSON.stringify(chaptersWithProgress, null, 2)}`)

    return chaptersWithProgress;
})


export const getCurrentLatestLesson = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress) {
        return;
    }

    const chaptersInActiveClass = await db.query.chapters.findMany({
        where: eq(chapters.classId, userProgress.activeClassId!),
        orderBy: (chapters, { asc }) => [asc(chapters.order)],
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    chapter: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId)
                            }
                        }
                    }
                }
            }
        }
    })

    const currentLatestLesson = chaptersInActiveClass
    .flatMap((chapter) => chapter.lessons)
    .find((lesson) => {
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress ||
            challenge.challengeProgress.length === 0 ||
            challenge.challengeProgress.every((progress) => !progress.completed)
        })
    });

    return {
        activeLesson: currentLatestLesson,
        activeLessonId: currentLatestLesson?.id
    }
})


export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if(!userId) {
        return;
    }

    const activeLesson = await getCurrentLatestLesson();

    // lesson can either be the latest uncompleted lesson or any specific lesson that user wanna access
    const lessonId = id ?? activeLesson?.activeLessonId;

    if(!lessonId) {
        return;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeContent: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId)
                    }
                }
            }
        }
    })

    if (!data) {
        return;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
        return {
            ...challenge,
            completed
        }
    })

    return {
        ...data,
        challenges: normalizedChallenges
    }
})


export const getLessonPercentage = cache(async () => {
    const { userId } = await auth();

    if(!userId) {
        return;
    }

    const activeLesson = await getCurrentLatestLesson();

    if(!activeLesson) {
        return 0;
    }


    const lesson = await getLesson(activeLesson.activeLessonId);

    if(!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge: any) => challenge.completed);

    const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);

    return percentage;
})

// Get top students for leaderboard
export const getTopStudents = cache(async () => {
    const { userId } = await auth();

    if(!userId) {
        return;
    }

    const data = await db.query.userProgress.findMany({
        orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
        limit: 10,
        columns: {
            userId: true,
            userImageSrc: true,
            userName: true,
            points: true
        }
    })

    return data;
})