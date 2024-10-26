import { Button } from "@/components/ui/button";

const ButtonsPage = () => {
    return (
        <div className="p-4 space-y-4 flex flex-col max-w-[200px] mx-auto">
            <h1 className="text-2xl font-bold text-center text-sky-500">Our buttons</h1>
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="primaryOutline">Primary Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="secondaryOutline">Secondary Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="destructiveOutline">Destructive Outline</Button>
            <Button variant="premium">Premium</Button>
            <Button variant="premiumOutline">Premium Outline</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="sidebar">Sidebar Button</Button>
            <Button variant="sidebarOutline">Sidebar Outline</Button>
            <Button variant="link">Link Button</Button>
        </div >
    )
}

export default ButtonsPage;