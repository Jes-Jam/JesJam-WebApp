"use client"

import * as React from "react"
import { classEnrollments, classes, userProgress } from "@/database/schema"
import { useMotionValue } from "framer-motion"
import ClassCard from "@/components/ui/class-card"
import { useRouter } from "next/navigation"
import { upsertUserProgress } from "@/actions/user-progress"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"

type Props = {
    classes: typeof classes.$inferSelect[];
    activeClassId?: typeof userProgress.$inferSelect["activeClassId"];
    userEnrollments?: typeof classEnrollments.$inferSelect[];
    isGuest?: boolean;
    isEdittable?: boolean;
}

const List = ({ classes, activeClassId, userEnrollments, isGuest = false, isEdittable }: Props) => {
    const router = useRouter();
    const [classList, setClassList] = useState(classes);
    const [isPending, startTransition] = React.useTransition();
    const [updatingClassId, setUpdatingClassId] = React.useState<number | null>(null)
    const isEnrolled = (classId: number) => {
        return userEnrollments?.some(enrollment => enrollment.classId === classId)
    }


    const onClick = (id: number) => {
        if (isPending) return;

        if (id === activeClassId) {
            return router.push(`/study`)
        }

        setUpdatingClassId(id);

        startTransition(() => {
            upsertUserProgress(id)
                .catch((err) => console.log(err))
                .finally(() => setUpdatingClassId(null))
        })
    }

    // Smooth spring animation for the tooltip
    const springConfig = { damping: 25, stiffness: 700 }
    // const tooltipX = useSpring(mouseX, springConfig)
    // const tooltipY = useSpring(mouseY, springConfig)
    const [isHoveringActive, setIsHoveringActive] = React.useState(false);
    const [isHoveringEnrolled, setIsHoveringEnrolled] = React.useState(false);

    // const handleMouseMove = (e: React.MouseEvent) => {
    //     const rect = e.currentTarget.getBoundingClientRect()
    //     mouseX.set(e.clientX - rect.left - 90)
    //     mouseY.set(e.clientY - rect.top - 15)
    // }

    const handleDelete = async (deletedClassId: number) => {
        try {
            alert(`Attempting to delete class ID: ${deletedClassId}`);

            // Validate ID before making request
            if (!deletedClassId || isNaN(Number(deletedClassId))) {
                throw new Error("Invalid class ID");
            }

            // Make sure the URL is correctly formatted
            const url = `/api/user-classes/${deletedClassId}`;
            alert(`Making DELETE request to: ${url}`);

            const response = await axios.delete(url);

            setClassList(prevClasses =>
                prevClasses.filter(classItem => classItem.id !== deletedClassId)
            );

            toast.success("Class deleted successfully");
            router.refresh();
        } catch (error: any) {
            // More detailed error alert 
            alert(`Error details:
                ID: ${deletedClassId}
                Status: ${error.response?.status}
                Response: ${JSON.stringify(error.response?.data)}
                Message: ${error.message}
            `);

            const errorMessage = error.response?.data?.error ||
                error.response?.data ||
                error.message ||
                "Failed to delete class";

            toast.error(errorMessage);
        }
    };

    return (
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {classList.map((currentClass, index) => (
                <ClassCard
                    key={index}
                    currentClass={currentClass}
                    isPending={isPending}
                    updatingClassId={updatingClassId}
                    isEnrolled={isEnrolled}
                    onClick={onClick}
                    isHoveringActive={isHoveringActive}
                    isHoveringEnrolled={isHoveringEnrolled}
                    activeClassId={activeClassId}
                    setIsHoveringActive={setIsHoveringActive}
                    setIsHoveringEnrolled={setIsHoveringEnrolled}
                    isEdittable={isEdittable}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}


export default List;