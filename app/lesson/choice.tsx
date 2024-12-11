import { cn } from "@/lib/utils";
import { div } from "framer-motion/client";
import Image from "next/image";
interface ChoiceProps {
    id: number;
    text: string;
    imageSrc: string | null;
    audioSrc: string | null;
    shortcut: string;
    selected: boolean;
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
    disabled: boolean;
    type: "SELECT" | "CARD" | "FILL_IN_THE_BLANK";
    onClick: () => void;
}

export const Choice = ({ id, text, imageSrc, audioSrc, shortcut, selected, status, disabled, type }: ChoiceProps) => {
    return (
        <div className={cn(
            "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-5 lg:p-6 cursor-pointer active:border-b-2",
            selected && "bg-black/5",
            status === "CORRECT" && selected && "border-b-green-500",
            status === "INCORRECT" && selected && "border-b-red-500",
            status === "UNANSWERED" && selected && "border-b-sky-900",
            type === "CARD" && "lg:p-6 w-full h-full"
        )}>
            {imageSrc && imageSrc.startsWith('/') && (
                <div className="relative mb-4 max-h-[200px] lg:max-h-[300px] overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={text}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className={cn(
                "flex items-center justify-between",
                type === "SELECT" && "flex-row-reverse",

            )}>
                {type === "SELECT" && (
                    <div />
                )}
                <p className={cn(
                    "text-neutral-600 text-sm lg:text-base",
                    selected && "text-sky-500",
                    selected && status === "CORRECT" && "text-green-500",
                    selected && status === "INCORRECT" && "text-rose-500",
                )}>
                    {text}
                </p>
                <div className={cn(
                    "lg:w-[30px] lg:h-[30px] w-[24px] h-[24px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
                    selected && "border-sky-300 text-sky-500",
                    selected && status === "CORRECT" && "border-green-500 text-green-500",
                    selected && status === "INCORRECT" && "border-rose-500text-rose-500",
                )}>
                    {shortcut}
                </div>
            </div>
        </div>
    )
}