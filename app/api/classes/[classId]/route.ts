import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { classes } from "@/database/schema";
import { eq } from "drizzle-orm";


export async function DELETE(
    req: Request,
    { params }: { params: { classId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const classId = parseInt(params.classId);
  
      // Check if class exists and belongs to user
      const existingClass = await db.query.classes.findFirst({
        where: eq(classes.id, classId)
      });
  
      if (!existingClass) {
        return new NextResponse("Class not found", { status: 404 });
      }
  
      if (existingClass.ownerId !== userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      await db.delete(classes).where(eq(classes.id, classId));
  
      return NextResponse.json({ message: "Class deleted successfully" });
    } catch (error) {
      console.log("[CLASS_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }


  export async function PATCH(
    req: Request,
    { params }: { params: { classId: string } }
  ) {
    try {
      const { userId } = auth();
      const { title, imageSrc, isPrivateClass } = await req.json();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const classId = parseInt(params.classId);
  
      // Check if class exists and belongs to user
      const existingClass = await db.query.classes.findFirst({
        where: eq(classes.id, classId)
      });
  
      if (!existingClass) {
        return new NextResponse("Class not found", { status: 404 });
      }
  
      if (existingClass.ownerId !== userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const updatedClass = await db
        .update(classes)
        .set({
          title,
          imageSrc,
          isPrivateClass,
        })
        .where(eq(classes.id, classId))
        .returning();
  
      return NextResponse.json(updatedClass[0]);
    } catch (error) {
      console.log("[CLASS_PATCH]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }