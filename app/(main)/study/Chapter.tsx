import { chapters, lessons } from "@/database/schema";
import { ChapterHeader } from "./chapter-header";
import { LessonStage } from "./lesson-stage";

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
    return (
        <>
            <ChapterHeader title={title} description={description} />
            {/* Single container for all lessons */}
            <div className="relative w-full min-h-[calc(100vh-100px)] p-10">
                <div className="relative mx-auto">
                    {lessons.map((lesson, index) => {
                        const isCurrentLesson = lesson.id === activeLesson?.id;
                        const isLockedLesson = !isCurrentLesson && !lesson.completed;

                        return (
                            <LessonStage
                                key={lesson.id}
                                id={lesson.id}
                                index={index}
                                totalLessons={lessons.length - 1}
                                currentLesson={isCurrentLesson}
                                isLocked={isLockedLesson}
                                activeLessonPercentage={activeLessonPercentage}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}