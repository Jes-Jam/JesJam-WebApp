// "use client"

import List from "./list";
import { getClasses } from "@/database/queries";

const ClassPage = async () => {

    const classes = await getClasses();

    console.log("All classes: ", classes)

    // const classes = [
    //     {
    //         title: "Biology",
    //         imageSrc: "/images/mascot.svg",
    //         id: "1",
    //         disabled: false,
    //         onClick: () => { },
    //         active: true
    //     },
    //     {
    //         title: "History",
    //         imageSrc: "/images/mascot.svg",
    //         id: "1",
    //         disabled: false,
    //         onClick: () => { },
    //         active: false
    //     },
    //     {
    //         title: "Physic",
    //         imageSrc: "/images/mascot.svg",
    //         id: "1",
    //         disabled: false,
    //         onClick: () => { },
    //         active: false
    //     },
    // ]

    // const userProgress = {
    //     activeClassId: "1",
    //     // activeClass: classes[0]
    // }

    return (
        <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
            <h1 className="text-2xl font-bold text-sky-500">Available Classes</h1>
            {/* List of classes */}
            <List classes={classes} />
        </div>
    );
}

export default ClassPage