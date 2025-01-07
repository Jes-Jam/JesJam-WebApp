"use client";

import { useState, useTransition } from "react";
import { Header } from "./header";
import { FinishScreen } from "./(finish-screen)/finish-screen";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reducePetals } from "@/actions/user-progress";
import { useEffect } from "react";
import { CardChallenge } from "./(challenge-type)/card-challenge";
import { SelectChallenge } from "./(challenge-type)/select-challenge";
import { AnswerBuildingChallenge } from "./(challenge-type)/answer-build-challenge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface Challenge {
    id: number;
    type: "CARD" | "SELECT" | "ANSWER_BUILDING";
    content: {
        term?: string;
        definition?: string;
        question?: string;
        options?: string[];
        correctAnswer?: string;
        shuffledParts?: string[];
    };
    completed: boolean;
}

interface Props {
    initialLessonId: number;
    initialLessonChallenges: Challenge[];
    initialPercentage: number;
    initialPatels: number;
    userSubscription: any;
}

export const LessonProgress = ({
    initialLessonId,
    initialLessonChallenges,
    initialPercentage,
    initialPatels,
    userSubscription
}: Props) => {
    const [pending, startTransition] = useTransition();
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [isPractice, setIsPractice] = useState(false);
    const [patels, setPatels] = useState(initialPatels);
    const [challenges] = useState(initialLessonChallenges);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [status, setStatus] = useState<"CORRECT" | "INCORRECT" | "UNANSWERED">("UNANSWERED");
    const [activeChallengeIndex, setActiveChallengeIndex] = useState(() => {
        const unansweredChallenge = challenges.find((challenge) => !challenge.completed);
        return unansweredChallenge ? challenges.indexOf(unansweredChallenge) : 0;
    });

    const challenge = challenges[activeChallengeIndex];

    useEffect(() => {
        if (initialPercentage === 100) {
            setIsPractice(true);
        }
    }, [initialPercentage]);

    const onNext = () => {
        setActiveChallengeIndex((current) => current + 1);
    };

    const onSelect = (value: number | string) => {
        if (status !== "UNANSWERED") return;
        setSelectedOption(typeof value === 'string' ? parseInt(value) || 0 : value);
    };

    const onContinue = () => {
        // Debug log to see what we're comparing
        console.log("Checking answer:", {
            type: challenge.type,
            selectedOption,
            selectedValue: challenge.content.options?.[selectedOption!],
            correctAnswer: challenge.content.correctAnswer,
            isEqual: challenge.content.options?.[selectedOption!] === challenge.content.correctAnswer
        });

        // For SELECT type, we need selectedOption (unless it's a CARD)
        if (selectedOption === null && challenge.type !== "CARD") {
            return;
        }

        // Handle previous states
        if (status === "INCORRECT") {
            setStatus("UNANSWERED");
            setSelectedOption(null);
            return;
        }

        if (status === "CORRECT") {
            onNext();
            setStatus("UNANSWERED");
            setSelectedOption(null);
            return;
        }

        const isCorrect = (() => {
            switch (challenge.type) {
                case "CARD":
                    return true;
                case "SELECT":
                    if (selectedOption === null || !challenge.content.options || !challenge.content.correctAnswer) {
                        console.log("Missing required data for SELECT challenge");
                        return false;
                    }
                    const selectedValue = challenge.content.options[selectedOption];
                    const isMatch = selectedValue === challenge.content.correctAnswer;
                    console.log("SELECT comparison:", { selectedValue, correctAnswer: challenge.content.correctAnswer, isMatch });
                    return isMatch;
                case "ANSWER_BUILDING":
                    return selectedOption?.toString() === challenge.content.correctAnswer;
                default:
                    return false;
            }
        })();

        console.log("Answer is:", isCorrect ? "CORRECT" : "INCORRECT");

        startTransition(() => {
            if (isCorrect) {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.error("Not enough petals");
                            return;
                        }
                        setStatus("CORRECT");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        if (isPractice) {
                            setPatels(Math.max(patels - 1, 5));
                        }
                    })
                    .catch(() => {
                        toast.error("Error saving progress");
                    });
            } else {
                reducePetals(challenge.id)
                    .then((response) => {
                        if (response?.error === "patels") {
                            return;
                        }
                        setStatus("INCORRECT");
                        if (!response?.error) {
                            setPatels((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => {
                        toast.error("Error reducing petals");
                    });
            }
        });
    };

    if (!challenge) {
        return (
            <FinishScreen
                percentage={percentage}
                patels={patels}
                hasActiveSubscription={!!userSubscription}
            />
        );
    }

    const renderChallenge = () => {
        switch (challenge.type) {
            case "CARD":
                return (
                    <CardChallenge
                        challenge={challenge}
                        onSelect={onSelect}
                        status={status}
                    />
                );
            case "SELECT":
                return (
                    <SelectChallenge
                        challenge={challenge}
                        selectedOption={selectedOption}
                        onSelect={onSelect}
                        status={status}
                    />
                );
            case "ANSWER_BUILDING":
                return (
                    <AnswerBuildingChallenge
                        challenge={challenge}
                        onSelect={onSelect}
                        status={status}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                patels={patels}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription}
            />
            <div className="flex-1 relative">
                {isPractice && (
                    <div className="absolute -top-16 left-8 z-10 hidden md:block lg:block">
                        <div className="relative animate-sway">
                            {/* Tag string */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 h-12 w-1 bg-amber-700/50" />
                            {/* Tag body */}
                            <div className="relative w-32 h-40">
                                <div className="absolute inset-0">
                                    <div className="bg-sky-500 w-full h-full clip-path-tag shadow-lg transform rotate-3 border-2 border-sky-500/50">
                                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white/50" />
                                        <div className="h-full flex flex-col items-center justify-center gap-2 pt-4">
                                            <svg
                                                className="w-8 h-8 text-white"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V4H6z" />
                                                <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
                                            </svg>
                                            <span className="text-lg font-medium text-white text-center text-wrap">You're practicing!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[800px] md:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-2xl mt-12 text-center font-bold lg:text-start text-sky-900">
                            {challenge.content.question || challenge.content.term}
                        </h1>
                        {renderChallenge()}
                    </div>
                </div>
            </div>
            <Footer
                disabled={
                    (challenge.type === "CARD" ? false : selectedOption === null) ||
                    pending
                }
                status={status}
                onCheck={onContinue}
            />
        </div>
    );
};

