"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Challenge {
    id: number;
    type: string;
    content: {
        term?: string;
        definition?: string;
    };
}

interface Lesson {
    id: number;
    title: string;
    challenges: Challenge[];
}

interface PublicRequest {
    id: number;
    classId: number;
    status: "pending" | "approved" | "rejected";
    requestedAt: string;
    ownerId: string;
    class: {
        title: string;
        imageSrc: string;
    };
    owner: {
        user_name: string;
    };
}

export default function DashboardPage() {
    const [requests, setRequests] = useState<PublicRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [selectedClass, setSelectedClass] = useState<{ id: number; lessons: Lesson[] } | null>(null);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get("/api/admin/public-requests");
            setRequests(response.data);
        } catch (error) {
            toast.error("Failed to load requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestAction = async (requestId: number, action: "approve" | "reject") => {
        try {
            setProcessingId(requestId);
            const response = await axios.patch(`/api/admin/public-requests/${requestId}`, {
                action: action
            });

            if (response.data) {
                toast.success(`Request ${action}ed successfully`);
                fetchRequests(); // Refresh the list
            }
        } catch (error: any) {
            console.error("Error details:", error.response?.data);
            toast.error(error.response?.data?.error || `Failed to ${action} request`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleViewClass = async (classId: number) => {
        try {
            setIsLoadingLessons(true);
            const response = await axios.get(`/api/admin/classes/${classId}/lessons`);
            setSelectedClass({ id: classId, lessons: response.data });
        } catch (error) {
            toast.error("Failed to load class content");
        } finally {
            setIsLoadingLessons(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-sky-500">Public Access Requests</h1>
                <p className="text-gray-500">Manage requests for public class access</p>
            </div>

            <div className="space-y-4">
                {requests.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending requests</p>
                ) : (
                    requests.map((request) => (
                        <Card key={request.id} className="p-4 hover:border-sky-500 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {request.class.imageSrc && (
                                        <img
                                            src={request.class.imageSrc}
                                            alt={request.class.title}
                                            className="h-12 w-12 rounded-md object-cover"
                                        />
                                    )}
                                    <div>
                                        <button
                                            onClick={() => handleViewClass(request.classId)}
                                            className="font-semibold text-sky-500 text-xl hover:text-sky-600"
                                        >
                                            {request.class.title}
                                        </button>
                                        <p className="text-sm text-gray-500">
                                            Requested by: {request.owner.user_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(request.requestedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => handleRequestAction(request.id, "approve")}
                                        disabled={processingId === request.id}
                                        variant="primaryOutline"
                                        className="text-sky-500 hover:text-sky-600"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleRequestAction(request.id, "reject")}
                                        disabled={processingId === request.id}
                                        variant="destructive"
                                        className="text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-sky-500">Class Content Review</DialogTitle>
                    </DialogHeader>
                    {isLoadingLessons ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {selectedClass?.lessons.map((lesson) => (
                                <div key={lesson.id} className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-4 text-sky-500">{lesson.title}</h3>
                                    <div className="space-y-4">
                                        {lesson.challenges.map((challenge) => (
                                            <div key={challenge.id} className="pl-4 border-l-2">
                                                <p className="text-sm text-gray-500">{challenge.type}</p>
                                                {challenge.type === "CARD" && (
                                                    <div className="mt-2 space-y-2">
                                                        <p><span className="font-medium">Term:</span> {challenge.content.term}</p>
                                                        <p><span className="font-medium">Definition:</span> {challenge.content.definition}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}