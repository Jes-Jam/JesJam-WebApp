import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes, userProgress } from "./schema";
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
        // throw new Error("Failed to fetch user progress");
    }
});
