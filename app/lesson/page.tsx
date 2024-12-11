
const { getLesson, getUserProgress } = await import("@/database/queries");
import { redirect } from "next/navigation";
import { LessonProgress } from "./lesson-progress";

const LessonPage = async () => {
    const lesson = await getLesson();

    console.log(`Lesson: ${lesson}`);

    const userProgress = await getUserProgress();

    console.log(`User Progress: ${userProgress}`);

    if (!lesson || !userProgress) {
        redirect("/study");
    }

    const initialPercentage = lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length * 100;

    return (
        <div className="noise-background">
            <LessonProgress
                initialLessonId={lesson.id}
                initialLessonChallenges={lesson.challenges}
                initialPercentage={initialPercentage}
                initialPatels={userProgress.patels}
                userSubscription={null}
            />
        </div>
    )
}

export default LessonPage;