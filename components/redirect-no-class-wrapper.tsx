"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const RedirectWrapper = () => {
    const router = useRouter()

    useEffect(() => {
        toast.error("Please select a class first", {
            description: "You need to join a class before accessing the study page"
        })
        router.push("/classes")
    }, [router])

    return null
}