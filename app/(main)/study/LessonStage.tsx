import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown } from "lucide-react";
import { div } from "framer-motion/client";



type Props = {
    id: number;
    index: number;
    totalLessons: number;
    activeLessonPercentage: number;
    isLocked: boolean;
    currentLesson: boolean;
}

export const LessonStage = ({ id, totalLessons, isLocked, currentLesson, activeLessonPercentage, index }: Props) => {

    const cycleLength = 8;
    const cycleIndex = index % cycleLength;

    let indentationLevel;

    if (cycleIndex <= 2) {
        indentationLevel = cycleIndex;
    } else if (cycleIndex === 4) {
        indentationLevel = 4 - cycleIndex;
    } else if (cycleIndex <= 6) {
        indentationLevel = 4 - cycleIndex;
    } else {
        indentationLevel = cycleIndex - 8;
    }

    const rightPosition = indentationLevel * 40;
    const isFirst = index === 0;
    const isLast = index === totalLessons;
    const isCompleted = !currentLesson && !isLocked;

    const Icon = isCompleted ? Check : isLast ? Crown : Star;

    const href = isCompleted ? `/lesson/${id}` : `/lesson`

    return (
        <div>

        </div>
    )
}