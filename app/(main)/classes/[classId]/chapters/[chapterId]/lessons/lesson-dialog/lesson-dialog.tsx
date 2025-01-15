"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";

interface Lesson {
    id: number;
    title: string;
    description: string | null;
    order: number;
}

interface LessonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    classId: string;
    chapterId: string;
    lesson?: Lesson;
    onSuccess?: () => void;
}

export default function LessonDialog({
    isOpen,
    onClose,
    classId,
    chapterId,
    lesson,
    onSuccess
}: LessonDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Populate form when editing existing lesson
    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setDescription(lesson.description || "");
        } else {
            // Reset form when adding new lesson
            setTitle("");
            setDescription("");
        }
    }, [lesson, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            if (lesson) {
                // Update existing lesson
                await axios.patch(`/api/user-classes/${classId}/user-chapters/${chapterId}/user-lessons/${lesson.id}`, {
                    title,
                    description
                });
                toast.success("Lesson updated successfully");
            } else {
                // Create new lesson
                await axios.post(`/api/user-classes/${classId}/user-chapters/${chapterId}/user-lessons`, {
                    title,
                    description
                });
                toast.success("Lesson created successfully");
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(lesson ? "Failed to update lesson" : "Failed to create lesson");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!lesson) return;

        try {
            setIsDeleting(true);
            await axios.delete(`/api/user-classes/${classId}/user-chapters/${chapterId}/user-lessons/${lesson.id}`);
            toast.success("Lesson deleted successfully");
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Failed to delete lesson");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {lesson ? "Edit Lesson" : "Add New Lesson"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Lesson Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading || isDeleting}
                        required
                    />
                    <Textarea
                        placeholder="Lesson Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading || isDeleting}
                    />
                    <DialogFooter className="flex justify-between items-center gap-2">
                        {lesson && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isLoading || isDeleting}
                                className="flex items-center gap-2"
                            >
                                <Trash className="h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete Lesson"}
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={isLoading || isDeleting}
                            className={lesson ? "" : "w-full"}
                        >
                            {isLoading
                                ? (lesson ? "Updating..." : "Creating...")
                                : (lesson ? "Update Lesson" : "Create Lesson")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}