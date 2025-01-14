"use client"

import { chapters, lessons } from "@/database/schema";
import { ChapterHeader } from "./chapter-header";
import { LessonStage } from "./lesson-stage";
import { useState } from "react";

type Props = {
    id: number;
    title: string;
    description: string;
    order: number;
    lessons: (typeof lessons.$inferSelect & {
        completed: boolean;
    })[];
    activeLesson: (typeof lessons.$inferSelect & {
        chapter: typeof chapters.$inferSelect;
    }) | undefined;
    activeLessonPercentage: number;
}

export const Chapter = ({ id, title, description, order, lessons, activeLesson, activeLessonPercentage }: Props) => {
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

    // Calculate the number of rows needed based on 2 items per row
    const numberOfRows = Math.ceil(lessons.length / 2);

    // Calculate height with extra space for last row 
    const regularRowHeight = 150;
    const lastRowHeight = 200;
    const contentHeight = ((numberOfRows - 1) * regularRowHeight) + lastRowHeight;

    return (
        <div className="mb-20">
            <ChapterHeader
                title={title}
                description={description}
                lessons={lessons}
                onLessonSelect={setSelectedLessonId}
            />
            <div className="relative w-full p-10" style={{ height: contentHeight + 20 }}>
                <div className="relative mx-auto">
                    {lessons.map((lesson, index) => {
                        const isCurrentLesson = lesson.id === activeLesson?.id;
                        const isLockedLesson = !isCurrentLesson && !lesson.completed;
                        const isSelected = lesson.id === selectedLessonId;

                        return (
                            <LessonStage
                                key={lesson.id}
                                id={lesson.id}
                                index={index}
                                totalLessons={lessons.length - 1}
                                currentLesson={isCurrentLesson}
                                isLocked={isLockedLesson}
                                activeLessonPercentage={activeLessonPercentage}
                                isSelected={isSelected}
                                title={lesson.title}
                                description={lesson.description ?? ''}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}