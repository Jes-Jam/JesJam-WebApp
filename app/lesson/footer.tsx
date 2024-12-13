

import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Props = {
    onCheck: () => void,
    status: "UNANSWERED" | "CORRECT" | "INCORRECT" | "COMPLETED",
    disabled?: boolean,
    lessonId?: boolean,

}

export const Footer = ({ onCheck, status, disabled, lessonId }: Props) => {
    useKey("Enter", onCheck, [onCheck]);
    const isMobile = useMedia("(max-width: 1024px)");

    return (
        <footer className={cn(
            "lg:-h[140px] h-[100px] border-t-2",
            status === "CORRECT" && "border-transparent bg-green-100",
            status === "INCORRECT" && "border-transparent bg-rose-100"
        )}>
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {status === "CORRECT" && (
                    <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
                        <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-2" />
                        You got it right!
                    </div>
                )}
                {status === "INCORRECT" && (
                    <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
                        <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-2" />
                        Try another one
                    </div>
                )}
                {status === "COMPLETED" && (
                    <Button
                        variant="default"
                        size={isMobile ? "sm" : "lg"}
                        onClick={() => window.location.href = `/learn/${lessonId}`}
                    >
                        Practice again
                    </Button>
                )}
                <Button
                    disabled={disabled}
                    className="ml-auto"
                    onClick={onCheck}
                    size={isMobile ? "sm" : "lg"}
                    variant={status === "UNANSWERED" ? "default" : status === "CORRECT" ? "secondary" : status === "INCORRECT" ? "destructive" : "primary"}
                >
                    {status === "UNANSWERED" && "Check"}
                    {status === "CORRECT" && "Next"}
                    {status === "INCORRECT" && "Retry"}
                    {status === "COMPLETED" && "Continue"}
                </Button>
            </div>
        </footer>
    )
}