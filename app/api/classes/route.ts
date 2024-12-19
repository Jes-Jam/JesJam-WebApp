// app/api/classes/route.ts
import { NextResponse } from "next/server";
import { createClass, deleteClass, upadteClass, getCustomClasses } from "@/database/classCrud";

export async function POST(req: Request) {
  const { title } = await req.json();

  try {
    await createClass(title);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ success: false, error: "Failed to create class" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { classId } = await req.json();

  try {
    await deleteClass(classId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ success: false, error: "Failed to delete class" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { classId, title } = await req.json();

  try {
    await upadteClass(classId, title);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json({ success: false, error: "Failed to update class" }, { status: 500 });
  }
}

export async function GET(req: Request) {	
  try {
    const classes = await getCustomClasses();
    return NextResponse.json({ success: true, classes });
  } catch (error) {
    console.error("Error getting classes:", error);
    return NextResponse.json({ success: false, error: "Failed to get classes" }, { status: 500 });
  }
}
