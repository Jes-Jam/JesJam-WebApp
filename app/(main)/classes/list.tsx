"use client"

import * as React from "react"
import { classEnrollments, classes, userProgress } from "@/database/schema"
import { useMotionValue } from "framer-motion"
import ClassCard from "@/components/ui/classCard"

import { useRouter } from "next/navigation"
import { upsertUserProgress } from "@/actions/user-progress"

type Props = {
    classes: typeof classes.$inferSelect[];
    activeClassId?: typeof userProgress.$inferSelect["activeClassId"];
    userEnrollments?: typeof classEnrollments.$inferSelect[];
    isGuest?: boolean;
    isEdittable?: boolean;
}

const List = ({ classes, activeClassId, userEnrollments, isGuest = false, isEdittable }: Props) => {
    const router = useRouter();
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

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

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

    return (
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {classes.map((currentClass, index) => (
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
                />
            ))}
        </div>
    )
}


export default List;