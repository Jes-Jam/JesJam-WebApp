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
                    <div className="pt-8 pl-4 pb-9 flex items-center gap-x-3">
                        <Image src="/images/jesjam_logo.svg"
                            alt="jesjam-logo"
                            width={80}
                            height={80}
                            className="object-contain" />
                        <h1 className="sm:hidden lg:block text-2xl font-bold text-sky-500">JesJam</h1>
                    </div>
                </Link>
                <div className="flex flex-col gap-y-3">
                    <SidebarItem label="Study" iconImg="/images/home.svg" href="/study" />
                    <SidebarItem label="Profile" iconImg="/images/account.svg" href="/profile" />
                    <SidebarItem label="Leaderboard" iconImg="/images/star.svg" href="/leaderboard" />
                    <SidebarItem label="Explore" iconImg="/images/explore.svg" href="/explore" />
                </div>
            </div>


            <div className="p-4 pb-8">
                <ClerkLoading>
                    <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton afterSignOutUrl="/">
                        <Image src="/images/user.svg" alt="user" width={40} height={40} className="object-contain" />
                    </UserButton>
                </ClerkLoaded>
            </div>
        </div >
    )
}

export default Sidebar