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
                        "h-full border-2 hover:bg-sky-500/5 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-[217px] min-w-[400px] rounded-md hover:from-sky-200 hover:via-blue-200 hover:to-sky-300 hover:border-sky-400 transition-all duration-300 shadow-inner shadow-white/50 relative overflow-hidden group [&>*]:relative [&>*]:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                        item.active ? "border-sky-500 bg-sky-500/10" : "border-slate-200",
                    )}>
                    <div className="min-h-[10px] w-full flex items-center justify-end">
                        {item.active && (
                            <Check className="text-sky-500 stroke-[4] h-7 w-7" />
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