
type Props = {
    title: string
}

const Header = ({ title }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-sky-500">{title}</h1>
        </div>
    )
}

export default Header