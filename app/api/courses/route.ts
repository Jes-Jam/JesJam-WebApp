import { NextResponse } from "next/server";

import db from "@/database/drizzle";
import { classes } from "@/database/schema";

export const GET = async () => {
    const data = await db.query.classes.findMany();
    return NextResponse.json(data);
}