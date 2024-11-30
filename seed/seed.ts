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
        await db.delete(schema.challengeAnswers)
        await db.delete(schema.challengeProgress)
        await db.delete(schema.classEnrollments)

        await db.insert(schema.classes).values([
            {
                id: 1,
                title: "Biology",
                imageSrc: "/images/mascot.svg",
            },
            {
                id: 2,
                title: "Literature",
                imageSrc: "/images/mascot.svg",
            },
            {
                id: 3,
                title: "History",
                imageSrc: "/images/mascot.svg",
            },
            {
                id: 4,
                title: "Khmer",
                imageSrc: "/images/mascot.svg",
            }
        ])

        await db.insert(schema.chapters).values([
            {
                id: 1,
                classId: 1,
                title: "Title go here",
                description: "Description go here",
                order: 1
            }
        ])

        await db.insert(schema.lessons).values([
            {
                id: 1,
                chapterId: 1,
                title: "Lesson's title go here",
                description: "Lesson's description goes here",
                order: 1
            },
            {
                id: 2,
                chapterId: 1,
                title: "Lesson's title go here",
                description: "Lesson's description goes here",
                order: 2
            },
            {
                id: 3,
                chapterId: 1,
                title: "Lesson's title go here",
                description: "Lesson's description goes here",
                order: 3
            },
            {
                id: 4,
                chapterId: 1,
                title: "Lesson's title go here",
                description: "Lesson's description goes here",
                order: 4
            },
            {
                id: 5,
                chapterId: 1,
                title: "Lesson's title go here",
                description: "Lesson's description goes here",
                order: 5
            }        
        ])

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                question: 'Challenge title go here',
                order: 1
            },
        ])


        await db.insert(schema.challengeAnswers).values([
            {
                id: 1,
                challengeId: 1,
                text: 'Text here',
                imageSrc: '/placeholder.jpg',
                correct: true,
                audioSrc: '/placeholder.mp3',
            },
            {
                id: 2,
                challengeId: 1,
                text: 'Text here',
                imageSrc: '/placeholder.jpg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
            {
                id: 3,
                challengeId: 1,
                text: 'Text here',
                imageSrc: '/placeholder.jpg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
        ])

        // await db.insert(schema.classEnrollments).values([
        //     {
        //         userId: "user_2nxzFxikuSZJgD5yHAfDY5Sx9dN", 
        //         classId: 1,
        //         status: "active",
        //         enrolledAt: new Date(),
        //     },
        //     {
        //         userId: "user_2nxzFxikuSZJgD5yHAfDY5Sx9dN", 
        //         classId: 2,
        //         status: "completed",
        //         enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        //         completedAt: new Date(),
        //     },
        //     {
        //         userId: "user_2nxzFxikuSZJgD5yHAfDY5Sx9dN", 
        //         classId: 3,
        //         status: "dropped",
        //         enrolledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        //     },
        // ])

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