"use client";

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { Plus, ArrowLeft, Trash, Pencil, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ChapterModal } from "@/app/admin/chapters/chapter-modal";
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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Class = {
    id: number;
    title: string;
    imageSrc: string;
    isPrivateClass: boolean;
    ownerId: string;
}

type Chapter = {
    id: number;
    classId: number;
    title: string;
    description: string | null;
    order: number;
}

const ChaptersPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize state from URL params
    const [selectedClassId, setSelectedClassId] = useState<number | null>(
        searchParams.get("classId") ? Number(searchParams.get("classId")) : null
    )
    const [classes, setClasses] = useState<Class[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
    const [deletingChapterId, setDeletingChapterId] = useState<number | null>(null)

    // Update URL when class selection changes
    const handleClassSelect = (classId: number | null) => {
        setSelectedClassId(classId)
        if (classId) {
            router.push(`/admin/chapters?classId=${classId}`)
        } else {
            router.push('/admin/chapters')
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    useEffect(() => {
        if (selectedClassId) {
            fetchChapters(selectedClassId)
        }
    }, [selectedClassId])

    const fetchClasses = async () => {
        try {
            const response = await axios.get("/api/classes")
            setClasses(response.data)
        } catch (error) {
            toast.error("Failed to fetch classes")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchChapters = async (classId: number) => {
        try {
            const response = await axios.get(`/api/classes/${classId}/chapters`)
            setChapters(response.data)
        } catch (error) {
            toast.error("Failed to fetch chapters")
        }
    }

    const handleEdit = (chapter: Chapter) => {
        setEditingChapter(chapter)
        setShowModal(true)
    }

    const handleDelete = async (chapterId: number) => {
        try {
            await axios.delete(`/api/classes/${selectedClassId}/chapters/${chapterId}`)
            toast.success("Chapter deleted successfully")
            fetchChapters(selectedClassId!)
        } catch (error) {
            toast.error("Failed to delete chapter")
        } finally {
            setDeletingChapterId(null)
        }
    }

    return (
        <div className="p-6">
            {selectedClassId && (
                <>
                    <ChapterModal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false)
                            setEditingChapter(null)
                        }}
                        onSuccess={() => {
                            fetchChapters(selectedClassId)
                            setEditingChapter(null)
                        }}
                        classId={selectedClassId}
                        initialData={editingChapter || null}
                    />
                    <AlertDialog
                        open={!!deletingChapterId}
                        onOpenChange={() => setDeletingChapterId(null)}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the chapter
                                    and all of its contents.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => deletingChapterId && handleDelete(deletingChapterId)}
                                    className="bg-rose-500 text-white"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}

            {!selectedClassId ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Select a Class</h2>
                    <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classes.map((class_) => (
                                    <tr
                                        key={class_.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-10 w-10 relative rounded-md overflow-hidden">
                                                <img
                                                    src={class_.imageSrc || "/placeholder.png"}
                                                    alt={class_.title}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {class_.title}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button
                                                onClick={() => handleClassSelect(class_.id)}
                                                variant="premiumOutline"
                                                className="px-4 py-2 text-sm"
                                            >
                                                Manage Chapters
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && classes.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No classes found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        onClick={() => handleClassSelect(null)}
                                        className="text-sm text-muted-foreground hover:text-sky-500 cursor-pointer"
                                    >
                                        Classes
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {classes.find(c => c.id === selectedClassId)?.title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="mb-4">
                            <Button onClick={() => setShowModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Chapter
                            </Button>
                        </div>
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
                                {chapters.map((chapter) => (
                                    <tr key={chapter.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{chapter.order}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{chapter.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{chapter.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleEdit(chapter)}
                                                className="mr-2"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setDeletingChapterId(chapter.id)}
                                                className="text-red-500 hover:bg-red-50"
                                            >
                                                <Trash className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && chapters.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center">
                                            No chapters found. Create your first chapter!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChaptersPage
