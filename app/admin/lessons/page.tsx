"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Loading from "./loading"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"

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
    const [classes, setClasses] = useState<Class[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch classes on mount
    useEffect(() => {
        fetchClasses()
    }, [])

    // Fetch chapters when class is selected
    useEffect(() => {
        if (selectedClassId) {
            fetchChapters()
        }
    }, [selectedClassId])

    // Fetch lessons when chapter is selected
    useEffect(() => {
        if (selectedChapterId) {
            fetchLessons()
        }
    }, [selectedChapterId])

    const fetchClasses = async () => {
        try {
            const response = await axios.get("/api/classes")
            setClasses(response.data)
            // Set default selected class
            if (response.data.length > 0) {
                setSelectedClassId(response.data[0].id)
            }
        } catch (error) {
            toast.error("Failed to fetch classes")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchChapters = async () => {
        try {
            const response = await axios.get(`/api/classes/${selectedClassId}/chapters`)
            setChapters(response.data)
        } catch (error) {
            toast.error("Failed to fetch chapters")
        }
    }

    const fetchLessons = async () => {
        try {
            const response = await axios.get(`/api/classes/${selectedClassId}/chapters/${selectedChapterId}/lessons`)
            setLessons(response.data)
        } catch (error) {
            toast.error("Failed to fetch lessons")
        }
    }

    const handleDeleteLesson = async (lessonId: number) => {
        try {
            await axios.delete(`/api/classes/${selectedClassId}/chapters/${selectedChapterId}/lessons/${lessonId}`)
            toast.success("Lesson deleted successfully")
            fetchLessons() // Refresh lessons
        } catch (error) {
            toast.error("Failed to delete lesson")
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Class Selection Dropdown */}
                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium">Select Class</label>
                    <Select
                        value={selectedClassId?.toString() || ""}
                        onValueChange={(value) => {
                            setSelectedClassId(Number(value))
                            setSelectedChapterId(null)
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class..." />
                        </SelectTrigger>
                        <SelectContent>
                            {classes?.map((class_: Class) => (
                                <SelectItem
                                    key={class_.id}
                                    value={class_.id.toString()}
                                >
                                    {class_.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                                                    variant="primaryOutline"
                                                    className="px-4 py-2 text-sm font-medium text-sky-500 rounded-md"
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
                            <div className="space-y-2">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                onClick={() => setSelectedChapterId(null)}
                                                className="text-sm text-muted-foreground hover:text-sky-500 cursor-pointer"
                                            >
                                                Chapters
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {chapters?.find((chapter: Chapter) => chapter.id === selectedChapterId)?.title || "Lessons"}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
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
                                                    onClick={() => handleDeleteLesson(lesson.id)}
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
