'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = {
    label: string,
    iconImg: string,
    href: string
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
const SidebarItem = ({ label, iconImg, href }: Props) => {
    const currentUrl = usePathname();
    const isActive = currentUrl === href;
    return (
        <Button
            variant={isActive ? 'sidebar' : 'sidebarOutline'}
            className={cn(
                'justify-start h-[50px] ml-4 gap-x-4',
                isActive ? 'text-sky-500' : ''
            )}
            asChild
        >
            <Link href={href}>
                <Image src={iconImg} alt={label} width={35} height={35} />
                <p className="font-simibold tracking-wide">{label}</p>
            </Link>
        </Button>
    );
}

export default SidebarItem