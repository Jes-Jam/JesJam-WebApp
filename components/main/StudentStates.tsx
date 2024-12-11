import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { classes } from "@/database/schema"

type Props = {
    activeCourse: typeof classes.$inferSelect;
    petals: number;
    points: number;
    isPremium: boolean;
}

const StudentProgress = ({ activeCourse, petals, points, isPremium }: Props) => {
    return (
        <div className="flex items-center justify-between pb-4 gap-x-2 w-full border-b-2 border-sky-100/50 shadow-white">
            <Link href="classes">
                <Button variant="ghost" className="text-white">
                    <Image src="/images/subject.svg" alt={activeCourse?.title ?? ""} width={45} height={45} className="object-contain mr-2">
                    </Image>
                    {activeCourse?.title}
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
                            <Image src="/images/daisy-patels.svg" alt={activeCourse?.title ?? ""} width={55} height={55} className="object-contain" />
                        </div>
                    }
                    {petals}
                </Button>
            </Link>
        </div>
    )
}


export default StudentProgress