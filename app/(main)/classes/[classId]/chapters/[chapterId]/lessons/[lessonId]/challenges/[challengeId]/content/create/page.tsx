"use client";

import Header from "./header";
import { useEffect, useState } from "react";
import { challengeContent as ChallengesContents } from "@/database/schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getChallenges } from "@/database/challengeCrud";
import { createChallengeContents, hasChallengeContents } from "@/database/challengContentCrud";
import Loading from "./loading";

const CreateChallengePage = ({
  params,
}: {
  params: { classId: number; chapterId: number; lessonId: number, challengeId: number };
}) => {
  const { classId, chapterId, lessonId, challengeId } = params;
  const [ownedChallenge, setOwnedChallenge] = useState<typeof ChallengesContents.$inferSelect | null>(null);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [challengesContents, setChallengesContents] = useState([
    { text: "", correct: null, errors: { text: "", correct: "" } },
  ]);

  useEffect(() => {
    const checkChallengesContents = async () => {
      try {
        const ishasChallengeContents = await hasChallengeContents(classId, chapterId, lessonId, challengeId);
        if (ishasChallengeContents) {
          router.push(`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challengesContents/edit`);
        }
      } catch (err) {
        setError(err?.message);
      }
    };

    checkChallengesContents();
  }, [lessonId, router]);

  useEffect(() => {
    getChallenges(classId, chapterId, lessonId)
      .then((challengeData) => {
        if (challengeData) {
          setOwnedChallenge(challengeData);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [lessonId]);

  const handleAddChallenge = () => {
    setChallengesContents([
      ...challengesContents,
      { text: "", correct: null, errors: { text: "", correct: "" } },
    ]);
    setTimeout(() => {
      const lastChallenge = document.getElementById(`add-challenge-button`);
      lastChallenge?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleRemoveChallenge = (index: number) => {
    const newChallengesContents = [...challengesContents];
    newChallengesContents.splice(index, 1);
    setChallengesContents(newChallengesContents);
  };

  const handleInputChange = (index: number, field: string, value: string | boolean) => {
    const updatedChallengesContents = [...challengesContents];
    updatedChallengesContents[index][field] = value;
    updatedChallengesContents[index].errors[field] = "";
    setChallengesContents(updatedChallengesContents);
  };

  const validateChallenge = (challenge: {
    text: string;
    correct: boolean;
    errors: { text: string; correct: string };
  }) => {
    const error = { text: "", correct: "" };
    if (!challenge.text.trim()) error.text = "text is required";
    if (challenge.correct === null) error.correct = "content type status is required";

    if (challenge.text.length > 500)
      error.correct = "correct is too long (must be less than 500 characters)";
    return error;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();

    const updatedChallengesContents = challengesContents.map((challenge) => ({
      ...challenge,
      errors: validateChallenge(challenge),
    }));

    setChallengesContents(updatedChallengesContents);

    const hasError = updatedChallengesContents.some(
      (challenge) => challenge.errors.text || challenge.errors.correct
    );

    if (hasError) {
      setFormError("Please fill the form correctly");
      return;
    }

    const onlyOneContent = updatedChallengesContents.length === 1;

    if (onlyOneContent) {
      setFormError("Please add at least two content (one correct and one incorrect)");
      return;
    }

    const noCorrectContent = updatedChallengesContents.every((content) => !content.correct);

    if (noCorrectContent) {
      setFormError("Please add at least one correct content");
      return;
    }

    setIsSubmitting(true);

    createChallengeContents(classId, chapterId, lessonId, challengeId, updatedChallengesContents)
      .then(() => {
        router.push(`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}/challenges/${challengeId}`);
      })
      .catch((err) => {
        setFormError(err.message);
        console.log(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
      <Header
        path={`/classes/${classId}/chapters/${chapterId}/lessons/${lessonId}`}
        title="Create Challenge Contents"
      />
      {!error ? (
        !ownedChallenge ? (
          <Loading />
        ) : (
          <>
            <div className="text-center mt-5 text-slate-500">
              <p>You can create challenges Content for your lesson by filling the form below.</p>
              <p>You can only create at most 4 challenges contents for each lesson.</p>
            </div>
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
                      htmlFor={`challenge-text-${index}`}
                    >
                      Content type (correct or incorrect)
                    </label>

                    {challenge.errors.correct && (
                      <p className="text-red-500 text-md">*{challenge.errors.correct}</p>
                    )}

                    <select
                      id={`challenge-type-${index}`}
                      className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                      value={challenge.correct}

                      onChange={(e) => handleInputChange(index, "correct", e.target.value)}
                    >
                      <option value="">Choose content validaion</option>
                      <option value={true}>Correct</option>
                      <option value={false}>Incorrect</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="block text-sm mt-2 font-medium text-slate-700"
                      htmlFor={`challenge-correct-${index}`}
                    >
                      Text
                    </label>

                    {challenge.errors.text && (
                      <p className="text-red-500 text-md">* {challenge.errors.text}</p>
                    )}

                    <input
                      type="text"
                      id={`challenge-correct-${index}`}
                      className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Enter challenge correct"
                      value={challenge.text}
                      onChange={(e) => handleInputChange(index, "text", e.target.value)}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    disabled={challengesContents.length <= 1}
                    className="mt-4"
                    onClick={() => handleRemoveChallenge(index)}
                  >
                    Remove content
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
                  Submit
                </Button>
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

export default CreateChallengePage;