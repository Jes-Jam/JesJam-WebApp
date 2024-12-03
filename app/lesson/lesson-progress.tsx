"use client";
import { useState } from "react";
import { challenges } from "@/database/schema";

import { challengeAnswers } from "@/database/schema";
import { Header } from "./header";

type Props = {
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeAnswers: (typeof challengeAnswers.$inferSelect)[];
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

    return (
        <>
            <Header
                patels={patels}
                percentage={percentage}
                hasActiveSubscription={userSubscription ? true : false}
            />
        </>
    )
}

