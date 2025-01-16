"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./header";
import Loading from "./loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ChapterModal from "./chapter-dialog/chapter-dialog";

export default function ClassPage({ params }: { params: { classId: string } }) {
  const { classId } = params;
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<any | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await axios.get(`/api/user-classes/${classId}`);
        const chaptersResponse = await axios.get(`/api/user-classes/${classId}/user-chapters`);

        setCurrentClass(classResponse.data);
        setChapters(chaptersResponse.data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const fetchChapters = async () => {
    const chaptersResponse = await axios.get(`/api/user-classes/${classId}/user-chapters`);
    setChapters(chaptersResponse.data);
  };

  const handleEditClick = (chapter: any) => {
    setSelectedChapter(chapter);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedChapter(undefined); // Reset selected chapter
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
      <Header title={currentClass?.title || "Class Chapters"} classId={classId} />

      <div className="flex justify-between items-center my-6">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/classes" className="font-bold">Classes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/classes/${classId}`} className="text-sky-500">
                  {currentClass?.title || "Loading..."}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex gap-4">
          <Button
            variant="primaryOutline"
            onClick={() => handleAddClick()}
          >
            Add chapter
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-500 mt-6">All Chapters</h2>

        {!error && (chapters?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
            <div className="flex flex-col items-center justify-center">
              <p className="mb-4 font-lg">No chapters available for this class yet.</p>
              <Button variant="primaryOutline" onClick={() => handleAddClick()}>Add chapter</Button>
            </div>
          </div>
        )}

        {!error && chapters && chapters.length > 0 && (
          <div className="grid gap-4">
            {chapters.map((chapter) => (
              <div key={chapter.id}>
                <div className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/classes/${classId}/chapters/${chapter.id}`}>
                        <h3 className="text-xl font-semibold pb-3 text-sky-500 hover:text-sky-600">{chapter.title}</h3>
                      </Link>
                      {chapter.description && (
                        <p className="text-gray-500/90 text-sm">{chapter.description}</p>
                      )}
                    </div>
                    <div>
                      <Button variant="default" className="text-gray-500" onClick={() => handleEditClick(chapter)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-red-500 text-lg font-bold">{error}</p>
          </div>
        )}
      </div>

      <ChapterModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChapter(undefined);
        }}
        classId={Number(params.classId)}
        chapter={selectedChapter}
        onSuccess={() => {
          // Refresh chapters list
          fetchChapters();
        }}
      />
    </div>
  );
}
