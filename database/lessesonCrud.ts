"use server"

import db from "./drizzle";
import { lessons } from "./schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { getChapter } from "./chapterCrud";

export const ceatelessson = cache(async (classId: number, chapterId: number, newLessons: Array<{ title: string, description: string }>) => {

  await getChapter(classId, chapterId);

  await Promise.all(newLessons.map(async (lesson, index) => {
    await db.insert(lessons).values({
      chapterId,
      title: lesson.title,
      description: lesson.description,
      order: index + 1
    });
  }));

  revalidatePath(`/classes/${classId}/chapters/${chapterId}`);
});

export const updateLessons = cache(async (classId: number, chapterId: number, updatedLessons: Array<{ id: number, title: string, description: string }>) => {
  await getChapter(classId, chapterId);

  const existingLessons = await db.query.lessons.findMany({
    where: eq(lessons.chapterId, chapterId)
  });

  const existingLessonsIds = existingLessons
    .map(lessons => lessons.id);

  const incomingLessonnsIds = updatedLessons
    .filter(lesson => lesson.id !== undefined)
    .map(lesson => lesson.id);

  const lessonIdsToDelete = existingLessonsIds
    .filter(id => !incomingLessonnsIds.includes(id));

  if (lessonIdsToDelete.length > 0) {
    await Promise.all(lessonIdsToDelete.map(async id => {
      await db.delete(lessons).where(eq(lessons.id, id));
    }));
  }

  await Promise.all(updatedLessons.map(async (lesson, index) => {
    if (lesson.id) {
      await db.update(lessons).set({
        title: lesson.title,
        description: lesson.description,
        order: index + 1
      })
      .where(and(eq(lessons.id, lesson.id), eq(lessons.chapterId, chapterId)));
    }

    if (!lesson.id) {
      await db.insert(lessons).values({
        chapterId,
        title: lesson.title,
        description: lesson.description,
        order: index + 1
      });
    }
  }));

  revalidatePath(`/classes/${classId}/chapters/${chapterId}`);
});

export const getLessons = cache(async (classId: number, chapterId: number) => {
  await getChapter(classId, chapterId);

  const returnLessons = await db.query.lessons.findMany({
    where: eq(lessons.chapterId, chapterId),
  });

  return returnLessons;
});