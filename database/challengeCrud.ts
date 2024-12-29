'use server'

import { getLessonById } from "./lessonCrud";
import { cache } from "react";
import db from "./drizzle";
import { challenges } from "./schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createChallenges = cache(async(classId: number, chapterId: number, lessonId: number, newChallenges: Array<{ type: string, question: string, error: { type: string, question: string } }>) => {
  await getLessonById(classId, chapterId, lessonId);

  await Promise.all(newChallenges.map(async (challenge, index) => {
    console.log(challenge)
    await db.insert(challenges).values({
      lessonId,
      type: challenge.type,
      question: challenge.question,
      order: index + 1
    });
  }));

  revalidatePath(`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges`);
});

export const updateChallenges = cache(async (classId: number, chapterId: number, lessonId: number, updatedChallenges: Array<{ id: number, type: string, question: string }>) => {
  await getLessonById(classId, chapterId, lessonId);

  const existingChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId)
  });

  const existingChallengesIds = existingChallenges
    .map(challenges => challenges.id);

  const incomingChallengesIds = updatedChallenges
    .filter(challenge => challenge.id !== undefined)
    .map(challenge => challenge.id);

  const challengeIdsToDelete = existingChallengesIds
    .filter(id => !incomingChallengesIds.includes(id));

  if (challengeIdsToDelete.length > 0) {
    await Promise.all(challengeIdsToDelete.map(async id => {
      await db.delete(challenges).where(eq(challenges.id, id));
    }));
  }

  await Promise.all(updatedChallenges.map(async (challenge, index) => {
    if (challenge.id) {
      await db.update(challenges).set({
        type: challenge.type,
        question: challenge.question,
        order: index + 1
      })
        .where(eq(challenges.id, challenge.id));
    } else {
      await db.insert(challenges).values({
        lessonId,
        type: challenge.type,
        question: challenge.question,
        order: index + 1
      });
    }
  }))

  revalidatePath(`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges`);
})

export const getChallenges = cache(async (classID: number, chapterId: number, lessonId: number ) => {
  await getLessonById(classID, chapterId, lessonId);

  const returnChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId),
    with: {
      lesson: {
        with: {
          chapter: {
            with: {
              class: true
            }
          }
        }
      }
    },
    orderBy: [asc(challenges.order)]
  })

  return returnChallenges
})

export const hasChallenges = cache(async (classId: number, chapterId: number, lessonId: number) => {
  await getLessonById(classId, chapterId, lessonId);

  const   returnChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId)
  });

  return returnChallenges.length > 0;
});

export const getChallengeById = cache(async (classId: number, chapterId: number, lessonId: number, challengeId: number) => {
  await getLessonById(classId, chapterId, lessonId);

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  });

  return challenge;
});
