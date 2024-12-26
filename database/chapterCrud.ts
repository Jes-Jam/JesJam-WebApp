"use server"

import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { chapters, classes } from "./schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const createChapters = cache(async (classId: number, newChapter: Array<{ title: string, description: string }>) => {
  const { userId } = await auth();

  if (!userId) throw new Error("unauthorized");

  const mutatingClass = await db.query.classes.findFirst({
    where: eq(classes.id, classId)
  });

  if (!mutatingClass) throw new Error("Class not found");

  const ownedMutatingClass = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.ownerId, userId))
  });

  if (!ownedMutatingClass) throw new Error("You have no permission to create chapters for this class");

  await Promise.all(newChapter.map(async (chapter, index) => {
    await db.insert(chapters).values({
      classId,
      title: chapter.title,
      description: chapter.description,
      order: index + 1
    })
  }));

  revalidatePath(`/classes/${classId}/chapters`);
});


export const updateChapters = cache(async (classId: number, updatedChapters: Array<{ id?: number, title: string, description: string }>) => {
  const { userId } = await auth();

  if (!userId) throw new Error("unauthorized");

  const mutatingClass = await db.query.classes.findFirst({
    where: eq(classes.id, classId)
  });

  if (!mutatingClass) throw new Error("Class not found");

  const ownedMutatingClass = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.ownerId, userId))  
  });

  if (!ownedMutatingClass) throw new Error("You have no permission to update chapters for this class");

  const existingChapters = await db.query.chapters.findMany({
    where: eq(chapters.classId, classId)
  });

  const existingChaptersIds = existingChapters
    .map(chapters => chapters.id);

  const incomingChaptersIds = updatedChapters
    .filter(chapter => chapter.id !== undefined)
    .map(chapter => chapter.id);

  const chapterIdsToDelete = existingChaptersIds
    .filter(id => !incomingChaptersIds.includes(id))

  if (chapterIdsToDelete.length > 0) {
    await db.delete(chapters).where(
      and(eq(chapters.classId, classId), inArray(chapters.id, chapterIdsToDelete))
    )
  }

  await Promise.all(updatedChapters.map(async (chapter, index) => {
    if (chapter.id ) {
      await db.update(chapters).set({
        title: chapter.title,
        description: chapter.description,
        order: index + 1
      })
      .where(and(eq(chapters.id, chapter.id), eq(chapters.classId, classId)))
    }

    if (!chapter.id) {
      await db.insert(chapters).values({
        classId,
        title: chapter.title,
        description: chapter.description,
        order: index + 1
      })
    }
  }));

  revalidatePath(`/classes/${classId}/chapters`);
});


export const getChapters = cache(async (classId: number) => {

  const { userId } = await auth();

  if (!userId) throw new Error("unauthorized");

  const currentClass = await db.query.classes.findFirst({
    where: eq(classes.id, classId)
  });

  if (!currentClass) throw new Error("Class not found");

  const ownedClass = await db.query.classes.findFirst({
    where: and(eq(classes.id, classId), eq(classes.ownerId, userId))
  });

  if (!ownedClass) throw new Error("You have no permission to view chapters for this class");

  const returnChapters = await db.query.chapters.findMany({
    where: eq(chapters.classId, classId),
    // orderBy: {
    //   order: "asc",
    // }
  });
  

  return returnChapters;
})

export const hasChapters = cache(async (classId: number) => {
  const classChapters = await db.query.chapters.findMany({
    where: eq(chapters.classId, classId)
  });

  return classChapters.length > 0;
})