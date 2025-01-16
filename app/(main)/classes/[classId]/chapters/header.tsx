"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Globe2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
    title: string;
    classId: string;
}

export default function Header({ title, classId }: HeaderProps) {
    const [showRequestDialog, setShowRequestDialog] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [existingRequest, setExistingRequest] = useState<any>(null);


    useEffect(() => {
        const checkExistingRequest = async () => {
            try {
                const response = await axios.get(`/api/user-classes/${classId}/public-request`);
                setExistingRequest(response.data);
            } catch (error) {
                console.error("Failed to check existing request");
            }
        };

        checkExistingRequest();
    }, [classId]);


    const handlePublicRequest = async () => {
        try {
            setIsRequesting(true);
            await axios.post(`/api/user-classes/${classId}/public-request`);
            toast.success("Request sent successfully");
            setShowRequestDialog(false);
            // Refresh the request status
            const response = await axios.get(`/api/user-classes/${classId}/public-request`);
            setExistingRequest(response.data);
        } catch (error: any) {
            toast.error(error.response?.data || "Failed to send request");
        } finally {
            setIsRequesting(false);
        }
    };


    const getRequestStatus = () => {
        if (!existingRequest) return null;
        switch (existingRequest.status) {
            case "pending":
                return "Request Pending";
            case "approved":
                return "Public Access Granted";
            case "rejected":
                return "Request Rejected";
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/classes" className="-ml-2">
                        <ArrowLeft className="text-sky-500" size={24} strokeWidth={2} />
                    </Link>
                    <h1 className="text-3xl font-bold text-sky-500">{title}</h1>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Link href="#">
                            <Settings className="text-sky-500" size={24} strokeWidth={2} />
                        </Link>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setShowRequestDialog(true)}
                            className="flex items-center gap-2"
                            disabled={existingRequest?.status === "pending"}
                        >
                            <Globe2 className="h-4 w-4" />
                            {getRequestStatus() || "Request Public Access"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <AlertDialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-sky-500">Request Public Access</AlertDialogTitle>
                        <Separator className="my-4" />
                        <AlertDialogDescription>
                            This will send a request to the administrators to make your class publicly available.
                            <Separator className="my-4" />
                            Public classes can be viewed by anyone on the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRequesting} className="border border-sky-500 text-sky-500">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePublicRequest}
                            disabled={isRequesting}
                            className="bg-sky-500 border border-sky-500 hover:bg-sky-600 text-white"
                        >
                            {isRequesting ? "Sending Request..." : "Send Request"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}