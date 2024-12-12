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
        await db.delete(schema.challengeContent)
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
                title: "Chapter 1: Immune System",
                description: "This chapter covers the basics of the immune system.",
                order: 1
            }
        ])

        await db.insert(schema.lessons).values([
            {
                id: 1,
                chapterId: 1,
                title: "Lesson 1: The Basics of the Immune System",
                description: "This lesson covers the basics of the immune system, including the different types of immune cells and how they work together to protect the body.",
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

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                question: 'What is the immune system?',
                order: 1
            },
            {
                id: 2,
                lessonId: 1,
                type: "SELECT",
                question: 'How does the immune system work?',
                order: 2
            },
            {
                id: 3,
                lessonId: 1,
                type: "SELECT",
                question: 'How many types of immune cells are there?',
                order: 3
            },
        ])


        await db.insert(schema.challengeContent).values([
            {
                challengeId: 1,
                text: 'The immune system is a complex network of cells, tissues, and organs that work together to defend the body against foreign invaders, such as bacteria, viruses, and other pathogens.',
                imageSrc: '/mascot.svg',
                correct: true,
                audioSrc: '/placeholder.mp3',
            },
            {
                challengeId: 1,
                text: 'The immune system is a complex network of cells, tissues, and organs that work together to defend the body against foreign invaders, such as bacteria, viruses, and other pathogens.',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
            {
                challengeId: 1,
                text: 'The immune system is a complex network of cells, tissues, and organs that work together to defend the body against foreign invaders, such as bacteria, viruses, and other pathogens.',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
        ])

        await db.insert(schema.challengeContent).values([
            {
                challengeId: 2,
                text: 'It works by producing antibodies that target and neutralize foreign invaders.',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
            {
                challengeId: 2,
                text: 'It works by producing antibodies that target and neutralize foreign invaders.',
                imageSrc: '/mascot.svg',
                correct: true,
                audioSrc: '/placeholder.mp3',
            },
            {
                challengeId: 2,
                text: 'It works by producing antibodies that target and neutralize foreign invaders.',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
        ])

        await db.insert(schema.challengeContent).values([
            {
                challengeId: 3,
                text: 'There are 3 types of immune cells.',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
            {
                challengeId: 3,
                text: 'There are 2 types of immune cells.',
                imageSrc: '/mascot.svg',
                correct: true,
                audioSrc: '/placeholder.mp3',
            },
            {
                challengeId: 3,
                text: 'There are 4 types of immune cells.',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/placeholder.mp3',
            },
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