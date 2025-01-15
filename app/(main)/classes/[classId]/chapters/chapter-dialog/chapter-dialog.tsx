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

interface Chapter {
    id: number;
    title: string;
    description: string | null;
}

interface ChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    classId: number;
    onSuccess?: () => void;
    chapter?: Chapter;
}

export default function ChapterModal({
    isOpen,
    onClose,
    classId,
    onSuccess,
    chapter
}: ChapterModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (chapter) {
            setTitle(chapter.title);
            setDescription(chapter.description || "");
        } else {
            setTitle("");
            setDescription("");
        }
    }, [chapter]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            if (chapter) {
                await axios.patch(`/api/user-classes/${classId}/user-chapters/${chapter.id}`, {
                    title,
                    description
                });
                toast.success("Chapter updated successfully");
            } else {
                await axios.post(`/api/user-classes/${classId}/user-chapters`, {
                    title,
                    description
                });
                toast.success("Chapter created successfully");
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(chapter ? "Failed to update chapter" : "Failed to create chapter");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!chapter) return;

        try {
            setIsDeleting(true);
            await axios.delete(`/api/user-classes/${classId}/user-chapters/${chapter.id}`);
            toast.success("Chapter deleted successfully");
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Failed to delete chapter");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {chapter ? "Edit Chapter" : "Add New Chapter"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Chapter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading || isDeleting}
                        required
                    />
                    <Textarea
                        placeholder="Chapter Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading || isDeleting}
                    />
                    <DialogFooter className="flex justify-between items-center gap-2">
                        {chapter && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isLoading || isDeleting}
                                className="flex items-center gap-2"
                            >
                                <Trash className="h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete Chapter"}
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={isLoading || isDeleting}
                            className={chapter ? "" : "w-full"}
                        >
                            {isLoading
                                ? (chapter ? "Updating..." : "Creating...")
                                : (chapter ? "Update Chapter" : "Create Chapter")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
