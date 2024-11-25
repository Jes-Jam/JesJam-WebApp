
import { getUserProgress } from "@/database/queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";


import { Flame } from "lucide-react";

export const UserInfoCard = async () => {
    const userProgress = await getUserProgress();

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center justify-center gap-x-4">
                <div className="w-28 h-28 my-4 relative border-4 border-sky-400 rounded-full">
                    <Image
                        src="/images/cat_profile.jpeg"
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-xl text-center font-semibold text-sky-500">{userProgress?.userName}</h2>
                    <div className="flex items-center gap-x-4 mt-2">
                        <div className="flex items-center gap-x-2">
                            <Button variant="ghost" className="text-white">
                                <Image src="/images/points.svg" alt="Points" width={45} height={45} className="object-contain" />
                                {<p className="text-gray-500">{userProgress?.points || 0} Points</p>}
                            </Button>
                        </div>

                        <div className="flex items-center gap-x-2">
                            <Button variant="ghost" className="text-white">
                                {/* <Flame className="w-6 h-6 text-sky-500" /> */}
                                <Image src="/images/streak.svg" alt="Points" width={45} height={45} className="object-contain" />
                                {<p className="text-gray-500">{userProgress?.points || 0} Streaks</p>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}