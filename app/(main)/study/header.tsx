"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
    title: string
}

const Header = ({ title }: Props) => {
    return (
        <div className="top-0 sticky flex items-center justify-between ">
            <Link href="/classes">
                <Button variant="ghost">
                    <ArrowLeft className="w-16 h-16 stroke-2 text-sky-500" />
                </Button>
            </Link>
            <h1 className="text-3xl font-bold text-sky-500">{title}</h1>
            <div></div>
        </div>
    )
}
export default Header