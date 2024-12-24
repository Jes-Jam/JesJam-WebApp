import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { chapters } from "./schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";

// export const createChapter = cache(async (classId: number, title: string) => {
//   const { userId } = await auth();

//   if (!userId) {
//     return;
//   }

//   await db.insert(chapters).values({
//     title,
//     classId,
//     ownerId: userId
//   });

//   revalidatePath(`/classes/${classId}`);
// });