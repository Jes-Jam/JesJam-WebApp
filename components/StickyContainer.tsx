

type Props = {
    children: React.ReactNode
}


const StickyContainer = ({ children }: Props) => (
    <div className="hidden lg:block w-[450px] sticky self-end pb-6">
        {/* The container should take up the full height of the viewport on large screens */}
        <div className="flex flex-col gap-y-4 min-h-[calc(100vh-50px)] sticky top-6">{children}</div>
    </div>
)

export default StickyContainer