import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import SidebarItem from "@/components/sidebar-item"




type Props = {
    className?: string
}


const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex h-full flex-col lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2",
            className)}>
            <div className="flex-1 flex flex-col">
                <Link href="/">
                    <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                        <Image src="/images/jesjam_logo.svg"
                            alt="jesjam-logo"
                            width={80}
                            height={80}
                            className="object-contain" />
                        <h1 className="sm:hidden lg:block text-2xl font-bold text-sky-500">JesJam</h1>
                    </div>
                </Link>
                <div className="flex flex-col gap-y-3">
                    <SidebarItem label="Study" iconImg="/images/planet.svg" href="/study" />
                    <SidebarItem label="Profile" iconImg="/images/planet.svg" href="/leaderboard" />
                    <SidebarItem label="Leaderboard" iconImg="/images/planet.svg" href="/quests" />
                    <SidebarItem label="Explore" iconImg="/images/planet.svg" href="/courses" />
                </div>
            </div>


            <div className="p-4">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton afterSignOutUrl="/" />
                </ClerkLoaded>
            </div>
        </div >
    )
}

export default Sidebar