import "dotenv/config"

import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

import * as schema from "@/database/schema"


const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const main = async () => {
    try {
        console.log("------------ Seeding database... ------------")

        await db.delete(schema.classes)
        await db.delete(schema.userProgress)

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

        console.log("------------ Database seeded ------------")

    } catch (error) {
        console.error(error)
        throw new Error("Failed to seed database")
    }
}

main()