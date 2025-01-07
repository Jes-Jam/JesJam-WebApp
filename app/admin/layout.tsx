import { redirect } from "next/navigation"
import { getIsAdmin } from "../../lib/admin";
import SidebarAdmin from "@/components/sidebar-admin";
import { QueryProvider } from "./providers";
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const isAdmin = await getIsAdmin();

    if (!isAdmin) {
        redirect("/");
    }

    return (
        <div className="h-full">
            <SidebarAdmin />
            <div className="max-w-[1280px] mx-auto md:pl-56 mt-3 h-full">
                <QueryProvider>
                    {children}
                </QueryProvider>
            </div>
        </div>
    );
};

export default AdminLayout;