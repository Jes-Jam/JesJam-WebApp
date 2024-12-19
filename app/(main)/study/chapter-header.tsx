import { NotebookText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const ChapterHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="w-[calc(100%-30px)] bg-white py-5 mx-10 flex items-center border-b-2 border-gray-200 justify-between">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-sky-500">{title}</h2>
                <p className="text-gray-500">{description}</p>
            </div>
            <Link className="" href="/lesson">
                <Button size="sm" variant="primaryOutline" className="text-center">
                    <NotebookText className="w-6 h-6" />
                </Button>
            </Link>
        </div>
    )
}