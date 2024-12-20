"use client"
import Image from "next/image"
import React from "react"
import { Button } from "@/components/ui/button"
import { refillPetals } from "@/actions/user-progress";
import { toast } from "sonner"

export const POINTS_TO_REFILL = 10;

type Props = {
    petals: number;
    points: number;
    hasActiveSubscription: boolean
}

export const FlowerStore = ({ petals, points, hasActiveSubscription }: Props) => {
    const [pending, startTransition] = React.useTransition();

    const onRefillPetals = () => {
        if (pending || petals === 5 || points < POINTS_TO_REFILL) return;

        startTransition(() => {
            refillPetals()
                .catch(() => toast.error("Something went wrong"))
        })
    }

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 bg-sky-500 rounded-lg">
                {/* <Image src="/placeholder.jpg" alt="placeholder" width={60} height={60} /> */}
                <div className="flex-1">
                    <p className="text-white text-base lg:text-xl font-bold">
                        Refill petals 😁👌
                    </p>
                </div>
                <Button variant="default" disabled={pending || petals === 5 || points < POINTS_TO_REFILL} onClick={onRefillPetals}>
                    {petals === 5 ? "Full" : (
                        <div className="flex items-center">
                            <Image src="/images/mascot.svg" alt="placeholder" width={30} height={30} />
                            <p>
                                {POINTS_TO_REFILL} points
                            </p>
                        </div>
                    )}
                </Button>
            </div>
        </ul>
    )
}