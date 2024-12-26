import { getChapters } from "@/database/chapterCrud";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./header";

interface Chapter {
  id: number;
  title: string;
  description: string;
  class: {
    title: string;
  };
}

export default async function ClassPage({ params }: { params: { classId: string } }) {
  const { classId } = params;
  let error = "";
  let chapters: Chapter[] | undefined;
  let className: string | undefined;

  try {
    chapters = await getChapters(Number(classId));
  } catch (err: any) {
    error = err.message || "An unexpected error occurred.";
  }

  if (chapters?.length) {
    className = chapters[0]?.class?.title || "Unknown Class";
  }



  return (
    <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
      <Header title="Chapters" />
      <div className="flex justify-between items-between my-6">
        <h1 className="text-3xl font-bold">{className}</h1>
        <div className="flex gap-4">
          <Link href={`/classes/${classId}/chapters/edit`}>
            <Button variant="secondary">Add or update chapters</Button>
          </Link>
        </div>
      </div>

      {!error && !chapters?.length  &&
        <div className="text-center mt-10 text-gray-500">
          <p>No chapters available for this class yet.</p>
          <Link href={`/classes/${classId}/chapters/edit`}>
            <Button variant="secondary">Add Chapters</Button>
          </Link>
        </div>
      }

      {!error && chapters?.length > 0 && chapters?.map((chapter) => (
        <Link key={chapter.id} href={`/classes/${classId}/chapters/${chapter.id}`}>
          <div className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out">
            <h2 className="text-xl font-bold">{chapter.title}</h2>
            <p className="text-gray-500">{chapter.description}</p>
          </div>
        </Link>
      ))}

      {error &&
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      }
    </div>
  );
}
