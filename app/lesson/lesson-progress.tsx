"use client";
import { useState } from "react";
import { challenges } from "@/database/schema";

import { challengeContent } from "@/database/schema";
import { Header } from "./header";
import { Card } from "@/components/flashcard/Card";
import { ChallengeContent } from "./challenge-content";
import { Footer } from "./footer";
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

export const LessonProgress = ({ initialLessonId,
    initialLessonChallenges,
    initialPercentage,
    initialPatels,
    userSubscription
}: Props) => {
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

    const title = challenge.type === "SELECT" ? challenge.question : challenge.question;

    const onSelect = (id: number) => {
        if (status !== "UNANSWERED") return;
        setSelectedOption(id)
    }

    const onContinue = () => {
        if (status === "UNANSWERED") return;
        setActiveChallengeIndex(activeChallengeIndex + 1)
    }

    return (
        <>
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
                status={status}
                onCheck={onContinue}
            />
        </>
    )
}

