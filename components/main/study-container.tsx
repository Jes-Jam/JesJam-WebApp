type Props = {
    children: React.ReactNode;
}

const StudyContainer = ({ children }: Props) => {
    return (
        <div className="flex-1 pt-10 relative pb-10">
            {children}
        </div>
    )
}

export default StudyContainer

