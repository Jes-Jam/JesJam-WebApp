import { cn } from "@/lib/utils"
// import Image from "next/image"
import Link from "next/link"



type Props = {
    className?: string
}


export const Sidebar = ({ className }: Props = {}) => {
    return (
        <div className={cn("flex flex-col", className)}>
            <div>
                <Link href="/"></Link>
            </div>
            <div className="flex flex-col">
                Link 1
            </div>

            <div className="p-4">

            </div>
        </div >
    )
}