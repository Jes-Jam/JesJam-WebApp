"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./header";
import Loading from "./loading";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Lesson {
    id: number;
    title: string;
    description: string | null;
    order: number;
}

interface Chapter {
    id: number;
    title: string;
    description: string | null;
    class: {
        id: number;
        title: string;
    };
}

export default function ChapterPage({ params }: { params: { classId: string, chapterId: string } }) {
    const { classId, chapterId } = params;
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chapterResponse, lessonsResponse] = await Promise.all([
                    axios.get(`/api/user-classes/${classId}/user-chapters/${chapterId}`),
                    axios.get(`/api/user-classes/${classId}/user-chapters/${chapterId}/user-lessons`)
                ]);

                setChapter(chapterResponse.data);

                console.log(chapterResponse.data);
                setLessons(lessonsResponse.data);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [classId, chapterId]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">
            <Header title="Lessons page" />

            <div className="flex justify-between items-center my-6">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/classes" className="font-bold">Classes</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/classes/${classId}`} className="text-sky-500">
                                    {chapter?.class.title}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/classes/${classId}/chapters`} className="font-bold">
                                    Chapters
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-sky-500">{chapter?.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="primaryOutline"
                        onClick={() => { }} // Add lesson modal handler here
                    >
                        Add lesson
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-500 mt-6">Lessons</h2>

                {!error && (lessons?.length ?? 0) === 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                            <p className="mb-4 font-lg">No lessons available for this chapter yet.</p>
                            <Button
                                variant="primaryOutline"
                                onClick={() => { }} // Add lesson modal handler here
                            >
                                Add lesson
                            </Button>
                        </div>
                    </div>
                )}

                {!error && lessons && lessons.length > 0 && (
                    <div className="grid gap-4">
                        {lessons.map((lesson) => (
                            <div key={lesson.id}>
                                <div className="block p-4 border-2 border-gray-300 rounded-lg hover:border-blue-200 hover:shadow transition duration-300 ease-in-out">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Link href={`/classes/${classId}/chapters/${chapterId}/lessons/${lesson.id}`}>
                                                <h3 className="text-xl font-semibold pb-3 text-sky-500 hover:text-sky-600">
                                                    {lesson.title}
                                                </h3>
                                            </Link>
                                            {lesson.description && (
                                                <p className="text-gray-500/90 text-sm">
                                                    {lesson.description}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Button
                                                variant="default"
                                                className="text-gray-500"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Add lesson edit handler here
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-center text-red-500 text-lg font-bold">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
