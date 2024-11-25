import { chapters, lessons } from "@/database/schema";

type Props = {
    id: number;
    totalLessons: number;
    activeLesson: (typeof lessons.$inferSelect & {
        chapter: typeof chapters.$inferSelect;
    }) | undefined;
    activeLessonPercentage: number;
    isLocked: boolean;
    index: number;
}

export const LessonStage = ({ id, totalLessons, activeLesson, isLocked, activeLessonPercentage, index }: Props) => {
    return (
        <div></div>
    )
}