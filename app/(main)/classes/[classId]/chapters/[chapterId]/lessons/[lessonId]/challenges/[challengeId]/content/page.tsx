import { getChallengeContents } from "@/database/challengeContentCrud";
import { getLessonById } from "@/database/lessonCrud";
import { getClassById } from "@/database/classCrud";
import { getChapterById } from "@/database/chapterCrud";
import {
  classes as Classes,
  chapters as Chapters,
  lessons as Lessons,
  challengeContent as ChallengesContent,
} from "@/database/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./header";

export default async function ChallengeContentPage({
  params,
}: {
  params: {
    classId: string;
    chapterId: string;
    lessonId: string;
    challengeId: string;
  };
}) {
  const { classId, chapterId, lessonId, challengeId } = params;

  let error = "";
  let challengeContent: typeof ChallengesContent.$inferSelect | null = null;
  let className: typeof Classes.$inferSelect;
  let chapterName: typeof Chapters.$inferSelect;
  let lessonName: typeof Lessons.$inferSelect;

  try {
    // Fetching challenge content and related data
    challengeContent = await getChallengeContents(
      Number(classId),
      Number(chapterId),
      Number(lessonId),
      Number(challengeId)
    );
    className = await getClassById(Number(classId));
    chapterName = await getChapterById(Number(classId), Number(chapterId));
    lessonName = await getLessonById(
      Number(classId),
      Number(chapterId),
      Number(lessonId)
    );
  } catch (err: any) {
    error = err.message || "An unexpected error occurred.";
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
      <Header title="Challenge Content" />

      {/* Display class, chapter, lesson, and challenge path */}
      <div className="flex justify-between items-center my-6 border border-blue-200 p-4 rounded-sm">
        <h1 className="text-xl font-semibold text-blue-400">
          {`${className?.title} -> chapter${chapterName?.order} -> lesson${lessonName?.order} -> Challenge${challengeId} -> Contents`}
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/${challengeId}/content/edit`}
          >
            <Button variant="secondary">Edit Challenge Content</Button>
          </Link>
        </div>
      </div>

      {/* Display error message if there is an error */}
      {error && (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}

      {/* Show the challenge content if it exists */}
      {challengeContent &&
        challengeContent?.map((challenge) => (
          <div className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out">
            <h2 className="text-xl font-semibold pb-3">
              Type: {challenge.correct ? "Correct" : "Incorrect"}
            </h2>
            <p className="text-gray-500 truncate">text: {challenge.text}</p>
          </div>
        ))}

      {/* If no challenge content exists */}
      {!error && !challengeContent && (
        <div className="text-center mt-10 text-gray-500">
          <p className="mb-4">No content available for this challenge.</p>
          <Link
            href={`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/${challengeId}/content/create`}
          >
            <Button variant="secondary">Add Content</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
