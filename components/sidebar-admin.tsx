"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ClerkLoading, ClerkLoaded, UserButton, useUser } from "@clerk/nextjs"
import { Loader, Layout, BookOpen, BookText, GraduationCap, Users } from "lucide-react"
import SidebarItem from "@/components/sidebar-item"

type Props = {
    className?: string
}

const SidebarAdmin = ({ className }: Props) => {
    const { user } = useUser()

    return (
        <div className={cn(
            "flex h-full flex-col lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2",
            className)}>
            <div className="flex-1 flex flex-col">
                <Link href="/admin">
                    <div className="pt-8 pl-4 pb-9 flex items-center gap-x-3">
                        <Image src="/images/jesjam_logo.svg"
                            alt="jesjam-logo"
                            width={80}
                            height={80}
                            className="object-contain" />
                        <h1 className="sm:hidden lg:block text-2xl font-bold text-sky-500">Admin</h1>
                    </div>
                </Link>
                <div className="flex flex-col gap-y-3">
                    <SidebarItem
                        label="Dashboard"
                        icon={<Layout className="h-9 w-9" />}
                        href="/admin"
                    />
                    <SidebarItem
                        label="Classes"
                        icon={<BookOpen className="h-9 w-9" />}
                        href="/admin/classes"
                    />
                    <SidebarItem
                        label="Chapters"
                        icon={<BookText className="h-9 w-9" />}
                        href="/admin/chapters"
                    />
                    <SidebarItem
                        label="Lessons"
                        icon={<GraduationCap className="h-9 w-9" />}
                        href="/admin/lessons"
                    />
                </div>
            </div>

            <div className="p-6 pl-8 border-t-2">
                <ClerkLoading>
                    <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <div className="flex items-center gap-x-3">
                        <UserButton afterSignOutUrl="/">
                            <Image
                                src="/images/user.svg"
                                alt="user"
                                width={40}
                                height={40}
                                className="object-contain rounded-full border-2 border-slate-200"
                            />
                        </UserButton>
                        <div className="flex flex-col">
                            <span className="font-bold text-sky-600">Admin {user?.fullName}</span>
                            {/* <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span> */}
                        </div>
                    </div>
                </ClerkLoaded>
            </div>
        </div>
    )
}

export default SidebarAdmin
