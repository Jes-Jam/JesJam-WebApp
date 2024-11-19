import StickyContainer from "@/components/StickyContainer";
import StudyContainer from "@/components/StudyContainer";
import Header from "./header";
import StudentStates from "@/components/StudentStates";
import { userProgress } from "@/database/schema";
import { getUserProgress } from "@/database/queries";
import { redirect } from "next/navigation";

const StudyPage = async () => {
    const userProgress = await getUserProgress();
    console.log("Responses of user progress", userProgress)


    // If user doesn't have active class
    if (!userProgress || !userProgress.activeClass) {
        redirect("/classes")
    }


    return (
        <div className="flex flex-row gap-[50px]">
            <StudyContainer>
                <Header title={userProgress.activeClass?.title ?? 'Undefined Title'} />
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
