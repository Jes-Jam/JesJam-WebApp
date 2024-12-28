import { Loader } from "lucide-react"

const Loading = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader className="h-9 w-9 text-sky-500 animate-spin" />
        </div>
    )
}

export default Loading