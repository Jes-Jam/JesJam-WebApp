import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"



type Props = {
    className?: string
}


const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex h-full flex-col lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2",
            className)}>
            <div className="flex-1 flex flex-col">
                <Link href="/study">
                    <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                        <Image src="/images/jesjam_logo.svg"
                            alt="jesjam-logo"
                            width={80}
                            height={80}
                            className="object-contain" />
                        <h1 className="sm:hidden lg:block text-2xl font-bold text-sky-500">JesJam</h1>
                    </div>
                </Link>
            </div>


            <div className="p-4">
                Sidebar footer
            </div>
        </div >
    )
}

export default Sidebar