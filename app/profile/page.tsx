import { UserInfoCard } from "./user-info";
import { ExamCountdown } from "./exam-countdown";
import { EnrolledCourses } from "./enroll-courses";
import { getEnrollments, getUserProgress, } from "@/database/queries";
import { redirect } from "next/navigation";


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
            <div className="h-10"></div>
        </div>
    )
}

export default ProfilePage