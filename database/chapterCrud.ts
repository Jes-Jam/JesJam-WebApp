"use server"

import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { chapters, classes } from "./schema";
import { eq, and } from "drizzle-orm";
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

  if (!ownedMutatingClass) throw new Error("Unauthorized");

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

