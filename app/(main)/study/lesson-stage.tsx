"use client"

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";



type Props = {
    id: number;
    index: number;
    totalLessons: number;
    activeLessonPercentage: number;
    isLocked: boolean;
    currentLesson: boolean;
    isSelected?: boolean;
    title: string;
    description: string;
}

export const LessonStage = ({ id,
    totalLessons,
    isLocked,
    currentLesson,
    activeLessonPercentage,
    index,
    isSelected,
    title,
    description
}: Props) => {
    // console.log(`Active lesson percentage: ${activeLessonPercentage}`);


    console.log(`currentLesson: ${currentLesson}`);

    // Constants for spacing
    const HORIZONTAL_SPACING = 520;  // Space between lessons horizontally
    const VERTICAL_SPACING = 200;    // Space between rows
    const BUTTON_WIDTH = 140;

    // Calculate row and position in row
    const row = Math.floor(index / 2);
    const positionInRow = index % 2;
    const isLastInRow = positionInRow === 1;
    const isLast = index === totalLessons;


    // Calculate positions
    const xPosition = positionInRow * HORIZONTAL_SPACING;
    const yPosition = row * VERTICAL_SPACING;


    // const isLast = index === totalLessons;
    const isCompleted = !currentLesson && !isLocked;
    // const Icon = isCompleted ? Check : isLast ? Crown : Star;
    const href = isCompleted ? `/lesson/${id}` : `/lesson`;

    return (
        <Link
            href={href}
            key={id}
            aria-disabled={isLocked}
            className={`absolute ${(isSelected && !currentLesson) ? 'z-10' : ''}`}
            style={{
                left: `${xPosition}px`,
                top: `${yPosition}px`,
                pointerEvents: isLocked ? "none" : "auto"
            }}
        >
            <div className={`relative ${(isSelected && !currentLesson) ? 'before:absolute before:inset-[-8px] before:border-4 before:border-sky-500 before:rounded-xl before:animate-pulse' : ''
                }`}>

                {/* Text for first button in row (above, left-aligned) */}
                {positionInRow === 0 && (
                    <div className="absolute bottom-full left-0 mb-4 w-[300px] text-left">
                        <div className="bg-[#E7F4FD] rounded-2xl border-2 border-sky-500 py-2 px-4 shadow-sm relative">
                            <h3 className="font-semibold text-sky-500 mb-1">{title}</h3>
                            <p className="text-sm text-gray-600">{description}</p>
                            {/* Triangle pointer */}
                            <div className="absolute -bottom-2 left-16 border-b-2 border-r-2 border-sky-500 w-4 h-4 bg-[#E7F4FD] transform rotate-45" />
                        </div>
                    </div>
                )}
                {/* Text for second button in row (below, right-aligned) */}
                {positionInRow === 1 && (
                    <div className="absolute top-full right-0 mt-4 w-[300px] text-right">
                        <div className="bg-[#E7F4FD] rounded-2xl border-2 border-sky-500 py-2 px-4 shadow-sm relative">
                            <h3 className="font-semibold text-sky-500 mb-1">{title}</h3>
                            <p className="text-sm text-gray-600">{description}</p>
                            {/* Triangle pointer */}
                            <div className="absolute -top-2 right-16 border-t-2 border-l-2 border-sky-500 w-4 h-4 bg-[#E7F4FD] transform rotate-45" />
                        </div>
                    </div>
                )}

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
                            className="h-[70px] w-[140px] flex items-center justify-center rounded-xl"
                        >
                            {/* <Icon className={cn(
                                "h-10 w-10",
                                isLocked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                    : "fill-primary-foreground text-primary-foreground",
                                isCompleted && "fill-none stroke-4"
                            )} /> */}
                            <h1 className="text-4xl font-bold">{index + 1}</h1>
                        </Button>
                        {/* </CircularProgressbarWithChildren> */}
                    </div>
                ) : (
                    <Button
                        size="lg"
                        variant={isLocked ? "locked" : "primary"}
                        className={cn(
                            "h-[70px] w-[140px] border-2 border-b-8 flex items-center justify-center rounded-xl my-6",
                            isLocked && "border-neutral-400",
                            isCompleted && "border-sky-600"
                        )}
                    >
                        {/* <Icon className={cn(
                            "h-10 w-10",
                            isLocked ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                                : "fill-primary-foreground text-primary-foreground",
                            isCompleted && "fill-none stroke-4"
                        )} /> */}
                        <h1 className="text-4xl font-bold">{index + 1}</h1>
                    </Button>

                )}

                {/* Connecting line (only if not last in row and not last lesson) */}
                {!isLastInRow && !isLast && (
                    <div
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{
                            left: `${BUTTON_WIDTH}px`,
                            height: '6px',
                            width: `${HORIZONTAL_SPACING - BUTTON_WIDTH}px`,
                            background: 'linear-gradient(90deg, rgb(14 165 233), rgb(125 211 252), rgb(14 165 233))', // sky-500 to sky-300 to sky-500
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 right-0 animate-shine"
                            style={{
                                height: '2px',
                                background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))',
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px'
                            }}
                        />
                    </div>
                )}

                {/* Curved line for row transition */}
                {/* {isLastInRow && !isLast && (
                    <svg
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{
                            left: `${BUTTON_WIDTH}px`,
                            width: `${HORIZONTAL_SPACING - BUTTON_WIDTH}px`,
                            height: `${VERTICAL_SPACING}px`
                        }}
                    >
                        <path
                            d={`M 0,0 C ${HORIZONTAL_SPACING / 4},0 ${HORIZONTAL_SPACING / 2},${VERTICAL_SPACING} ${HORIZONTAL_SPACING - BUTTON_WIDTH},${VERTICAL_SPACING}`}
                            stroke="#E2E8F0"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                )} */}
            </div>
        </Link>
    )
}