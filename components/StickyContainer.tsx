

type Props = {
    children: React.ReactNode
}


const StickyContainer = ({ children }: Props) => {
    return (
        <div className="hidden lg:block w-[405px]">
            <div className="fixed top-0 right-0 w-[405px] flex flex-col pt-10 px-6 gap-y-4 h-screen 
            bg-sky-400/10 bg-gradient-to-b from-sky-400/50 via-[#6A42C2]/10 to-white 
            border-l-2 border-l-slate-200">
                {children}
            </div>
        </div>
    )
}


export default StickyContainer