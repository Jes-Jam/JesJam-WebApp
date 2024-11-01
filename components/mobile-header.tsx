
import { MobileSidebar } from "./mobile-sidebar"

export const MobileHeader = () => {
    return (
        <nav className="lg:hidden px-6 h-[50px] bg-sky-500 flex items-center border-b-2 border-slate-200 fixed top-0 w-full z-50">
            <MobileSidebar />
        </nav>
    )
}