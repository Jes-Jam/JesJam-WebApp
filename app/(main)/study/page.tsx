import StickyContainer from "@/components/StickyContainer";
import StudyContainer from "@/components/StudyContainer";
import Header from "@/components/Header";
import StudentStates from "@/components/StudentStates";

const StudyPage = () => {
    return (
        <div className="flex flex-row pt-4 gap-[50px] px-6">
            <StudyContainer>
                <Header title="Biology" />
            </StudyContainer>
            <StickyContainer>
                <StudentStates activeCourse={{ imageSrc: "", title: "Biology" }} petals={10} points={100} isPremium={false} />
            </StickyContainer>
        </div>
    )
}

export default StudyPage
