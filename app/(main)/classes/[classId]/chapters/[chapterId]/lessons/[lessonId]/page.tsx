"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageIcon, Minus, Copy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Loading from "./loading";
import { Card } from "@/components/ui/card";

interface Lesson {
    id: number;
    title: string;
    description: string | null;
    order: number;
    chapterId: number;
}

interface Chapter {
    id: number;
    title: string;
    class: {
        id: number;
        title: string;
    };
}

interface FlashCard {
    id: number;
    term: string;
    definition: string;
    imageUrl?: string;
}

export default function LessonPage({
    params
}: {
    params: {
        classId: string;
        chapterId: string;
        lessonId: string
    }
}) {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [flashcards, setFlashcards] = useState<FlashCard[]>([
        { id: 1, term: "", definition: "" }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonResponse] = await Promise.all([
                    axios.get(`/api/user-classes/${params.classId}/user-chapters/${params.chapterId}/user-lessons/${params.lessonId}`),
                ]);

                setLesson(lessonResponse.data);
            } catch (err: any) {
                setError(err.message || "Failed to load lesson");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.classId, params.chapterId, params.lessonId]);

    const addNewCard = () => {
        const newId = flashcards.length > 0
            ? Math.max(...flashcards.map(card => card.id)) + 1
            : 1;

        setFlashcards([...flashcards, {
            id: newId,
            term: "",
            definition: ""
        }]);
    };

    const updateCard = (id: number, field: 'term' | 'definition', value: string) => {
        setFlashcards(cards =>
            cards.map(card =>
                card.id === id
                    ? { ...card, [field]: value }
                    : card
            )
        );
    };

    const removeCard = (id: number) => {
        if (flashcards.length > 1) {
            setFlashcards(cards => cards.filter(card => card.id !== id));
        }
    };

    const duplicateCard = (id: number) => {
        const cardToDuplicate = flashcards.find(card => card.id === id);
        if (cardToDuplicate) {
            const newId = Math.max(...flashcards.map(card => card.id)) + 1;
            setFlashcards([...flashcards, {
                ...cardToDuplicate,
                id: newId
            }]);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-center text-red-500 text-lg font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-[900px] mx-auto mt-10">

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-sky-500">{lesson?.title}</h1>
                    {lesson?.description && (
                        <p className="text-gray-500 mt-2">{lesson.description}</p>
                    )}
                </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-6">
                <div className="rounded-lg border-2 border-sky-200 p-6">
                    <h2 className="text-xl font-semibold mb-6 text-sky-500">Flashcards</h2>
                    <div className="space-y-8">
                        {flashcards.map((card) => (
                            <div key={card.id} className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg text-gray-500">{card.id}</span>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => removeCard(card.id)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => duplicateCard(card.id)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Card className="p-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-500">
                                                TERM
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter term"
                                                value={card.term}
                                                onChange={(e) => updateCard(card.id, 'term', e.target.value)}
                                                className="w-full p-2 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-500">
                                                DEFINITION
                                            </label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Enter the Definition"
                                                    value={card.definition}
                                                    onChange={(e) => updateCard(card.id, 'definition', e.target.value)}
                                                    className="w-full p-2 border-b border-gray-200 focus:outline-none focus:border-gray-400"
                                                />
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="flex items-center gap-2"
                                                >
                                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <Button
                        className="w-full mt-6 border-sky-200"
                        variant="primaryOutline"
                        onClick={addNewCard}
                    >
                        + Add Card
                    </Button>
                </div>

                <div className="flex items-center justify-end">
                    <Link href={`/classes/${params.classId}/chapters/${params.chapterId}`} className="-ml-2">
                        <Button
                            className="border-sky-200 mr-3"
                            variant="primaryOutline"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        className="border-sky-200"
                        variant="primary"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div >
    );
}
