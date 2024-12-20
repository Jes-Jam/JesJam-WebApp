import StickyContainer from "@/components/main/sticky-container";
import StudyContainer from "@/components/main/study-container";
import StudentStates from "@/components/main/student-state";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";


import {
    getUserProgress,
    getTopStudents
} from "@/database/queries";
import { redirect } from "next/navigation";

const LeaderboardPage = async () => {
    const userProgress = await getUserProgress();

    // If user doesn't have active class
    if (!userProgress || !userProgress.activeClass) {
        redirect("/classes")
    }

    // Get top students
    const topStudents = await getTopStudents();

    if (!topStudents) {
        return <div>No students found</div>
    }

    return (
        <div className="flex flex-row gap-[50px]">
            <StudyContainer>
                <div className="flex flex-col w-full items-center justify-center">
                    <Image src="/images/mascot.svg" alt="Leaderboard" width={100} height={100} />
                    <h1 className="text-2xl font-bold text-sky-800 my-6">Leaderboard</h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">See how you stack up against the rest of the community</p>
                    <div className="w-full max-w-3xl px-6">
                        <Separator className="mb-6 h-0.5" />
                        {topStudents.map((student, index) => {
                            return (
                                <div key={student.userId} className="flex w-full flex-row items-center justify-between p-2 px-4 rounded-xl hover:bg-gray-200/50">
                                    <div className="flex flex-row items-center">
                                        <p className="font-bold text-lg mr-4 text-sky-800">{index + 1}. </p>
                                        <Avatar className="w-10 h-10 mr-6 ml-3">
                                            <AvatarImage src={student.userImageSrc} />
                                            <AvatarFallback>{student.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-bold text-lg mr-10 text-sky-800">{student.userName}</p>
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <p className="font-muted-foreground text-lg text-sky-800/50">{student.points} points</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </StudyContainer >
            <StickyContainer>
                <StudentStates activeCourse={userProgress.activeClass}
                    petals={userProgress.patels}
                    points={userProgress.points}
                    isPremium={false} />
            </StickyContainer>
        </div >
    )
}

export default LeaderboardPage;