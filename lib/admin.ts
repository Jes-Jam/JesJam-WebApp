import { auth } from "@clerk/nextjs/server";

const allowedUsers = [
    "user_2nxzFxikuSZJgD5yHAfDY5Sx9dN"
];

export const getIsAdmin = async () => {
    const { userId } = await auth();
    
    if(!userId) {
        return false;
    }

    return allowedUsers.includes(userId);
}