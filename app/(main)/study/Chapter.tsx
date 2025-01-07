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
    // Calculate the number of rows needed based on 3 items per row
    const numberOfRows = Math.ceil(lessons.length / 3);
    // Each row is 200px tall (from VERTICAL_SPACING in lesson-stage)
    const contentHeight = numberOfRows * 200;

    return (
        <div>
            <ChapterHeader title={title} description={description} />
            <div className="relative w-full p-10" style={{ height: contentHeight + 50 }}>
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
        </div>
    )
}