"use client";

import Header from "./header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateChapters, getChapters } from "@/database/chapterCrud";
import Loading from "./loading";

const UpdateChapterPage = ({ params }: { params: { classId: number } }) => {
  const { classId } = params;
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [chapters, setChapters] = useState<
    Array<{
      classId?: number;
      id?: number;
      title: string;
      description: string;
      order?: number;
      errors?: { title?: string; description?: string };
    }>
  >([]);

  useEffect(() => {
    getChapters(classId)
      .then((chapterData) => {
        if (chapterData) {
          setChapters(chapterData);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      { title: "", description: "", errors: { title: "", description: "" } },
    ]);
    
    setTimeout(() => {
      console.log(chapters);
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
    if (updatedChapters[index].errors) {
      updatedChapters[index].errors[field] = "";
    }
    setChapters(updatedChapters);
  };

  const validateChapter = (chapter: {
    title: string;
    description: string;
    errors: { title: string; description: string };
  }) => {
    const error = { title: "", description: "" };
    if (!chapter.title.trim()) error.title = "Title is required";
    if (!chapter.description.trim()) error.description = "Description is required";
    if (chapter.title.length > 100) error.title = "Title is too long (must be less than 100 characters)";
    if (chapter.description.length > 500) error.description = "Description is too long (must be less than 500 characters)";
    return error;
  };  

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e.preventDefault();

    const updatedChapters = chapters?.map((chapter) => ({
      ...chapter,
      errors: validateChapter(chapter),
    }));

    setChapters(updatedChapters);

    const hasError = updatedChapters.some(
      (chapter) => chapter.errors.title || chapter.errors.description
    );

    if (hasError) {
      setFormError("Please fill the form correctly");
      return;
    } 

    setIsSubmitting(true);

    updateChapters(classId, updatedChapters)
      .then(() => {
        router.push(`/classes/${classId}/chapters`);
      })
      .catch((err) => {
        setFormError(err.message);
      })
      .finally(() => {
        setFormError("");
        setIsSubmitting(false);
      });
  };

  return (
    <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
      <Header title="Create Chapters" />
      <div className=" text-center mt-5 text-slate-500">
        <p>
          You can update chapters for your customs class by filling the
          form below.
        </p>
        <p>you can only create at most 20 chapters for each class.</p>
      </div>
      {error &&
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      }

      {chapters.length === 0 && !error &&
        <Loading />
      }

      {
        chapters.length > 0 &&        
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 w-full pb-[100px]"
        >

          {
            chapters.length
          }
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

                {chapter?.errors?.title && (
                  <p className="text-red-500 text-md">
                    *{chapter?.errors?.title}
                  </p>
                )}

                <input
                  type="text"
                  id={`chapter-title-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter chapter title"
                  value={chapter.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`chapter-description-${index}`}
                >
                  description
                </label>

                {chapter?.errors?.description && (
                  <p className="text-red-500 text-md">
                    * {chapter?.errors?.description}
                  </p>
                )}

                <input
                  type="text"
                  id={`chapter-description-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter Chapter description"
                  value={chapter.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                />
              </div>

              <Button
                id={`remove-chapter-button-${index}` }
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
            <p className="text-red-500 text-md font-bold ml-4">
              {formError}
            </p>
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
            <Button variant="primary" disabled={isSubmitting} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      }
    </div>
  );
};

export default UpdateChapterPage;
