"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Plus, Pencil, Trash, Trophy, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LessonModal } from "./lesson-modal"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Challenges } from "./challenges"

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
    const router = useRouter()
    const searchParams = useSearchParams()

    const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null)
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

    // Load saved state on initial render
    useEffect(() => {
        const savedClassId = localStorage.getItem('selectedClassId')
        const savedChapterId = localStorage.getItem('selectedChapterId')
        const classIdFromUrl = searchParams.get('classId')
        const chapterIdFromUrl = searchParams.get('chapterId')

        // Priority: URL params > localStorage > null
        const classId = classIdFromUrl || savedClassId
        const chapterId = chapterIdFromUrl || savedChapterId

        if (classId) {
            setSelectedClassId(Number(classId))
            localStorage.setItem('selectedClassId', classId)
        }

        if (chapterId) {
            setSelectedChapterId(Number(chapterId))
            localStorage.setItem('selectedChapterId', chapterId)
        }
    }, [searchParams])

    // Update URL and localStorage when selections change
    const handleClassChange = (classId: number | null) => {
        setSelectedClassId(classId)
        setSelectedChapterId(null)
        setSelectedLesson(null)

        if (classId) {
            localStorage.setItem('selectedClassId', String(classId))
            localStorage.removeItem('selectedChapterId')
            router.push(`/admin/lessons?classId=${classId}`)
        } else {
            localStorage.removeItem('selectedClassId')
            localStorage.removeItem('selectedChapterId')
            router.push('/admin/lessons')
        }
    }

    const handleChapterChange = (chapterId: number | null) => {
        setSelectedChapterId(chapterId)
        setSelectedLesson(null)

        if (chapterId && selectedClassId) {
            localStorage.setItem('selectedChapterId', String(chapterId))
            router.push(`/admin/lessons?classId=${selectedClassId}&chapterId=${chapterId}`)
        } else {
            localStorage.removeItem('selectedChapterId')
            if (selectedClassId) {
                router.push(`/admin/lessons?classId=${selectedClassId}`)
            }
        }
    }

    const [classes, setClasses] = useState<Class[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
    const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null)

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

    const handleEdit = (lesson: Lesson) => {
        setEditingLesson(lesson)
        setShowModal(true)
    }

    const handleDelete = async (lessonId: number) => {
        try {
            await axios.delete(`/api/classes/${selectedClassId}/chapters/${selectedChapterId}/lessons/${lessonId}`)
            toast.success("Lesson deleted successfully")
            fetchLessons()
        } catch (error) {
            toast.error("Failed to delete lesson")
        } finally {
            setDeletingLessonId(null)
        }
    }

    const handleManageChallenges = (lesson: Lesson) => {
        setSelectedLesson(lesson)
    }

    const handleBackToLessons = () => {
        setSelectedLesson(null)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Class Selection Dropdown */}
                {!selectedLesson && (
                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className="text-sm font-medium">Select Class</label>
                            <Select
                                value={selectedClassId?.toString() || ""}
                                onValueChange={(value) => handleClassChange(value ? Number(value) : null)}
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
                                                            onClick={() => handleChapterChange(chapter.id)}
                                                            variant="premiumOutline"
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
                    </div>
                )}

                {/* Lessons Table */}
                {selectedChapterId && !selectedLesson && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="space-y-2">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                onClick={() => handleChapterChange(null)}
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
                            <Button onClick={() => setShowModal(true)}>
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
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Challenges</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {lessons?.map((lesson: Lesson) => (
                                        <tr key={lesson.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{lesson.order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="truncate max-w-[200px]" title={lesson.title || ""}>
                                                    {lesson.title}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="truncate max-w-[200px]" title={lesson.description || ""}>
                                                    {lesson.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <Button
                                                    variant="primaryOutline"
                                                    onClick={() => handleManageChallenges(lesson)}
                                                    className="px-4 py-2 text-sm"
                                                >
                                                    <Trophy className="h-4 w-4 mr-2" />
                                                    Manage Challenges
                                                </Button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingLessonId(lesson.id)}
                                                            className="text-red-500 focus:text-red-500"
                                                        >
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {lessons?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No lessons found. Create your first lesson!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Challenges Component */}
                {selectedLesson && (
                    <Challenges
                        lesson={selectedLesson}
                        chapter={chapters.find(c => c.id === selectedChapterId)}
                        onBack={handleBackToLessons}
                    />
                )}
            </div>
            {selectedChapterId && (
                <>
                    <LessonModal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false)
                            setEditingLesson(null)
                        }}
                        onSuccess={() => {
                            fetchLessons()
                            setEditingLesson(null)
                        }}
                        classId={selectedClassId!}
                        chapterId={selectedChapterId}
                        initialData={editingLesson}
                    />
                    <AlertDialog
                        open={!!deletingLessonId}
                        onOpenChange={() => setDeletingLessonId(null)}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the lesson
                                    and all of its contents.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deletingLessonId && handleDelete(deletingLessonId)}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </div>
    )
}
