"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


// type Props = {
//     title: string;
// }

// export const Header = ({ title }: Props) => {
//     return (
//         <div className="top-0 sticky bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50">
//             <Link href="/classes">
//                 <Button variant="ghost" size="sm">
//                     <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
//                 </Button>
//             </Link>
//             <h1 className="font-bold text-lg">{title}</h1>
//             <div></div>
//         </div>
//     )
// }

type Props = {
    title: string
}

const Header = ({ title }: Props) => {
    return (
        <div className="top-0 sticky flex items-center justify-between ">
            <Link href="/classes">
                <Button variant="ghost" size="lg">
                    <ArrowLeft className="w-5 h-5 stroke-2 text-sky-500" />
                </Button>
            </Link>
            <h1 className="text-3xl font-bold text-sky-500">{title}</h1>
            <div></div>
        </div>
    )
}
export default Header