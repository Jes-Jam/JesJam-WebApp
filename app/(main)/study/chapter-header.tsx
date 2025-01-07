"use client"
import { NotebookText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { lessons } from "@/database/schema"
import { useState } from "react"

type Props = {
    title: string;
    description: string;
    lessons: (typeof lessons.$inferSelect & {
        completed: boolean;
    })[];
    onLessonSelect: (lessonId: number | null) => void;
}

export const ChapterHeader = ({ title, description, lessons, onLessonSelect }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-[calc(100%-30px)] bg-white py-5 mx-10 flex items-center border-b-2 border-gray-200 justify-between">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-sky-500">{title}</h2>
                <p className="text-gray-500">{description}</p>
            </div>
            <Sheet open={isOpen} onOpenChange={(open) => {
                setIsOpen(open);
                // if (!open) onLessonSelect(null); // Clear selection when sheet closes
            }}>
                <SheetTrigger asChild>
                    <Button size="sm" variant="primaryOutline" className="text-center">
                        <NotebookText className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{title}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 space-y-4">
                        {lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className={`
                                    p-4 rounded-lg border ${lesson.completed
                                        ? "bg-sky-50 border-sky-200"
                                        : "bg-white border-gray-200"
                                    }
                                    cursor-pointer
                                    hover:bg-gray-50
                                `}
                                onClick={() => onLessonSelect(lesson.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.completed
                                        ? "bg-sky-500 text-white"
                                        : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{lesson.title}</h3>
                                        {lesson.completed && (
                                            <span className="text-sm text-sky-600">Completed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}