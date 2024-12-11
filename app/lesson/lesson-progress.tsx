"use client";
import { useState } from "react";
import { challenges } from "@/database/schema";

import { challengeContent } from "@/database/schema";
import { Header } from "./header";
import { Card } from "@/components/flashcard/Card";
import { ChallengeContent } from "./challenge-content";
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

    const title = initialLessonChallenges[0].type === "SELECT" ? "Select the correct meaning" : initialLessonChallenges[0].question;

    console.log(initialLessonChallenges[0].challengeContent)


    return (
        <>
            <Header
                patels={patels}
                percentage={percentage}
                hasActiveSubscription={userSubscription ? true : false}
            />

            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-2xl mt-12 text-center font-bold lg:text-start text-sky-900">
                            {title}
                        </h1>
                        <div>
                            {initialLessonChallenges[0].type === "CARD" && (
                                <Card />
                            )}

                            <ChallengeContent
                                contents={initialLessonChallenges[0].challengeContent}
                                status="CORRECT"
                                selectedOption={null}
                                disabled={false}
                                type={initialLessonChallenges[0].type}
                                onSelect={() => { }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

