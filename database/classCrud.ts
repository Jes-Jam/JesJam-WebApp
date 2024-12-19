import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes } from "./schema";
import { eq } from "drizzle-orm";
import { getClassById as getClass } from "./queries";

export const createClass = cache(async (title: string) => {
  const { userId } = await auth();
  
  if (!userId) {
    return;
  }

  await db.insert(classes).values({
    title,
    imageSrc: "/images/mascot.svg",
    ownerId: userId,
    isPrivateClass: true
  });
})

export const upadteClass = cache(async (classId: number, title: string) => {  
  const { userId } = await auth();

  if (!userId) {
    return;
  }
  await db.update(classes).set({
    title
  }).where(eq(classes.id, classId));
})

export const deleteClass = cache(async (classId: number) => {
  await db.delete(classes).where(eq(classes.id, classId));
})

export const getClassById = getClass;