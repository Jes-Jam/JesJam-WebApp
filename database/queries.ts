import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes, userProgress } from "./schema";
import { eq } from "drizzle-orm";

export const getClasses = cache(async () => {
    const classes = await db.query.classes.findMany();
    return classes
})

export const getClassById = cache(async (classId: number) =>{
    const data = await db.query.classes.findFirst({
        where : eq(classes.id, classId)
    })
    return data
})

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if(!userId) return;

    const data = await db.query.userProgress.findFirst({
        where : eq(userProgress.userId, userId),
        with: {
            activeClass: true
        }
    })

    return data
})