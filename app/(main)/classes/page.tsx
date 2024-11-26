// "use client"

import List from "./list";
import { getClasses, getUserProgress, getEnrollments } from "@/database/queries";

const ClassPage = async () => {

    const classes = await getClasses();
    const userProgress = await getUserProgress();
    const userEnrollments = await getEnrollments();


    return (
        <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
            <h1 className="text-2xl font-bold text-sky-500">Available Classes</h1>
            {/* List of classes */}
            <List classes={classes} activeClassId={userProgress?.activeClassId} userEnrollments={userEnrollments} />
        </div>
    );
}

export default ClassPage