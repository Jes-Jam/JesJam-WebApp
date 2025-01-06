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

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                question: 'ដូចម្ដេចដែលហៅថាក្រពេញ?',
                order: 1
            },
            {
                id: 2,
                lessonId: 1,
                type: "SELECT",
                question: 'ហេតុអ្វីបានជាអរម៉ូនបុិបទីតមិនអាចឆ្លងកាត់ភ្នាសកោសិកាបាន?',
                order: 2
            },
            {
                id: 3,
                lessonId: 1,
                type: "SELECT",
                question: 'តើអុីប៉ូតាឡាមុសផលិតអរម៉ូនប៉ុន្មានប្រភេទ?',
                order: 3
            },
        ])


        await db.insert(schema.challengeContent).values([
            {
                challengeId: 1,
                text: 'ក្រពេញជាកោសិកាឬជាសរីរាង្គដែលកើតឡើងពីកោសិកាអេពីតេល្យូមដែលមានឯកទេសកម្មក្នុងការបញ្ចេញសារធាតុចាំបាច់សម្រាប់សារពាង្គកាយ។',
                imageSrc: '/mascot.svg',
                correct: true,
                audioSrc: '/audio/c1o1.mp3',
            },
            {
                challengeId: 1,
                text: 'ក្រពេញអិចសូគ្រីនជាក្រពេញមានបំពង់នាំដែលបញ្ចេញរសរំលាយអាហារនិងសំណល់មេតាប៉ូលីសទៅខាងក្រៅចរន្តឈាម។ ',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/audio/c1o1.mp3',
            },
            {
                challengeId: 1,
                text: 'ក្រពេញអង់ដូគ្រីនជាក្រពេញគ្មានបំពង់នាំដែលបញ្ចេញសារធាតុគីមីហៅថាអរម៉ូនហើយធ្វើដំណើរទៅក្នុងឈាម់',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/audio/c1o1.mp3',
            },
        ])

        await db.insert(schema.challengeContent).values([
            {
                challengeId: 2,
                text: 'អរម៉ូននៃប្រដាប់រំលាយអាហារផលិតចេញពីសរីរាង្គក្រពះនិងពោះវៀនតូច។',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/audio/c1o1.mp3',
            },
            {
                challengeId: 2,
                text: 'បានជាអរម៉ូនបិបទីតមិនអាចឆ្លងកាត់ភ្នាសកោសិកាបាន ពីព្រោះវាជាម៉ូលេគុលប្រូតេអ៊ីនធំៗហើយមិនរលាយនៅក្នុងស្រទាប់លីពីតដែលមានវត្តមានក្នុងភ្នាសកោសិកា។',
                imageSrc: '/mascot.svg',
                correct: true,
                audioSrc: '/audio/c1o1.mp3',
            },
            {
                challengeId: 2,
                text: 'នៅពេលអរម៉ូនស្តេរ៉ូអុីតជ្រាបចូលក្នុងកោសិកាវាបានភ្ជាប់ទៅនឹងធ្មួលក្នុងស៊ីតូប្លាសហើយបង្កើតបានជាម៉ូលេគុលចម្រុះអរម៉ូនធ្មួល។',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/audio/c1o1.mp3',
            },
        ])

        await db.insert(schema.challengeContent).values([
            {
                challengeId: 3,
                text: '១ ប្រភេទអង់ដូគ្រីន។',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/audio/c1o1.mp3',
            },
            {
                challengeId: 3,
                text: '២ ប្រភេទអង់ដូគ្រីន។',
                imageSrc: '/mascot.svg',
                correct: true,
                audioSrc: '/audio/c1o1.mp3',
            },
            {
                challengeId: 3,
                text: '៥ ប្រភេទអង់ដូគ្រីន។',
                imageSrc: '/mascot.svg',
                correct: false,
                audioSrc: '/audio/c1o1.mp3',
            },
        ])

        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonId: 2,
                type: "SELECT",
                question: 'ដូចម្ដេចដែលហៅថាក្រពេញ?',
                order: 1
            },
            {
                id: 5,
                lessonId: 2,
                type: "SELECT",
                question: 'ហេតុអ្វីបានជាអរម៉ូនបុិបទីតមិនអាចឆ្លងកាត់ភ្នាសកោសិកាបាន?',
                order: 2
            },
            {
                id: 6,
                lessonId: 2,
                type: "SELECT",
                question: 'តើអុីប៉ូតាឡាមុសផលិតអរម៉ូនប៉ុន្មានប្រភេទ?',
                order: 3
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