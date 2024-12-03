import { header } from "framer-motion/client";
import { X } from "lucide-react";

interface HeaderProps {
    patels: number;
    percentage: number;
    hasActiveSubscription: boolean;
}

export const Header = ({ patels,
    percentage,
    hasActiveSubscription }:
    HeaderProps) => {
    return (
        <header className="lg:pt-[50px] pt-[30px] px-10 flex gap-x-7 items-center justify-between max-w-[988px] mx-auto w-full">
            <X className="w-6 h-6 text-sky-500 hover:opacity-75 transition cursor-pointer" />
        </header>
    )
}
