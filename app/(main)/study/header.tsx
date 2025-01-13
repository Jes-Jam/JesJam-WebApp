"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
    title: string
}

const Header = ({ title }: Props) => {
    return (
        <div className="top-0 flex ml-5 items-center justify-between ">
            <Link href="/classes">
                <ArrowLeft
                    className="text-sky-500 ml-4 hover:text-sky-500/80"
                    size={24}
                    strokeWidth={2} />
            </Link>
            <h1 className="text-3xl font-bold text-sky-500">{title}</h1>
            <div></div>
        </div>
    )
}
export default Header