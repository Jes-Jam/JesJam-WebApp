"use client";

import Header from "./header";
import { useEffect, useState } from "react";
import { classes } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getClassById } from "@/database/classCrud";
import { createChapters } from "@/database/chapterCrud";
import Loading from "./loading";

const CreateChapterPage = ({ params }: { params: { classId: number } }) => {
  const { classId } = params;
  const [ownedClass, setOwnedClass] = useState<typeof classes.$inferSelect | null>(null);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const [chapters, setChapters] = useState([
    { title: "", description: "", errors: {title: "", description: ""} },
  ]);

  useEffect(() => {
    getClassById(classId)
      .then((classData) => {
        if (classData) {
          setOwnedClass(classData);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [classId]);

  const handleAddChapter = () => {
    setChapters([...chapters, { title: "", description: "", errors: {title: "", description: ""} }]);
    setTimeout(() => {
      const lastChapter = document.getElementById(`add-chapter-button`);
      lastChapter?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleRemoveChapter = (index: number) => {
    const newChapters = [...chapters];
    newChapters.splice(index, 1);
    setChapters(newChapters);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    updatedChapters[index].errors[field] = ''; 
    setChapters(updatedChapters);
  }

  const validateChapter = (chapter: {
    title: string;
    description: string;
    errors: { title: string; description: string };
  }) => {
    const error = { title: "", description: "" };
    if (chapter.title.trim() === "") error.title = "Title is required";
    if (chapter.description.trim() === "") error.description = "Description is required";

    if (chapter.title.length > 100) error.title = "Title is too long ()";
    if (chapter.description.length > 500) error.description = "Description is too long";

    return error;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();

    const updatedChapters = chapters.map((chapter) => ({
      ...chapter,
      errors: validateChapter(chapter),
    }));

    setChapters(updatedChapters);

    const hasError = updatedChapters.some((chapter) => chapter.errors.title || chapter.errors.description);

    if (hasError) {
      setFormError("Please fill the form correctly");
      return;
    }
    else {
      createChapters(classId, updatedChapters)
        .then(() => {
          router.push(`/classes/${classId}/chapters`);
        })
        .catch((err) => {
          setFormError(err.message);
        });
    }

  };

  return (
    <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
      <Header title="Create Chapters" />
      {!error ? (
        !ownedClass ? (
          <Loading />
        ) : (
          <>
            <div className=" text-center mt-5 text-slate-500">
              <p>
                You can create chapters for your customs class by filling the
                form below.
              </p>
              <p>you can only create at most 20 chapters for each class.</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6 w-full pb-[100px]"
            >
              {chapters.map((chapter, index) => (
                <div
                  className=" w-full border-blue-300 border-b-2 rounded-sm p-4"
                  key={index}
                  id={`chapter-${index + 1}`}
                >
                  <h3 className="text-lg font-semibold text-slate-700">
                    Chapter {index + 1}
                  </h3>
                  <div className="space-y-2">
                    <label
                      className="block text-sm mt-2 font-medium text-slate-700"
                      htmlFor={`chapter-title-${index}`}
                    >
                      title
                    </label>

                    {chapter.errors.title && (
                      <p className="text-red-500 text-md">
                        *{chapter.errors.title}
                      </p>
                    )}

                    <input
                      type="text"
                      id={`chapter-title-${index}`}
                      className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Enter chapter title"
                      value={chapter.title}
                      onChange={(e) => handleInputChange(index , "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="block text-sm mt-2 font-medium text-slate-700"
                      htmlFor={`chapter-description-${index}`}
                    >
                      description
                    </label>

                    {chapter.errors.description && (
                      <p className="text-red-500 text-md">
                        * {chapter.errors.description}
                      </p>
                    )}

                    <input
                      type="text"
                      id={`chapter-description-${index}`}
                      className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Enter Chapter description"
                      value={chapter.description}
                      onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    disabled={chapters.length <= 1}
                    className="mt-4"
                    onClick={() => handleRemoveChapter(index)}
                  >
                    Remove chapter
                  </Button>
                </div>
              ))}

              {formError && (
                <p className="text-red-500 text-md font-bold ml-4">{formError}</p>
              )}

              <div className="flex justify-between w-full px-4">
                <Button
                  id="add-chapter-button"
                  variant="secondary"
                  onClick={handleAddChapter}
                  type="button"
                  disabled={chapters.length >= 20}
                >
                  Add chapter
                </Button>
                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
              </div>
            </form>
          </>
        )
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CreateChapterPage;
