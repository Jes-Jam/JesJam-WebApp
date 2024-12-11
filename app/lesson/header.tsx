import { Progress } from "@/components/ui/progress";
import { useModal } from "@/states/useModal";
import { X } from "lucide-react";
import Image from "next/image";
interface HeaderProps {
    patels: number;
    percentage: number;
    hasActiveSubscription: boolean;
}

export const Header = ({
    patels,
    percentage,
    hasActiveSubscription }:
    HeaderProps) => {
    const { onOpen } = useModal();

    return (
        <header className="lg:pt-[50px] pt-[30px] px-10 flex gap-x-7 items-center justify-between max-w-[988px] mx-auto w-full">
            <X
                onClick={() => onOpen()}
                className="w-8 h-8 text-sky-500 hover:opacity-75 transition cursor-pointer"
            />
            <Progress
                value={percentage}
                className="w-full h-4"
            />

            <div className="text-amber-500 flex gap-x-2 items-center font-bold">
                <Image src="/images/daisy-patels.svg" alt="mascot" width={50} height={50} />
                {patels}
            </div>
        </header>
    )
}
