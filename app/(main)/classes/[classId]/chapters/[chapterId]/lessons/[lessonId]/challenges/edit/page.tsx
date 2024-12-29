"use client";

import Header from "./header";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getChallenges, updateChallenges } from "@/database/challengeCrud";
import Loading from "./loading";

const UpdateChallengePage = ({
  params,
}: {
  params: { classId: number; chapterId: number; lessonId: number };
}) => {
  const { classId, chapterId, lessonId } = params;
  const [challenges, setChallenges] = useState<
    Array<{
      type: string;
      question: string;
      errors?: { type?: string; question?: string };
    }>
  >([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getChallenges(classId, chapterId, lessonId)
      .then((challengeData) => {
        if (challengeData) {
          setChallenges(
            challengeData.map((challenge: any) => ({
              type: challenge.type || "",
              question: challenge.question || "",
              errors: { type: "", question: "" },
            }))
          );
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [classId, chapterId, lessonId]);

  const handleAddChallenge = () => {
    setChallenges([
      ...challenges,
      { type: "", question: "", errors: { type: "", question: "" } },
    ]);
    setTimeout(() => {
      const lastChallenge = document.getElementById(`add-challenge-button`);
      lastChallenge?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleRemoveChallenge = (index: number) => {
    const updatedChallenges = [...challenges];
    updatedChallenges.splice(index, 1);
    setChallenges(updatedChallenges);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index][field] = value;
    if (updatedChallenges[index].errors) {
      updatedChallenges[index].errors[field] = "";
    }
    setChallenges(updatedChallenges);
  };

  const validateChallenge = (challenge: {
    type: string;
    question: string;
    errors: { type: string; question: string };
  }) => {
    const error = { type: "", question: "" };
    if (!challenge.type.trim()) error.type = "Type is required";
    if (!challenge.question.trim()) error.question = "Question is required";
    if (challenge.type.length > 100)
      error.type = "Type is too long (must be less than 100 characters)";
    if (challenge.question.length > 500)
      error.question = "Question is too long (must be less than 500 characters)";
    return error;
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e.preventDefault();

    const updatedChallenges = challenges.map((challenge) => ({
      ...challenge,
      errors: validateChallenge(challenge),
    }));

    setChallenges(updatedChallenges);

    const hasError = updatedChallenges.some(
      (challenge) => challenge.errors.type || challenge.errors.question
    );

    if (hasError) {
      setFormError("Please fill the form correctly");
      return;
    }

    setIsSubmitting(true);

    updateChallenges(classId, chapterId, lessonId, updatedChallenges)
      .then(() => {
        router.push(
          `/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges`
        );
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
        title="Update Challenges"
      />
      <div className="text-center mt-5 text-slate-500">
        <p>You can update the challenges for this lesson by filling out the form below.</p>
        <p>You can create up to 50 challenges for each lesson.</p>
      </div>
      {error && (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        </div>
      )}

      {isFetching && !error && <Loading />}

      {challenges.length >= 0 && !error && !isFetching && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full pb-[100px]">
          {challenges.map((challenge, index) => (
            <div
              className="w-full border-blue-300 border-b-2 rounded-sm p-4"
              key={index}
              id={`challenge-${index + 1}`}
            >
              <h3 className="text-lg font-semibold text-slate-700">
                Challenge {index + 1}
              </h3>
              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`challenge-type-${index}`}
                >
                  Type
                </label>
                {challenge?.errors?.type && (
                  <p className="text-red-500 text-md">*{challenge.errors.type}</p>
                )}
                <select
                  id={`challenge-type-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  value={challenge.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }
                >
                  <option value="">Choose a challenge type</option>
                  <option value="SELECT">Select</option>
                  <option value="CARD">Card</option>
                  <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm mt-2 font-medium text-slate-700"
                  htmlFor={`challenge-question-${index}`}
                >
                  Question
                </label>
                {challenge?.errors?.question && (
                  <p className="text-red-500 text-md">*{challenge.errors.question}</p>
                )}
                <input
                  type="text"
                  id={`challenge-question-${index}`}
                  className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter challenge question"
                  value={challenge.question}
                  onChange={(e) =>
                    handleInputChange(index, "question", e.target.value)
                  }
                />
              </div>

              <Button
                id={`remove-challenge-button-${index}`}
                variant="destructive"
                // disabled={challenges.length <= 1}
                className="mt-4"
                onClick={() => handleRemoveChallenge(index)}
              >
                Remove Challenge
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
              disabled={challenges.length >= 50}
            >
              Add Challenge
            </Button>
            <Button variant="primary" disabled={isSubmitting} onClick={handleSubmit}>
              Update Challenges
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateChallengePage;
