import { UserInfoCard } from "./UserInfoCard";
import { ExamCountdown } from "./ExamCountdown";
import { EnrolledCourses } from "./EnrolledCourses";


const ProfilePage = async () => {
    return (
        <div className="h-full mb-10 lg:max-w-[900px] sm:max-w-[600px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0 space-y-10">
            <div className="grid lg:grid-cols-1 md:grid-cols-1 gap-6">
                <UserInfoCard />
                <ExamCountdown />
            </div>
            <EnrolledCourses />
        </div>
    )
}

export default ProfilePage