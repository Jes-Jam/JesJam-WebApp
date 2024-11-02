import Sidebar from "@/components/sidebar"
import { MobileHeader } from "@/components/mobile-header"

type Props = {
    children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return (
        <div className="flex h-full">
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="flex-1 lg:pl-[256px] pt-[50px] lg:pt-0">
                <div className="max-w-[1560px] mx-auto pt-6 h-full">
                    {children}
                </div>
            </main>
        </div>
    )

}

export default MainLayout