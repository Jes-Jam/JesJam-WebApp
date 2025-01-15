"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <div className="w-full">
            <div className="flex flex-row items-center gap-4">
                <Link href="/classes/" className="-ml-2">
                    <ArrowLeft className="text-sky-500" size={24} strokeWidth={2} />
                </Link>
                <h1 className="text-3xl font-bold text-sky-500">{title}</h1>
            </div>
        </div>
    )
}