"use client"

import List from "./list";

const ClassPage = () => {

    const classes = [
        {
            title: "Biology",
            imageSrc: "/images/mascot.svg",
            id: "1",
            disabled: false,
            onClick: () => { },
            active: true
        },
        {
            title: "History",
            imageSrc: "/images/mascot.svg",
            id: "1",
            disabled: false,
            onClick: () => { },
            active: false
        },
        {
            title: "Physic",
            imageSrc: "/images/mascot.svg",
            id: "1",
            disabled: false,
            onClick: () => { },
            active: false
        },
    ]

    const userProgress = {
        activeClassId: "1",
        activeClass: classes[0]
    }

    return (
        <div className="h-full w-[900px] mx-auto pt-10">
            <h1 className="text-2xl font-bold text-sky-500">Avaible Classes</h1>
            {/* List of classes */}
            <List classes={classes} activeClassId={userProgress?.activeClassId} />
        </div>
    );
}

export default ClassPage