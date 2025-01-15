"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { classes } from "@/database/schema"
import { useRouter } from "next/navigation"
type Props = {
    classes: typeof classes.$inferSelect
}

export const CurrentClass = async ({ classes }: Props) => {
    const router = useRouter();

    const onClassClick = () => {
        router.push(`/classes`);
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-left font-bold text-2xl text-white my-6 mb-4">You're studying</h1>
            <div className="flex flex-row items-center rounded-xl p-4 bg-gray-200/50 border-2 border-gray-300 cursor-pointer hover:bg-gray-200/70 hover:border-gray-400/90 transition-all duration-300" onClick={onClassClick}>
                <Avatar className="w-10 h-10 mr-6 ml-3">
                    <AvatarImage src={classes.imageSrc ?? ''} />
                    <AvatarFallback>{classes.title?.charAt(0) ?? ''}</AvatarFallback>
                </Avatar>
                <h1 className="text-center font-bold text-2xl text-white my-6">{classes.title}</h1>
            </div>
        </div>

    )
}