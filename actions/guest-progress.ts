"use server";

import { guestProgressService } from "@/lib/services/guest-progress";
import { getClassById } from "@/database/queries";
import { redirect } from "next/navigation";

export const handleGuestProgress = async (classId: number) => {
    const data = await getClassById(classId);


    if (!data || !data.isPreviewAvailable) {
        throw new Error("Class not available");
    }

    redirect('/study');
}