
import List from "./list";
import AddClassButton from "./add-class-button";

import {
  // getClasses,
  getAdminClasses,
  getUserProgress,
  getEnrollments,
} from "@/database/queries";
import { useState } from "react";
import { getCustomClasses } from "@/database/classCrud";

const ClassPage = async () => {
  // const classes = await getClasses();
  const adminClasses = await getAdminClasses();
  const userProgress = await getUserProgress();
  const userEnrollments = await getEnrollments();
  const customClasses = await getCustomClasses();

  const isJesJamClass = customClasses.some(
    (customClass) => customClass.isJesJamClass
  );

  const isPrivateClass = customClasses.some(
    (customClass) => customClass.isPrivateClass
  );



  return (
    <div className=" w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0 pb-[100px]">
      <h1 className="text-2xl font-bold text-sky-500">
        Classes by{" "}
        <span className="italic font-semibold relative bg-gradient-to-r from-amber-300/90 via-yellow-200 to-amber-200 text-amber-800 inline-block bg-clip-text text-transparent">
          JesJam team
          <span className="text-amber-900">{"   "}💎</span>
          {/* Light signing effect */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/40 to-transparent animate-shine overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black, transparent)",
            }}
          />
        </span>
      </h1>
      {/* List of classes */}
      <List
        classes={adminClasses}
        activeClassId={userProgress?.activeClassId}
        userEnrollments={userEnrollments}
        isJesJamClass={isJesJamClass}
        isPrivateClass={isPrivateClass}
      />
      <h1 className="text-2xl font-bold text-sky-500 my-10">
        Your Custom Classes 👨‍🎓
      </h1>
      {customClasses.length > 0 ? (
        <div className="flex flex-col items-end">
          <AddClassButton />
          <List
            classes={customClasses}
            activeClassId={userProgress?.activeClassId}
            userEnrollments={userEnrollments}
            isEdittable={true}
            isJesJamClass={isJesJamClass}
            isPrivateClass={isPrivateClass}
          />
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center flex-col">
          <p className="text-center text-muted-foreground text-lg font-bold">
            You haven't created any classes yet.
          </p>
          <AddClassButton />
        </div>
      )}
    </div>
  );
};

export default ClassPage;
