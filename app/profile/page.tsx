import { UserInfoCard } from "./user-info";
import { ExamCountdown } from "./exam-countdown";
import { EnrolledCourses } from "./enroll-courses";
import { getEnrollments, getUserProgress, } from "@/database/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { FlowerStore } from "./flower-store";
import { Separator } from "@/components/ui/separator";
const ProfilePage = async () => {
    const enrollments = await getEnrollments();
    const userProgress = await getUserProgress();

    if (!userProgress || !userProgress.activeClass) {
        redirect("/classes")
    }

    return (
        <div className="min-h-screen lg:max-w-[900px] sm:max-w-[600px] mx-auto pt-6 sm:px-4 md:px-4 lg:px-0 space-y-10">

            <div className="grid lg:grid-cols-1 md:grid-cols-1 gap-6">
                <UserInfoCard />
                <ExamCountdown />
            </div>
            <EnrolledCourses enrollments={enrollments} userProgress={userProgress ?? null} />
            <Separator />
            <div>
                <h1 className="text-2xl text-left font-bold text-sky-500 my-6">Help your flower grow</h1>
                <Image src={`/images/daisy-streak/daisy-${userProgress.patels}.svg`} alt="mascot" width={100} height={100} className="text-left" />
                <p className="text-muted-foreground text-left text-xl mb-6">
                    You have <span className="font-bold text-sky-500">{userProgress.patels}</span> petals left.
                </p>
            </div>
            <FlowerStore petals={userProgress.patels} points={userProgress.points} hasActiveSubscription={false} />
            <div className="h-10"></div>
        </div>
    )
}

export default ProfilePage