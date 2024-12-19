"use client"
import { useState, useEffect } from "react";
import { useModal } from "@/states/useModal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";


export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, onClose } = useModal();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to exit?</DialogTitle>
                    <DialogDescription>
                        You will lose your progress.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-row gap-x-2">
                        <Button
                            variant="primaryOutline"
                            onClick={onClose}
                            size="lg"
                        >Continue</Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                onClose();
                                router.push("/study");
                            }}
                            size="lg"
                        >Exit
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}