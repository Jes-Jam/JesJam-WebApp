"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Plus, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Lesson {
    id: number
    title: string
    description: string | null
    order: number
    chapterId: number
}

interface Class {
    id: number;
    title: string;
}

interface Chapter {
    id: number;
    title: string;
    description: string | null;
    order: number;
}

export default function LessonPage() {
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null)

    const { data: classes } = useQuery({
        queryKey: ["classes"],
        queryFn: async () => {
            const response = await axios.get("/api/classes")
            return response.data
        }
    })

    const { data: chapters } = useQuery({
        queryKey: ["chapters", selectedClassId],
        queryFn: async () => {
            if (!selectedClassId) return []
            const response = await axios.get(`/api/classes/${selectedClassId}/chapters`)
            return response.data
        },
        enabled: !!selectedClassId
    })

    const { data: lessons } = useQuery({
        queryKey: ["lessons", selectedChapterId],
        queryFn: async () => {
            if (!selectedChapterId) return []
            const response = await axios.get(`/api/classes/${selectedClassId}/chapters/${selectedChapterId}/lessons`)
            return response.data
        },
        enabled: !!selectedChapterId
    })

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Class Selection Dropdown */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium">Select Class</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => {
                            setSelectedClassId(Number(e.target.value))
                            setSelectedChapterId(null)
                        }}
                        value={selectedClassId || ""}
                    >
                        <option value="">Select a class...</option>
                        {classes?.map((class_: Class) => (
                            <option key={class_.id} value={class_.id}>
                                {class_.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chapters Table */}
                {selectedClassId && !selectedChapterId && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Chapters</h2>
                        <div className="rounded-md border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {chapters?.map((chapter: Chapter) => (
                                        <tr key={chapter.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{chapter.order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{chapter.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{chapter.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Button
                                                    onClick={() => setSelectedChapterId(chapter.id)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md"
                                                >
                                                    Manage Lessons
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {chapters?.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No chapters found in this class.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Lessons Table */}
                {selectedChapterId && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="space-y-1">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedChapterId(null)}
                                    className="p-0 text-sky-500 hover:text-sky-600"
                                >
                                    ← Back to Chapters
                                </Button>
                                <h2 className="text-2xl font-bold">Lessons</h2>
                            </div>
                            <Button onClick={() => { }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Lesson
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {lessons?.map((lesson: Lesson) => (
                                        <tr key={lesson.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{lesson.order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{lesson.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{lesson.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => { }}
                                                    className="mr-2"
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => { }}
                                                    className="text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {lessons?.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No lessons found. Create your first lesson!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
