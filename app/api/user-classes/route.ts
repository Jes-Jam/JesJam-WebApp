import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { classes } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const userClasses = await db.query.classes.findMany({ where: eq(classes.ownerId, userId) });
    return NextResponse.json(userClasses);
}


export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title, imageSrc } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        const newClass = await db.insert(classes).values({ title, imageSrc, ownerId: userId });
        
        revalidatePath("/classes")
        return NextResponse.json(newClass);
    } catch (error) {
        console.log("[USER_CLASSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
