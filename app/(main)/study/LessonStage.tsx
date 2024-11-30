"use client"

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown } from "lucide-react";
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

    // const cycleLength = 8;
    // const cycleIndex = index % cycleLength;

    // let indentationLevel;

    // if (cycleIndex <= 2) {
    //     indentationLevel = cycleIndex;
    // } else if (cycleIndex === 4) {
    //     indentationLevel = 4 - cycleIndex;
    // } else if (cycleIndex <= 6) {
    //     indentationLevel = 4 - cycleIndex;
    // } else {
    //     indentationLevel = cycleIndex - 8;
    // }

    // const rightPosition = indentationLevel * 40;
    // const isFirst = index === 0;
    // const isLast = index === totalLessons;
    // const isCompleted = !currentLesson && !isLocked;
    // const Icon = isCompleted ? Check : isLast ? Crown : Star;

    // const href = isCompleted ? `/lesson/${id}` : `/lesson`


    // "S" layout like 
    const VERTICAL_SPACING = 160;
    const HORIZONTAL_INDENT = 40;

    // Calculate if we're on an even or odd lesson
    const isEvenLesson = index % 2 === 0;
    // Calculate horizontal position (creates zigzag effect)
    const xPosition = isEvenLesson ? 0 : HORIZONTAL_INDENT;
    // Calculate vertical position
    const yPosition = index * VERTICAL_SPACING;

    return (
        <Link
            href={href}
            key={id}
            aria-disabled={isLocked}
            style={{
                pointerEvents: isLocked ? "none" : "auto"
            }}
        >
            <div className="relative" style={{ right: `${rightPosition}px`, marginTop: isFirst && !isCompleted ? 60 : 24 }}>
                {currentLesson ? (
                    <div className="w-[120px] h-[120px] relative">
                        <div className="absolute -top-6 left-2.5 px-3 py-2.5 font-bold uppercase text-sky-500 bg-white rounded-xl animate-bounce tracking-wide z-50">
                            Start
                            <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
                        </div>
                        <CircularProgressbarWithChildren
                            value={Number.isNaN(activeLessonPercentage) ? 0
                                : activeLessonPercentage}

                            styles={{
                                path: {
                                    stroke: "#17A9EB",
                                },
                                trail: {
                                    stroke: "#17A9EB",
                                }
                            }}>
                            <Button
                                size="lg"
                                variant={isLocked ? "locked" : "primary"}
                                className="h-[90px] w-[90px] border-b-8 flex items-center justify-center rounded-full"
                            >
                                <Icon className={cn(
                                    "h-10 w-10", isLocked
                                    ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                    : "fill-primary-foreground text-primary-foreground",
                                    isCompleted && "fill-none stroke-4"
                                )} />
                            </Button>
                        </CircularProgressbarWithChildren>
                    </div>
                ) : (
                    <Button
                        size="lg"
                        variant={isLocked ? "locked" : "secondary"}
                        className="h-[90px] w-[90px] border-b-8 flex items-center justify-center rounded-full"
                    >
                        <Icon className={cn(
                            "h-10 w-10", isLocked
                            ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                            : "fill-primary-foreground text-primary-foreground",
                            isCompleted && "fill-none stroke-4"
                        )} />
                    </Button>
                )}
            </div>
        </Link>
    )
}