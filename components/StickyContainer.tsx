

type Props = {
    children: React.ReactNode
}


const StickyContainer = ({ children }: Props) => (
    <div className="hidden lg:block w-[405px] sticky self-end pb-6">
        {/* The container should take up the full height of the viewport on large screens */}
        <div className="flex flex-col pt-10 px-6 gap-y-4 min-h-[calc(100vh-50px)] sticky bg-gradient-to-b from-[#3398DB] via-[#3398DB]/10 to-white border-l-2 border-l-slate-200">{children}</div>
    </div>
)

export default StickyContainer