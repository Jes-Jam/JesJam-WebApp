"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { loadConfettiPreset } from "@tsparticles/confetti";
import { confetti } from "@tsparticles/confetti";
import { updateStreak, getStreak, resetStreak } from "@/database/streak";
import { getCurrentDate, calculateDaysDifference } from "@/lib/date";


type Props = {
    percentage: number;
    patels: number;
    hasActiveSubscription: boolean;
}

export const FinishScreen = ({ percentage, patels, hasActiveSubscription }: Props) => {
    const router = useRouter();

    useEffect(() => {
        const end = Date.now() + 5 * 1000;

        const colors = ["#21AEEF", "#0184C7"];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });

            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="max-w-[968px] mx-auto h-full flex flex-col items-center justify-center space-y-4 lg:gap-y-6 min-h-screen">
                <div>
                    <Image src="/images/finish-screen/grape.jpeg" alt="Grape Picture" width={300} height={300} className="hidden lg:block md:block" />
                    <Image src="/images/finish-screen/grape.jpeg" alt="Grape Picture" width={200} height={200} className="block lg:hidden md:hidden" />
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-center text-sky-900">You've completed the lesson!</h1>

                <div className="flex flex-col space-y-8 w-full max-w-xl border-2 border-gray-200 rounded-lg p-4 pr-6 sm:mx-auto">
                    <div className="flex items-center gap-x-4 border-b-2 border-gray-100 pb-3">
                        <Image
                            src="/images/mascot.svg"
                            alt="Streak"
                            width={80}
                            height={80}
                        />
                        <span className="text-xl font-base text-sky-800">Start a streak</span>
                        <div className="ml-auto">
                            <p className="text-gray-400 text-xl font-semibold"> 35 Days </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-x-4 border-b-2 border-gray-100 pb-3">
                        <Image
                            src="/images/mascot.svg"
                            alt="Streak"
                            width={80}
                            height={80}
                        />
                        <span className="text-xl font-base text-sky-800">You gained</span>
                        <div className="ml-auto text-gray-400 font-semibold text-xl">0 points</div>
                    </div>

                    <div className="flex items-center gap-x-4">
                        <Image
                            src="/images/mascot.svg"
                            alt="Streak"
                            width={80}
                            height={80}
                        />
                        <span className="text-xl font-base text-sky-800">Learn for 10 min</span>
                        <div className="ml-auto text-gray-400 font-semibold text-xl">9/10</div>
                        <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: '90%' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 w-full max-w-xl">
                    <Button className="w-full py-7" variant="primary" onClick={() => router.push("/study")}>
                        <span className="text-xl font-semibold">Got it</span>
                    </Button>
                </div>
            </div>

        </div>
    )
}