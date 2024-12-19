// "use client"

import List from "./list";
import AddClassButton from "./add-class-button";

import { getClasses, getUserProgress, getEnrollments } from "@/database/queries";
import { getCustomClasses } from "@/database/classCrud";

const ClassPage = async () => {

    const classes = await getClasses();
    const userProgress = await getUserProgress();
    const userEnrollments = await getEnrollments();
    const customClasses = await getCustomClasses();


    return (
        <div className=" w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0 pb-[100px]">
            <h1 className="text-2xl font-bold text-sky-500">
                Classes by{" "}
                <span className="italic font-semibold relative bg-gradient-to-r from-amber-300/90 via-yellow-200 to-amber-200 text-amber-800 inline-block bg-clip-text text-transparent">
                    JesJam team
                    <span className="text-amber-900">{"   "}💎</span>
                    {/* Light signing effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/40 to-transparent animate-shine overflow-hidden"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
                        }}
                    />
                </span>
            </h1>
            {/* List of classes */}
            <List classes={classes} activeClassId={userProgress?.activeClassId} userEnrollments={userEnrollments} />
            <h1 className="text-2xl font-bold text-sky-500 my-10">Your Custom Classes 👨‍🎓</h1>
            <div className="flex justify-end w-full">
                <AddClassButton />
            </div>
            {/* List of custom classes */}
            <List classes={customClasses ?? []} activeClassId={userProgress?.activeClassId} userEnrollments={userEnrollments} isEdittable={true} />
        </div >
    );
}

export default ClassPage