"use client";

import Header from "./header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateLessons, getLessons } from "@/database/lessonCrud";
import Loading from "./loading";

const UpdateLessonPage = ({ params }: { params: { classId: number; chapterId: number } }) => {
  const { classId, chapterId } = params;
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [lessons, setLessons] = useState<
    Array<{
      chapterId?: number;
      id?: number;
      title: string;
      description: string;
      order?: number;
      errors?: { title?: string; description?: string };
    }>
  >([]);

  useEffect(() => {
    getLessons(classId, chapterId)
      .then((lessonData) => {
        if (lessonData) {
          setLessons(lessonData);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [classId, chapterId]);

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      { title: "", description: "", errors: { title: "", description: "" } },
    ]);

    setTimeout(() => {
      const lastLesson = document.getElementById(`add-lesson-button`);
      lastLesson?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleRemoveLesson = (index: number) => {
    const newLessons = [...lessons];
    newLessons.splice(index, 1);
    setLessons(newLessons);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = value;
    if (updatedLessons[index].errors) {
      updatedLessons[index].errors[field] = "";
    }
    setLessons(updatedLessons);
  };

  const validateLesson = (lesson: {
    title: string;
    description: string;
    errors: { title: string; description: string };
  }) => {
    const error = { title: "", description: "" };
    if (!lesson.title.trim()) error.title = "Title is required";
    if (!lesson.description.trim()) error.description = "description is required";
    if (lesson.title.length > 100) error.title = "Title is too long (must be less than 100 characters)";
    if (lesson.description.length > 1000) error.description = "description is too long (must be less than 1000 characters)";
    return error;
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e.preventDefault();

    const updatedLessons = lessons?.map((lesson) => ({
      ...lesson,
      errors: validateLesson(lesson),
    }));

    setLessons(updatedLessons);

    const hasError = updatedLessons.some(
      (lesson) => lesson.errors.title || lesson.errors.description
    );

    if (hasError) {
      setFormError("Please fill the form correctly");
      return;
    }

    setIsSubmitting(true);

    updateLessons(classId, chapterId, updatedLessons)
      .then(() => {
        router.push(`/classes/${classId}/chapters/${chapterId}/lessons`);
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
      <Header title="Edit Lessons" />
      <div className="text-center mt-5 text-slate-500">
        <p>You can edit lessons for this chapter by filling the form below.</p>
        <p>You can create up to 20 lessons for each chapter.</p>
      </div>
      {error && (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}

      {lessons.length === 0 && !error && <Loading />}

      {lessons.length > 0 && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full pb-[100px]">
          {lessons.map((lesson, index) => (
            <div
              className="w-full border-blue-300 border-b-2 rounded-sm p-4"
              key={index}
              id={`lesson-${index + 1}`}
            >
              <h3 className="text-lg font-semibold text-slate-700">
                Lesson {index + 1}
              </h3>
              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`lesson-title-${index}`}
                >
                  Title
                </label>

                {lesson?.errors?.title && (
                  <p className="text-red-500 text-md">*{lesson?.errors?.title}</p>
                )}

                <input
                  type="text"
                  id={`lesson-title-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter lesson title"
                  value={lesson.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`lesson-description-${index}`}
                >
                  description
                </label>

                {lesson?.errors?.description && (
                  <p className="text-red-500 text-md">*{lesson?.errors?.description}</p>
                )}

                <textarea
                  id={`lesson-description-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter lesson description"
                  value={lesson.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                ></textarea>
              </div>

              <Button
                id={`remove-lesson-button-${index}`}
                variant="destructive"
                disabled={lessons.length <= 1}
                className="mt-4"
                onClick={() => handleRemoveLesson(index)}
              >
                Remove lesson
              </Button>
            </div>
          ))}

          {formError && (
            <p className="text-red-500 text-md font-bold ml-4">{formError}</p>
          )}

          <div className="flex justify-between w-full px-4">
            <Button
              id="add-lesson-button"
              variant="secondary"
              onClick={handleAddLesson}
              type="button"
              disabled={lessons.length >= 20}
            >
              Add Lesson
            </Button>
            <Button variant="primary" disabled={isSubmitting} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateLessonPage;
