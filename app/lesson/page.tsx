
const { getLesson, getUserProgress } = await import("@/database/queries");
import { redirect } from "next/navigation";
import { LessonProgress } from "./lesson-progress";
import { useEffect } from "react";

const LessonPage = async () => {
    const lesson = await getLesson();
    const userProgress = await getUserProgress();

    console.log(`User Progress: ${userProgress}`);

    if (!lesson || !userProgress) {
        redirect("/study");
    }

    const initialPercentage = lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length * 100;

    return (
        <>
            <LessonProgress
                initialLessonId={lesson.id}
                initialLessonChallenges={lesson.challenges}
                initialPercentage={initialPercentage}
                initialPatels={userProgress.patels}
                userSubscription={null}
            />
        </>
    )
}

export default LessonPage;