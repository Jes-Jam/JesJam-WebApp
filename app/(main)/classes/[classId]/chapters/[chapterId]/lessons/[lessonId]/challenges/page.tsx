import { getChallenges } from "@/database/challengeCrud";
import { getLessonById } from "@/database/lessonCrud";
import { getClassById } from "@/database/classCrud";
import { getChapterById } from "@/database/chapterCrud";
import {
  classes as Classes,
  chapters as Chapters,
  lessons as Lessons,
  challenges as Challenges,
} from "@/database/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./header";

export default async function ChallengesPage({
  params,
}: {
  params: { classId: string; chapterId: string; lessonId: string };
}) {
  const { classId, chapterId, lessonId } = params;

  let error = "";
  let challenges: typeof Challenges.$inferSelect[] | [];
  let className: typeof Classes.$inferSelect;
  let chapterName: typeof Chapters.$inferSelect;
  let lessonName: typeof Lessons.$inferSelect;

  try {
    challenges = await getChallenges(Number(classId), Number(chapterId), Number(lessonId));
    className = await getClassById(Number(classId));
    chapterName = await getChapterById(Number(classId), Number(chapterId));
    lessonName = await getLessonById(Number(classId), Number(chapterId), Number(lessonId));
  } catch (err: any) {
    error = err.message || "An unexpected error occurred.";
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
      <Header title="Challenges" />
      <div className="flex justify-between items-center my-6 border border-blue-200 p-4 rounded-sm">
        <h1 className="text-xl font-semibold text-blue-400">
          {`${className?.title} -> chapter${chapterName?.order} -> lesson${lessonName?.order} -> Challenges`}
        </h1>
        <div className="flex gap-4">
          <Link href={`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/edit`}>
            <Button variant="secondary">Add or update challenges</Button>
          </Link>
        </div>
      </div>

      {!error && !challenges?.length && (
        <div className="text-center mt-10 text-gray-500">
          <p className="mb-4">No challenges available for this lesson yet.</p>
          <Link href={`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/create`}>
            <Button variant="secondary">Add Challenges</Button>
          </Link>
        </div>
      )}

      {!error &&
        challenges?.length > 0 &&
        challenges?.map((challenge) => (
          <div
            key={challenge.id}
            className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out"
          >
            <h2 className="text-xl font-semibold pb-3">{challenge.question}</h2>
            <p className="text-gray-500 truncate">Type: {challenge.type}</p>
          </div>
        ))}

      {error && (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
