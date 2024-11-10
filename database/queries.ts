import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { classes } from "./schema";
import { eq } from "drizzle-orm";

export const getClasses = cache(async () => {
    const classes = await db.query.classes.findMany();
    console.log("This are classes: ", classes)
    return classes
})