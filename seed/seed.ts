import "dotenv/config"

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

import * as schema from "@/database/schema"


const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const main = async () => {
    try {
        console.log("Testing database connection...")
        await sql`SELECT 1`
        
        console.log("Database connection successful, proceeding with seeding...")

        console.log("Seeding database...")

        await db.delete(schema.classes)
        await db.delete(schema.userProgress)
        await db.delete(schema.chapters)
        await db.delete(schema.lessons)
        await db.delete(schema.challenges)
        await db.delete(schema.challengeProgress)
        await db.delete(schema.classEnrollments)

        await db.insert(schema.classes).values([
            {
                id: 1,
                title: "Biology",
                imageSrc: "/images/mascot.svg",
                ownerId: "1"
            },
            {
                id: 2,
                title: "History",
                imageSrc: "/images/mascot.svg",
                ownerId: "1"
            },
           
        ])

        await db.insert(schema.chapters).values([
            {
                id: 1,
                classId: 1,
                title: "ជំពូកទី 1: ប្រព័ន្ធអង់ដូគ្រីន",
                description: "យើងនិងរៀនពីប្រព័ន្ធអង់ដូគ្រីន និងការដំណើរការរបស់វា។",
                order: 1
            }
        ])

        await db.insert(schema.lessons).values([
            {
                id: 1,
                chapterId: 1,
                title: "មេរៀនទី 1: ប្រព័ន្ធអង់ដូគ្រីន",
                description: "យើងនិងរៀនពីប្រព័ន្ធអង់ដូគ្រីន និងការដំណើរការរបស់វា។",
                order: 1
            },
            {
                id: 2,
                chapterId: 1,
                title: "Lesson 2: The Basics of the Immune System",
                description: "This lesson covers the basics of the immune system, including the different types of immune cells and how they work together to protect the body.",
                order: 2
            },
            {
                id: 3,
                chapterId: 1,
                title: "Lesson 3: The Basics of the Immune System",
                description: "This lesson covers the basics of the immune system, including the different types of immune cells and how they work together to protect the body.",
                order: 3
            },
            {
                id: 4,
                chapterId: 1,
                title: "Lesson 4: The Basics of the Immune System",
                description: "This lesson covers the basics of the immune system, including the different types of immune cells and how they work together to protect the body.",
                order: 4
            },
            {
                id: 5,
                chapterId: 1,
                title: "Lesson 5: The Basics of the Immune System",
                description: "This lesson covers the basics of the immune system, including the different types of immune cells and how they work together to protect the body.",
                order: 5
            }
        ])

        console.log("------------ Database seeded 🌱🌱 ------------")

    } catch (error: any) {
        console.error("Detailed error:", error);
        console.error("Connection error details:", {
            name: error.name,
            message: error.message,
            cause: error.cause
        });
        throw new Error("Failed to seed database")
    }
}

main()