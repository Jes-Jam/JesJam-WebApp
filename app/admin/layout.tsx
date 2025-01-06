import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { getIsAdmin } from "../../lib/admin";
import SidebarAdmin from "@/components/sidebar-admin";


const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = auth();
    const isAdmin = await getIsAdmin();

    if (!userId || !isAdmin) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <SidebarAdmin />
            <main className="max-w-[1280px] mx-auto md:pl-56 mt-3 h-full">
                {children}
            </main>
        </div>
    )
}

export default AdminLayout