import StickyContainer from "@/components/main/sticky-container";
import StudyContainer from "@/components/main/study-container";
import StudentStates from "@/components/main/student-state";
import ShareProgress from "./share-progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RedirectWrapper } from "@/components/redirect-no-class-wrapper";
import Podium from "./podium";

import {
    getUserProgress,
    getTopStudents
} from "@/database/queries";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
const LeaderboardPage = async () => {
    const userProgress = await getUserProgress();
    const topStudents = await getTopStudents();

    // If user doesn't have active class
    if (!userProgress || !userProgress.activeClass) {
        return <RedirectWrapper />
    }

    if (!topStudents) {
        return <div>No students found</div>
    }



    return (
        <div className="flex flex-row gap-[50px]">
            <StudyContainer>
                <div className="flex flex-col w-full">
                    <div className="px-6">
                        <h1 className="text-2xl font-bold text-sky-500 my-1">You and your peers 🎓</h1>
                        <p className="text-muted-foreground text-left text-lg mb-6">See how you stack up against the rest of the community</p>
                    </div>
                    <div className="w-full max-w-3xl px-6">
                        <Separator className="mb-6 h-0.5" />
                        {topStudents.map((student, index) => {
                            const isCurrentUser = student.userId === userProgress.userId;
                            return (
                                <div key={student.userId} className={cn(
                                    "flex w-full flex-row items-center justify-between p-3 px-4 rounded-md",
                                    isCurrentUser ? "bg-sky-100" : "hover:bg-gray-200/50"
                                )}>
                                    <div className="flex flex-row items-center">
                                        {index < 3 && <Podium index={index} />}
                                        {index >= 3 && <p className="font-medium text-lg mr-2 ml-2 text-sky-500">{index + 1}. </p>}
                                        <Avatar className="w-10 h-10 mr-6 ml-3">
                                            <AvatarImage src={student.userImageSrc} />
                                            <AvatarFallback>{student.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p
                                            className={cn(
                                                "font-semibold text-lg mr-10 text-gray-400",
                                                isCurrentUser ? "text-sky-500" : "text-gray-400"
                                            )}
                                        >{student.userName}</p>
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <p
                                            className={cn(
                                                "font-medium text-lg text-gray-500/80",
                                                isCurrentUser ? "text-sky-500" : "text-gray-500/80"
                                            )}
                                        >{student.points} </p>
                                        <Image
                                            src="/icons/thunder.svg"
                                            alt="Star"
                                            width={20}
                                            height={20}
                                            className="ml-2"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </StudyContainer >
            <StickyContainer>
                <StudentStates activeCourse={userProgress.activeClass}
                    streakCount={userProgress.streakCount}
                    petals={userProgress.patels}
                    points={userProgress.points}
                    isPremium={false} />
                <ShareProgress />
            </StickyContainer>
        </div >
    )
}

export default LeaderboardPage;