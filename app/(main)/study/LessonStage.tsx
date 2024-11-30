"use client"

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Icon } from "lucide-react";
import { cn } from "@/lib/utils";



type Props = {
    id: number;
    index: number;
    totalLessons: number;
    activeLessonPercentage: number;
    isLocked: boolean;
    currentLesson: boolean;
}

export const LessonStage = ({ id, totalLessons, isLocked, currentLesson, activeLessonPercentage, index }: Props) => {

    // Constants for spacing
    const HORIZONTAL_SPACING = 250;  // Space between lessons horizontally
    const VERTICAL_SPACING = 200;    // Space between rows

    // Calculate row and position in row
    const row = Math.floor(index / 3);
    const positionInRow = index % 3;

    // Calculate positions
    const xPosition = positionInRow * HORIZONTAL_SPACING;
    const yPosition = row * VERTICAL_SPACING;

    const isFirst = index === 0;
    const isLast = index === totalLessons;
    const isCompleted = !currentLesson && !isLocked;
    const Icon = isCompleted ? Check : isLast ? Crown : Star;
    const href = isCompleted ? `/lesson/${id}` : `/lesson`;

    return (
        <Link
            href={href}
            key={id}
            aria-disabled={isLocked}
            className="absolute"
            style={{
                left: `${xPosition}px`,
                top: `${yPosition}px`,
                pointerEvents: isLocked ? "none" : "auto"
            }}
        >
            <div className="relative">

                {/* Your existing button/progress code */}
                {currentLesson ? (
                    <div className="w-[120px] h-[120px] relative py-6">
                        <div className="absolute -top-6 left-8 px-3 py-2.5 font-bold uppercase text-sky-500 bg-white rounded-xl animate-bounce tracking-wide z-50">
                            START
                            <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
                        </div>
                        {/* <CircularProgressbarWithChildren
                            value={Number.isNaN(activeLessonPercentage) ? 0 : activeLessonPercentage}
                            styles={{
                                path: { stroke: "#17A9EB" },
                                trail: { stroke: "#17A9EB" }
                            }}
                        > */}
                        <Button
                            size="lg"
                            variant={isLocked ? "locked" : "activeLesson"}
                            className="h-[70px] w-[140px] border-b-8 flex items-center justify-center rounded-xl"
                        >
                            <Icon className={cn(
                                "h-10 w-10",
                                isLocked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                    : "fill-primary-foreground text-primary-foreground",
                                isCompleted && "fill-none stroke-4"
                            )} />
                        </Button>
                        {/* </CircularProgressbarWithChildren> */}
                    </div>
                ) : (
                    <Button
                        size="lg"
                        variant={isLocked ? "locked" : "secondary"}
                        className="h-[70px] w-[140px] border-b-8 flex items-center justify-center rounded-xl my-6"
                    >
                        <Icon className={cn(
                            "h-10 w-10",
                            isLocked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                : "fill-primary-foreground text-primary-foreground",
                            isCompleted && "fill-none stroke-4"
                        )} />
                    </Button>
                )}
            </div>
        </Link>
    )
}