"use client";
import { useState, useTransition } from "react";
import { challenges } from "@/database/schema";

import { challengeContent } from "@/database/schema";
import { Header } from "./header";
import { Card } from "@/components/flashcard/card";
import { ChallengeContent } from "./challenge-content";
import { FinishScreen } from "./(finish-screen)/finish-screen";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reducePetals } from "@/actions/user-progress";
type Props = {
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeContent: (typeof challengeContent.$inferSelect)[];
    })[];
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
    const [percentage, setPercentage] = useState(initialPercentage);
    const [patels, setPatels] = useState(initialPatels);
    const [challenges] = useState(initialLessonChallenges)
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [status, setStatus] = useState<"CORRECT" | "INCORRECT" | "UNANSWERED">("UNANSWERED");
    const [activeChallengeIndex, setActiveChallengeIndex] = useState(() => {
        const unansweredChallenge = challenges.find((challenge) => !challenge.completed)
        return unansweredChallenge ? challenges.indexOf(unansweredChallenge) : 0
    })
    const challenge = challenges[activeChallengeIndex]
    const options = challenge && challenge.challengeContent

    const onNext = () => {
        setActiveChallengeIndex((current) => current + 1)
    }

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "INCORRECT") {
            setStatus("UNANSWERED")
            setSelectedOption(null)
            return;
        }

        if (status === "CORRECT") {
            onNext()
            setStatus("UNANSWERED")
            setSelectedOption(null)
            return;
        }

        const correctOption = options.find((option) => option.correct)

        if (!correctOption) return;

        // If the selected option is the correct option, set the status to CORRECT
        if (correctOption && correctOption?.id === selectedOption) {
            console.log("Correct option selected")
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.error("Not enough hearts")
                            return;
                        }
                        setStatus("CORRECT")
                        setPercentage((prev) => prev + 100 / challenges.length)

                        // If practice 
                        if (initialPercentage === 100) {
                            setPatels(Math.max(patels - 1, 5))
                        }
                    }).catch((error) => {
                        toast.error("Error upserting challenge progress")
                        console.error("Error upserting challenge progress", error)
                    })
            })
        } else {
            startTransition(() => {
                reducePetals(challenge.id)
                    .then((response) => {
                        if (response?.error === "patels") {
                            // openHeartsModal();
                            return
                        }

                        setStatus("INCORRECT");

                        // incorrectControl.play();
                        if (!response?.error) {
                            setPatels((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch((error) => {
                        toast.error("Error reducing hearts")
                        console.error("Error reducing hearts", error)
                    })
            })
        }
    }


    // If there are no challenges, show the finish screen
    if (true || !challenge) {
        return (
            <FinishScreen
                percentage={percentage}
                patels={patels}
                hasActiveSubscription={userSubscription ? true : false}
            />
        )
    }


    const onSelect = (id: number) => {
        if (status !== "UNANSWERED") return;
        setSelectedOption(id)
    }

    const title = challenge.type === "SELECT" ? challenge.question : challenge.question;

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                patels={patels}
                percentage={percentage}
                hasActiveSubscription={userSubscription ? true : false}
            />

            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[800px] md:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-2xl mt-12 text-center font-bold lg:text-start text-sky-900">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "CARD" && (
                                <Card />
                            )}
                            {challenge.type === "SELECT" && (
                                <ChallengeContent
                                    contents={challenge.challengeContent}
                                    status={status}
                                    selectedOption={selectedOption}
                                    disabled={false}
                                    type={challenge.type}
                                    onSelect={onSelect}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={!selectedOption || pending}
                status={status}
                onCheck={onContinue}
            />
        </div>
    )
}

