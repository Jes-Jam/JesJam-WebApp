import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
type Props = {
    activeCourse: { imageSrc: string, title: string };
    petals: number;
    points: number;
    isPremium: boolean;
}

const StudentProgress = ({ activeCourse, petals, points, isPremium }: Props) => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href="classes">
                <Button variant="ghost">
                    <Image src="/images/planet.svg" alt={activeCourse?.title} width={40} height={40} className="object-contain">
                    </Image>
                    {activeCourse?.title}
                </Button>
            </Link>
            <Link href="/premium">
                <Button variant="ghost">
                    <Image src="/images/points.svg" alt={activeCourse?.title} width={40} height={40} className="object-contain" />
                    {points}
                </Button>
            </Link>
            <Link href="/premium">
                <Button variant="ghost">
                    {isPremium
                        ?
                        "Premium"
                        :
                        <div>
                            <Image src="/images/mascot.svg" alt={activeCourse?.title} width={55} height={55} className="object-contain" />
                        </div>
                    }
                    {petals}
                </Button>
            </Link>
        </div>
    )
}


export default StudentProgress