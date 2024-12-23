"use server"

import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes } from "./schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/classes");
})

export const updateClass = cache(async (classId: number, title: string) => {  
  const { userId } = await auth();

  if (!userId) {
    return;
  }
  await db.update(classes).set({
    title
  }).where(eq(classes.id, classId));

  revalidatePath("/classes");
})

export const deleteClass = cache(async (classId: number) => {
  await db.delete(classes).where(eq(classes.id, classId));

  revalidatePath("/classes");
})

export const getClassById = cache(async (classId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const data = await db.query.classes.findFirst({
    where: and(eq(classes.ownerId, userId), eq(classes.id, classId)),
    with: {
      userProgress: true,
      enrollments: true
    }
  });

  return data;
});

export const getCustomClasses = cache(async () => {
  const { userId } = await auth();
  if (!userId) {
    return;
  }
  
  const data = await db.query.classes.findMany({
    where: eq(classes.ownerId, userId),
    with: {
      userProgress: true,
      enrollments: true
    }
  });

  return data;
})