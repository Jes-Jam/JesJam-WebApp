import { getLessons } from "@/database/lessonCrud";
import { lessons as Lessons } from "@/database/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./header";



export default async function LessonsPage({
  params,
}: {
  params: { classId: string; chapterId: string };
}) {
  const { classId, chapterId } = params;
  let error = "";
  let lessons: typeof Lessons.$inferSelect[] | undefined;
  let className: string | undefined;
  let chapterName: string | undefined;

  try {
    lessons = await getLessons(Number(classId), Number(chapterId));
  } catch (err: any) {
    error = err.message || "An unexpected error occurred.";
  }

  if (lessons?.length) {
    chapterName = lessons[0]?.chapter?.title || "Unknown Chapter";
    className = lessons[0]?.chapter?.class?.title || "Unknown class";
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
      <Header title="Lessons" />
      <div className="flex justify-between items-center my-6 border border-blue-200 p-4 rounded-sm">
        <h1 className="text-xl font-semibold text-blue-400">{`${className} > ${chapterName} > Lessons`}</h1>
        <div className="flex gap-4">
          <Link href={`/classes/${classId}/chapters/${chapterId}/lessons/edit`}>
            <Button variant="secondary">Add or update lessons</Button>
          </Link>
        </div>
      </div>

      {!error && !lessons?.length && (
        <div className="text-center mt-10 text-gray-500">
          <p className="mb-4">No lessons available for this chapter yet.</p>
          <Link href={`/classes/${classId}/chapters/${chapterId}/lessons/create`}>
            <Button variant="secondary">Add Lessons</Button>
          </Link>
        </div>
      )}

      {!error &&
        lessons?.length > 0 &&
        lessons?.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/classes/${classId}/chapters/${chapterId}/lessons/${lesson.id}/challenges`}
          >
            <div className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out">
              <h2 className="text-xl font-semibold pb-3">{lesson.title}</h2>
              <p className="text-gray-500 truncate">{lesson.description}</p>
            </div>
          </Link>
        ))}

      {error && (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
