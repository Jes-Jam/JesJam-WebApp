import { getCustomClasses } from "@/database/classCrud";

const CustomClasses = async () => {
    const myCustomClasses = await getCustomClasses();

    return (
        <div>
            {/* Your custom classes content */}
            {JSON.stringify(myCustomClasses)}
            {/* <h1>Custom Classes</h1> */}
        </div>
    );
}

export default CustomClasses;
