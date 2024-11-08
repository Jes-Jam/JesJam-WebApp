"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import Image from "next/image"

type Props = {
    classes: {
        active: boolean;
        imageSrc: string;
        title: string;
        id: string;
        disabled: boolean;
        onClick: () => void
    }[];
    activeClassId: string
}

const List = ({ classes, activeClassId }: Props) => {


    return (
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {classes.map((item, index) => (
                <div key={index}
                    onClick={item.onClick}
                    className={cn(
                        "h-full border-2 hover:bg-black/5 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-[217px] min-w-[400px] rounded-md",
                        item.active ? "border-sky-500 bg-black/5" : "border-slate-200",
                    )}>
                    <div className="min-h-[40px] w-full flex items-center justify-end">
                        {item.active && (
                            <Check className="text-sky-500 stroke-[4] h-6 w-6" />
                        )}
                    </div>
                    <Image src={item.imageSrc} alt={item.title} height={70} width={93.3}
                    />
                    <p className="text-sky-700 text-center font-bold mt-3">
                        {item.title}
                    </p>
                </div>
            ))}
        </div>
    )
}


export default List;