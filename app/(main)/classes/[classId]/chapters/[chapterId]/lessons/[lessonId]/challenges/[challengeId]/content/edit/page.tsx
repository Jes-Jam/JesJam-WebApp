"use client";

import Header from "./header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getChallengeContents, updateChallengeContents } from "@/database/challengeContentCrud";
import Loading from "./loading";

const EditChallengePage = ({
  params,
}: {
  params: { classId: number; chapterId: number; lessonId: number; challengeId: number };
}) => {
  const { classId, chapterId, lessonId, challengeId } = params;
  const [challengesContents, setChallengesContents] = useState<
    Array<{ text: string; correct: boolean | null; errors: { text?: string; correct?: string } }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch existing challenge contents from the database
    getChallengeContents(classId, chapterId, lessonId, challengeId)
      .then((data) => {
        if (data) {
          setChallengesContents(data.map((content: any) => ({
            text: content.text || "",
            correct: content.correct !== undefined ? content.correct : null,
            errors: { text: "", correct: "" },
          })));
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [classId, chapterId, lessonId, challengeId]);

  const handleAddChallenge = () => {
    setChallengesContents([
      ...challengesContents,
      { text: "", correct: null, errors: { text: "", correct: "" } },
    ]);
    setTimeout(() => {
      const lastChallenge = document.getElementById("add-challenge-button");
      lastChallenge?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleRemoveChallenge = (index: number) => {
    const updatedContents = [...challengesContents];
    updatedContents.splice(index, 1);
    setChallengesContents(updatedContents);
  };

  const handleInputChange = (index: number, field: string, value: string | boolean | null) => {
    const updatedContents = [...challengesContents];
    updatedContents[index][field] = value;
    updatedContents[index].errors[field] = "";
    setChallengesContents(updatedContents);
  };

  const validateChallenge = (challenge: { text: string; correct: boolean | null; errors: { text: string; correct: string } }) => {
    const errors = { text: "", correct: "" };
    if (!challenge.text.trim()) errors.text = "Text is required";
    if (challenge.correct === null) errors.correct = "Content type status is required";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();

    const updatedContents = challengesContents.map((challenge) => ({
      ...challenge,
      errors: validateChallenge(challenge),
    }));

    setChallengesContents(updatedContents);

    const hasError = updatedContents.some(
      (challenge) => challenge.errors.text || challenge.errors.correct
    );

    if (hasError) {
      setFormError("Please fill out the form correctly.");
      return;
    }

    const onlyOneContent = updatedContents.length === 1;

    if (onlyOneContent) {
      setFormError("Please add at least two contents (one correct and one incorrect).");
      return;
    }

    const noCorrectContent = updatedContents.every((content) => !content.correct);

    if (noCorrectContent) {
      setFormError("Please add at least one correct content.");
      return;
    }

    const noIncorrectContent = updatedContents.every((content) => !content.correct);

    if (noIncorrectContent) {
      setFormError("Please add at least one incorrect content.");
      return;
    }

    setIsSubmitting(true);

    updateChallengeContents(classId, chapterId, lessonId, challengeId, updatedContents)
      .then(() => {
        router.push(`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/${challengeId}/content`);
      })
      .catch((err) => {
        setFormError(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
      <Header
        path={`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}`}
        title="Edit Challenge Contents"
      />
      <div className="text-center mt-5 text-slate-500">
        <p>You can edit the challenge contents for this lesson below.</p>
        <p>You can have up to 4 challenge contents per lesson.</p>
      </div>

      {error && (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}

      {isFetching && !error && <Loading />}

      {challengesContents.length >= 0 && !error && !isFetching && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full pb-[100px]">
          {challengesContents.map((challenge, index) => (
            <div
              className="w-full border-blue-300 border-b-2 rounded-sm p-4"
              key={index}
              id={`challenge-${index + 1}`}
            >
              <h3 className="text-lg font-semibold text-slate-700">
                Content {index + 1}
              </h3>
              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`challenge-type-${index}`}
                >
                  Content type (correct or incorrect)
                </label>

                {challenge.errors.correct && (
                  <p className="text-red-500 text-md">*{challenge.errors.correct}</p>
                )}

                <select
                  id={`challenge-type-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  value={challenge.correct ?? ""}
                  onChange={(e) => handleInputChange(index, "correct", e.target.value === "true")}
                >
                  <option value="">Choose content validation</option>
                  <option value={true}>Correct</option>
                  <option value={false}>Incorrect</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`challenge-text-${index}`}
                >
                  Text
                </label>

                {challenge.errors.text && (
                  <p className="text-red-500 text-md">* {challenge.errors.text}</p>
                )}

                <input
                  type="text"
                  id={`challenge-text-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter challenge content"
                  value={challenge.text}
                  onChange={(e) => handleInputChange(index, "text", e.target.value)}
                />
              </div>

              <Button
                variant="destructive"
                disabled={challengesContents.length <= 1}
                className="mt-4"
                type="button"
                onClick={() => handleRemoveChallenge(index)}
              >
                Remove Content
              </Button>
            </div>
          ))}

          {formError && (
            <p className="text-red-500 text-md font-bold ml-4">{formError}</p>
          )}

          <div className="flex justify-between w-full px-4">
            <Button
              id="add-challenge-button"
              variant="secondary"
              onClick={handleAddChallenge}
              type="button"
              disabled={challengesContents.length >= 4}
            >
              Add Content
            </Button>
            <Button variant="primary" disabled={isSubmitting} onClick={handleSubmit}>
              Update Content
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditChallengePage;
