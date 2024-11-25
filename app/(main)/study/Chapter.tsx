import { chapters, lessons } from "@/database/schema";
import { ChapterHeader } from "./ChapterHeader";
import { LessonStage } from "./LessonStage";

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
            <div className="flex items-center flex-col relative">
                {lessons.map((lesson, index) => {

                    const isCurrentLesson = lesson.id === activeLesson?.id;
                    const isLockedLesson = !isCurrentLesson && !lesson.completed;


                    return (
                        <LessonStage
                            id={lesson.id}
                            index={index}
                            key={lesson.id}
                            totalLessons={lessons.length - 1}
                            isLocked={isLockedLesson}
                            activeLesson={activeLesson}
                            activeLessonPercentage={activeLessonPercentage}
                        />
                    )
                })}
            </div>
        </>
    )
}