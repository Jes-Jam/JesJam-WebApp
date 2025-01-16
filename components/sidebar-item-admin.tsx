'use client'


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'


interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
}


/**
* A single item in the sidebar.
*
* @param {string} label - Text that will be displayed for the item.
* @param {string} iconImg - An image that will be displayed for the item.
* @param {string} href - The URL to navigate to when the item is clicked.
*
* @returns A single sidebar item.
*/
const SidebarItemAdmin = ({
    icon,
    label,
    href
}: SidebarItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;


    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-x-2text-slate-500 text-gray-500 text-base font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                "rounded-lg mb-2 py-2",
                isActive && "text-sky-500 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-600 border-2 border-sky-500",
                "relative"
            )}
        >
            {icon}
            <span className="sm:hidden lg:block ml-4">{label}</span>
        </Link>
    );
};


export default SidebarItemAdmin

