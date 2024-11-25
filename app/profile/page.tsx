import { getEnrollments } from "@/database/queries";
import { UserInfoCard } from "./UserInfoCard";
import { ExamCountdown } from "./ExamCountdown";


const ProfilePage = async () => {
    const enrollments = await getEnrollments();
    return (
        <div className="h-full lg:max-w-[900px] sm:max-w-[600px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0 space-y-6">
            <UserInfoCard />
            <ExamCountdown />
        </div>
    )
}

export default ProfilePage