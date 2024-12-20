
const { getLesson, getUserProgress } = await import("@/database/queries");
import { redirect } from "next/navigation";
import { LessonProgress } from "../lesson-progress";

type Props = {
    params: {
        lessonId: number;
    }
}

const LessonPage = async ({ params }: Props) => {
    const lesson = await getLesson(params.lessonId);
    const userProgress = await getUserProgress();

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