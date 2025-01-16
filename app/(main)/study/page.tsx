import StickyContainer from "@/components/main/sticky-container";
import StudyContainer from "@/components/main/study-container";
import Header from "./header";
import StudentStates from "@/components/main/student-state";
import { CurrentClass } from "@/app/(main)/study/current-class";
import { getUserProgress, getChapters, getCurrentLatestLesson, getLessonPercentage } from "@/database/queries";
import { Chapter } from "./chapter";
import { RedirectWrapper } from "@/components/redirect-no-class-wrapper";

const StudyPage = async () => {
    const userProgress = await getUserProgress();
    const activeLatestLesson = await getCurrentLatestLesson();
    const lessonPercentage = await getLessonPercentage();
    const chapters = await getChapters();

    if (!chapters) {
        console.log("Debug: No chapters found");
    }

    // If user doesn't have active class
    if (!userProgress || !userProgress.activeClass) {
        return <RedirectWrapper />
    }

    return (
        <>
            <div className="flex flex-row gap-[50px]">
                <StudyContainer>
                    <Header title={userProgress.activeClass?.title ?? 'Undefined Title'} />
                    {chapters.map((chapter) => (
                        <Chapter
                            key={chapter.id}
                            id={chapter.id}
                            title={chapter.title}
                            description={chapter.description ?? ''}
                            order={chapter.order}
                            lessons={chapter.lessons}
                            activeLesson={activeLatestLesson?.activeLesson}
                            activeLessonPercentage={lessonPercentage ?? 0}
                        />
                    ))}
                </StudyContainer>
                <StickyContainer>
                    <StudentStates
                        activeCourse={userProgress.activeClass}
                        streakCount={userProgress.streakCount}
                        petals={userProgress.patels}
                        points={userProgress.points}
                        isPremium={false}
                    />
                    <CurrentClass classes={userProgress.activeClass} />
                </StickyContainer>
            </div>
        </>
    )
}

export default StudyPage
