import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import Sidebar from "@/components/sidebar";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="lg:hidden">
                    <Menu />
                </button>
            </SheetTrigger>
            <SheetContent className="p-0 z-[100]" side="left">
                <Sidebar className="lg:hidden" />
            </SheetContent>
        </Sheet>
    )
}