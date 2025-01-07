import { auth } from "@clerk/nextjs/server";

const allowedUsers = [
    process.env.ADMIN_USER_ID,
    process.env.ADMIN_USER_ID_2
];

export const getIsAdmin = async () => {
    const { userId } = await auth();
    
    if(!userId) {
        return false;
    }

    return allowedUsers.includes(userId);
}