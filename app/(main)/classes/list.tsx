"use client"

import * as React from "react"
import { classEnrollments, classes, userProgress } from "@/database/schema"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { motion, useMotionValue, useSpring } from "framer-motion"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { upsertUserProgress } from "@/actions/user-progress"

type Props = {
    classes: typeof classes.$inferSelect[];
    activeClassId?: typeof userProgress.$inferSelect["activeClassId"];
    userEnrollments?: typeof classEnrollments.$inferSelect[];
}

const List = ({ classes, activeClassId, userEnrollments }: Props) => {
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
    const tooltipX = useSpring(mouseX, springConfig)
    const tooltipY = useSpring(mouseY, springConfig)
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left - 90)
        mouseY.set(e.clientY - rect.top - 15)
    }

    return (
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {classes.map((currentClass, index) => (
                <div key={index}
                    onClick={() => onClick(currentClass.id)}
                    onMouseMove={currentClass.id === activeClassId ? handleMouseMove : undefined}
                    onMouseEnter={() => currentClass.id === activeClassId && setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={cn(
                        "relative h-full border-2 hover:bg-sky-500/5 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-[217px] min-w-[400px] rounded-md hover:from-sky-200 hover:via-blue-200 hover:to-sky-300 hover:border-sky-400 transition-all duration-300 shadow-inner shadow-white/50 overflow-hidden group [&>*]:relative [&>*]:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                        currentClass.id === activeClassId ? "border-sky-500 bg-sky-500/10" : "border-slate-200",
                        isEnrolled(currentClass.id) ? "border-sky-500" : "",
                        isPending && "opacity-50 cursor-not-allowed"
                    )}>
                    {currentClass.id === activeClassId && isHovering && (
                        <motion.div
                            className="pointer-events-none absolute z-100 bg-sky-500 text-white text-lg px-3 py-1 rounded-[20px] rounded-tr-none shadow-lg max-w-[250px] break-words"
                            style={{
                                x: tooltipX,
                                y: tooltipY,
                                transform: 'translate(-50%, -50%)'
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <div className="relative">
                                <p className="text-sm">Class you're currently studying</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Rest of your existing card content */}
                    <div className="min-h-[10px] w-full flex items-center justify-end">
                        {currentClass.id === activeClassId && (
                            <Check className="text-sky-500 stroke-[4] h-7 w-7" />
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
            ))}
        </div>
    )
}


export default List;