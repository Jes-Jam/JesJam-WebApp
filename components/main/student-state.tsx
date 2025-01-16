import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { classes } from "@/database/schema"

type Props = {
    activeCourse: typeof classes.$inferSelect;
    streakCount: number;
    petals: number;
    points: number;
    isPremium: boolean;
}

const StudentProgress = ({ activeCourse, streakCount, petals, points, isPremium }: Props) => {
    return (
        <div className="flex items-center justify-between pb-4 gap-x-2 w-full border-b-2 border-sky-100/50 shadow-white">
            <Link href="classes">
                <Button variant="ghost" className="text-white">
                    <div className="relative w-[56px] h-[48px]">
                        {/* Core Flame */}
                        <div className="absolute bottom-1 left-5 w-6 h-12 bg-gradient-to-t from-fire-red to-transparent rounded-full blur-[2px] animate-flicker"></div>
                        <div className="absolute bottom-1 left-3 w-5 h-10 bg-gradient-to-t from-fire-orange to-transparent rounded-full blur-[1px] animate-flicker1 delay-150"></div>
                        <div className="absolute bottom-2 left-4 w-4 h-8 bg-gradient-to-t from-fire-yellow to-transparent rounded-full blur-[2px] animate-flicker2 delay-300"></div>

                        {/* Outer Glow */}
                        <div className="absolute bottom-0 left-3 w-5 h-10 bg-gradient-to-t from-fire-orange to-transparent rounded-full blur-lg opacity-70 animate-wave"></div>
                        <div className="absolute bottom-0 left-4 w-6 h-12 bg-gradient-to-t from-fire-yellow to-transparent rounded-full blur-xl opacity-50 animate-wave delay-200"></div>
                    </div>
                    {streakCount}
                    {/* <Image src="/images/subject.svg" alt={activeCourse?.title ?? ""} width={45} height={45} className="object-contain mr-2">
                    </Image>
                    {activeCourse?.title} */}
                </Button>


            </Link>
            <Link href="/premium">
                <Button variant="ghost" className="text-white">
                    <Image src="/images/white_points.svg" alt={activeCourse?.title ?? ""} width={45} height={45} className="object-contain" />
                    {points}
                </Button>
            </Link>
            <Link href="/premium">
                <Button variant="ghost" className="text-white">
                    {isPremium
                        ?
                        "Premium"
                        :
                        <div>
                            <Image src={
                                `/images/daisy-streak/daisy-${petals}.svg`
                            } alt={activeCourse?.title ?? ""} width={55} height={55} className="object-contain" />
                        </div>
                    }
                    {petals}
                </Button>
            </Link>
        </div>
    )
}


export default StudentProgress