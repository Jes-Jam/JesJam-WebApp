"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps {
    term: string;
    definition: string;
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
}

export const Card = ({
    term,
    definition,
    status
}: CardProps) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div
            className="relative h-[300px] w-full cursor-pointer perspective-1000"
            onClick={handleFlip}
        >
            <AnimatePresence mode="wait">
                {!isFlipped ? (
                    <motion.div
                        key="front"
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -180 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "absolute inset-0 backface-hidden",
                            "flex flex-col items-center justify-center p-6",
                            "rounded-xl border-2 shadow-md",
                            status === "UNANSWERED" && "border-slate-200 bg-white",
                            status === "CORRECT" && "border-green-500 bg-green-50",
                            status === "INCORRECT" && "border-red-500 bg-red-50"
                        )}
                    >
                        <div className="text-sm text-muted-foreground mb-2">
                            TERM
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {term}
                        </div>
                        <div className="absolute bottom-4 text-sm text-muted-foreground">
                            Click to flip
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="back"
                        initial={{ rotateY: -180 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 180 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "absolute inset-0 backface-hidden",
                            "flex flex-col items-center justify-center p-6",
                            "rounded-xl border-2 shadow-md",
                            status === "UNANSWERED" && "border-slate-200 bg-white",
                            status === "CORRECT" && "border-green-500 bg-green-50",
                            status === "INCORRECT" && "border-red-500 bg-red-50"
                        )}
                    >
                        <div className="text-sm text-muted-foreground mb-2">
                            DEFINITION
                        </div>
                        <div className="text-xl text-center">
                            {definition}
                        </div>
                        <div className="absolute bottom-4 text-sm text-muted-foreground">
                            Click to flip
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}