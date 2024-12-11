"use client"

import * as React from "react"
import { classEnrollments, classes, userProgress } from "@/database/schema"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { motion, useMotionValue, useSpring } from "framer-motion"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { upsertUserProgress } from "@/actions/user-progress"
import { guestProgressService } from "@/lib/services/guest-progress"

type Props = {
    classes: typeof classes.$inferSelect[];
    activeClassId?: typeof userProgress.$inferSelect["activeClassId"];
    userEnrollments?: typeof classEnrollments.$inferSelect[];
    isGuest?: boolean;
}

const List = ({ classes, activeClassId, userEnrollments, isGuest = false }: Props) => {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [updatingClassId, setUpdatingClassId] = React.useState<number | null>(null)

    const isEnrolled = (classId: number) => {
        return userEnrollments?.some(enrollment => enrollment.classId === classId)
    }


    const onClick = (id: number) => {
        if (isPending) return;

        if (isGuest) {
            const classData = classes.find(c => c.id === id);
            if (!classData?.isPreviewAvailable) {
                //TODO: Show update prompt
                return;
            }

            guestProgressService.updateProgress({ activeClassId: id });
            startTransition(() => {
                upsertUserProgress(id, true)
                    .catch((err) => console.log(err))
                    .finally(() => setUpdatingClassId(null))
            })
            return;
        }

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
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {classes.map((currentClass, index) => (
                <div className="relative" key={index}>
                    {currentClass.id === activeClassId && isHoveringActive && (
                        <motion.div
                            className="pointer-events-none absolute z-100 -top-9 left-[53%] -translate-x-1/2 bg-sky-500 text-white text-sm px-3 py-1.5 rounded-[12px] shadow-sm text-nowrap break-words"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <div className="relative">
                                {/* Sharper message tail */}
                                <div className="absolute -bottom-[8px] right-[8px] w-4 h-4 bg-sky-500 transform rotate-45" />
                                {/* Message content */}
                                <p className="relative z-10">Class you're currently taking</p>
                            </div>
                        </motion.div>
                    )}
                    {isEnrolled(currentClass.id) && (currentClass.id !== activeClassId) && isHoveringEnrolled && (
                        <motion.div
                            className="pointer-events-none absolute z-100 -top-9 left-[60%] -translate-x-1/2 bg-sky-500 text-white text-sm px-3 py-1.5 rounded-[12px] shadow-sm whitespace-nowrap"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <div className="relative">
                                {/* Sharper message tail */}
                                <div className="absolute -bottom-[8px] right-[8px] w-4 h-4 bg-sky-500 transform rotate-45" />
                                {/* Message content */}
                                <p className="relative z-10">Class you're enrolled in</p>
                            </div>
                        </motion.div>
                    )}
                    <div
                        onClick={() => onClick(currentClass.id)}
                        onMouseEnter={() => {
                            currentClass.id === activeClassId && setIsHoveringActive(true);
                            isEnrolled(currentClass.id) && (currentClass.id !== activeClassId) && setIsHoveringEnrolled(true);
                        }}
                        onMouseLeave={() => {
                            setIsHoveringActive(false);
                            setIsHoveringEnrolled(false);
                        }}
                        className={cn(
                            "relative h-full border-2 hover:bg-sky-500/5 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-[217px] min-w-[400px] rounded-xl hover:from-sky-200 hover:via-blue-200 hover:to-sky-300 hover:border-sky-400 transition-all duration-300 shadow-inner shadow-white/50 overflow-hidden group [&>*]:relative [&>*]:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                            currentClass.id === activeClassId ? "border-sky-500 bg-sky-500/10" : "border-slate-200",
                            isEnrolled(currentClass.id) ? "border-sky-500" : "",
                            isPending && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {/* Checkmark and updating indicator */}
                        <div className="min-h-[10px] w-full flex items-center justify-end">
                            {currentClass.id === activeClassId && (
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
                                    <Check className="text-white stroke-[3] h-6 w-6" />
                                </div>
                            )}
                            {currentClass.id !== activeClassId && (
                                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex border-2 border-sky-500 items-center justify-center" />
                            )}
                            {updatingClassId === currentClass.id && (
                                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-sky-500"></div>
                            )}
                        </div>
                        <Image src={currentClass.imageSrc ?? ''} alt={currentClass.title ?? ''} height={70} width={93.3} />
                        <p className="text-sky-700 text-center font-bold mt-3">
                            {currentClass.title}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}


export default List;