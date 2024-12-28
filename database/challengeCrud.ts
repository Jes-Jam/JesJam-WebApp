'use server'

import { getLessonByChapterId } from "./lessonCrud";
import { cache } from "react";
import db from "./drizzle";
import { challenges } from "./schema";
import { eq } from "drizzle-orm";

export const createChallenges = cache(async(classId: number, chapterId: number, lessonId: number, newChallenges: Array<{ type: string, question: string, error: { type: string, question: string } }>) => {
  await getLessonByChapterId(classId, chapterId, lessonId);

  await Promise.all(newChallenges.map(async (challenge, index) => {
    console.log(challenge)
    await db.insert(challenges).values({
      lessonId,
      type: challenge.type,
      question: challenge.question,
      order: index + 1
    });
  }));
});

export const updateChallenges = cache(async (classId: number, chapterId: number, lessonId: number, updatedChallenges: Array<{ id: number, type: string, question: string }>) => {
  await getLessonByChapterId(classId, chapterId, lessonId);

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
})

export const getChallenges = cache(async (classID: number, chapterId: number, lessonId: number ) => {
  await getLessonByChapterId(classID, chapterId, lessonId);

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
    }
  })

  return returnChallenges
})

export const hasChallenges = cache(async (classId: number, chapterId: number, lessonId: number) => {
  await getLessonByChapterId(classId, chapterId, lessonId);

  const   returnChallenges = await db.query.challenges.findMany({
    where: eq(challenges.lessonId, lessonId)
  });

  return returnChallenges.length > 0;
});

export const getChallengeById = cache(async (classId: number, chapterId: number, lessonId: number, challengeId: number) => {
  await getLessonByChapterId(classId, chapterId, lessonId);

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  });

  return challenge;
});
