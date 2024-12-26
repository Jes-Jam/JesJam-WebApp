import { getChapters, getChapter } from "@/database/chapterCrud";
import { Button } from "@/components/ui/button";
import { chapters as chaps } from "@/database/schema";
import Link from "next/link";
import Header from "./header";

export default async function ClassPage({ params }: { params: { classId: string, chapterId: string } }) {
  const { classId, chapterId } = params;
  let error = "";
  let chapter: typeof chaps.$inferInsert | undefined;
  let className: string | undefined;

  try {
    chapter = await getChapter(Number(classId), Number(chapterId));
  } catch (err: any) {
    error = err.message || "An unexpected error occurred.";
  }

  if (chapter) {
    className = chapter?.class?.title || "Unknown Class";
  }



  return (
    <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
      <Header title="Chapters" path={`/classes/${classId}/chapters`} />
      <div className="flex justify-between items-center my-6 border border-blue-200 p-4 rounded-sm">
        <h1 className="text-xl font-semibold text-blue-400">{`${className} > ${chapter?.title}`}</h1>
        <div className="flex gap-4">
          <Link href={`/classes/${classId}/chapters/edit`}>
            <Button variant="secondary">Add or update lessons</Button>
          </Link>
        </div>
      </div>

      {!error && !chapter?.lessons?.length  &&
        <div className="text-center mt-10 text-gray-500">
          <p className="mb-4">No lessons available for this class yet.</p>
          <Link href={`/classes/${classId}/chapters/${chapterId}/lessons/create`}>
            <Button variant="secondary">Add lessons</Button>
          </Link>
        </div>
      }

      {!error && !!chapter?.lessons?.length && chapter?.lessons?.map((chapter) => (
        <div key={chapter.id} className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out">
          <h2 className="text-xl font-semibold pb-3">{chapter.title}</h2>
          <p className="text-gray-500">{chapter.description}</p>
        </div>
      ))}

      {error &&
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      }
    </div>
  );
}
