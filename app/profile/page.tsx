import { getEnrollments } from "@/database/queries";
import { UserInfoCard } from "./UserInfoCard";


const ProfilePage = async () => {
    const enrollments = await getEnrollments();
    return (
        <div className="h-full p-6 space-y-6">
            <UserInfoCard />
        </div>
    )
}

export default ProfilePage