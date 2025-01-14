"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    classId: number;
    onSuccess?: () => void;
}

export default function AddChapterModal({
    isOpen,
    onClose,
    classId,
    onSuccess
}: AddChapterModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await axios.post(`/api/user-classes/${classId}/user-chapters`, {
                title,
                description
            });
            toast.success("Chapter created successfully");
            onSuccess?.();
            onClose();
            setTitle("");
            setDescription("");
        } catch (error) {
            toast.error("Failed to create chapter");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Chapter</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Chapter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <Textarea
                        placeholder="Chapter Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Creating..." : "Create Chapter"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
