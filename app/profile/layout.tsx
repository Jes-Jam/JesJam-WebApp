import Sidebar from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

type Props = {
    children: React.ReactNode;
}

const ProfileLayout = ({ children }: Props) => {
    return (
        <div className="h-full flex">
            <MobileHeader />
            <Sidebar className="hidden lg:flex" />
            <main className="flex-1 lg:pl-[256px] pt-[50px] lg:pt-0">
                {children}
            </main>
        </div>
    )
}

export default ProfileLayout