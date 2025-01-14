'use server'

import db from "./drizzle"
import { cache } from "react";
import { getChallengeById } from "./challengeCrud";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createChallengeContents = cache(async( classId: number, chapterId: number, lessonId: number, challengeId: number, newChallengeContents: Array<{ text: string, correct: boolean }>) => {
  await	getChallengeById(classId, chapterId, lessonId, challengeId);

  await Promise.all(newChallengeContents.map(async (content) => {
    await db.insert(challengeContent).values({
      challengeId: challengeId,
      text: content.text,
      correct: content.correct,
      imageSrc: '/mascot.svg',
      audioSrc: 'audio/c10o1.mp3'
    })
  }));
});

export const updateChallengeContents = cache(async( classId: number, chapterId: number, lessonId: number, challengeId: number, updatedChallengeContents: Array<{id: number, text: string, correct: boolean }>) => {
  await getChallengeById(classId, chapterId, lessonId, challengeId);

  const existingContents = await db.query.challengeContent.findMany({
    where: eq(challengeContent.challengeId, challengeId)
  });

  const existingContentsIds = existingContents
    .map((content) => content.id);

  const incommingContentIds = updatedChallengeContents
    .filter(content => content.id !== undefined )
    .map(content => content.id);

  const contentIdsToDelete = existingContentsIds
    .filter(id => !incommingContentIds.includes(id));

  if (contentIdsToDelete.length > 0) {
    Promise.all(contentIdsToDelete.map(async (id) => {
      await db.delete(challengeContent).where(eq(challengeContent.id, id));
    }))
  }

  Promise.all(updatedChallengeContents.map(async (content) => {
    if (content.id) {
      await db.update(challengeContent).set({
        text: content.text,
        correct: content.correct,
      })
      .where(eq(challengeContent.id, content.id))
    }
    else {
      await db.insert(challengeContent).values({
        challengeId: challengeId,
        text: content.text,
        correct: content.correct,
        imageSrc: '/mascot.svg', // corrected spelling here
        audioSrc: 'audio/c10o1.mp3'
      });
    }
  }));

  revalidatePath(`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/${challengeId}`);
});

export const deleteAllChallengeContent = cache(async(classId: number, chapterId: number, lessonId: number, challengeId: number) => {
  await getChallengeById(classId, chapterId, lessonId, challengeId);

  await db.delete(challengeContent)
    .where(eq(challengeContent.challengeId, challengeId))
});

export const getChallengeContents = cache(async(classId: number, chapterId: number, lessonId: number, challengeId: number) => {
  await getChallengeById(classId, chapterId, lessonId, challengeId);

  const challengeContents = await db.query.challengeContent.findMany({
    where: eq(challengeContent.challengeId, challengeId)
  });

  return challengeContents
});

export const hasChallengeContents = cache(async(classId: number, chapterId: number, lessonId: number, challengeId: number) => {
  await getChallengeById(classId, chapterId, lessonId, challengeId);

  const challengeContents = await db.query.challengeContent.findMany({
    where: eq(challengeContent.challengeId, challengeId)
  });

  return challengeContents.length > 0;  
});
