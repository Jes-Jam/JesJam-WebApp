import StickyContainer from "@/components/StickyContainer";
import StudyContainer from "@/components/StudyContainer";
import Header from "./header";
import StudentStates from "@/components/StudentStates";
import { userProgress } from "@/database/schema";
import { getUserProgress, getChapters } from "@/database/queries";
import { redirect } from "next/navigation";
import { Chapter } from "./Chapter";

const StudyPage = async () => {
    const userProgress = await getUserProgress();
    const chapters = await getChapters();


    // If user doesn't have active class
    if (!userProgress || !userProgress.activeClass) {
        redirect("/classes")
    }


    return (
        <div className="flex flex-row gap-[50px]">
            <StudyContainer>
                <Header title={userProgress.activeClass?.title ?? 'Undefined Title'} />
                <div className="mb-4">
                    {chapters.map((chapter) => {
                        return (
                            <div key={chapter.id}>
                                <Chapter
                                    id={chapter.id}
                                    title={chapter.title}
                                    description={chapter.description ?? ''}
                                    order={chapter.order}
                                    lessons={chapter.lessons}
                                    activeLesson={undefined}
                                    activeLessonPercentage={0}
                                />
                            </div>
                        )
                    })}
                </div>
            </StudyContainer>
            <StickyContainer>
                <StudentStates activeCourse={userProgress.activeClass}
                    petals={userProgress.patels}
                    points={userProgress.points}
                    isPremium={false} />
            </StickyContainer>
        </div>
    )
}

export default StudyPage
