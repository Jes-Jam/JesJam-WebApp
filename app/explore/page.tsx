import StickyContainer from "@/components/main/sticky-container";
import StudyContainer from "@/components/main/study-container";
import StudentStates from "@/components/main/student-state";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import {
    getUserProgress,
    getTopStudents
} from "@/database/queries";
import { redirect } from "next/navigation";

const ExplorePage = async () => {
    const userProgress = await getUserProgress();

    if (!userProgress || !userProgress.activeClass) {
        redirect("/classes")
    }

    return (
        <div className="flex flex-row gap-[50px]">
            <StudyContainer>
                <div className="flex flex-col w-full items-center justify-center">
                    <div className="relative">
                        <Image
                            src="/images/mascot.svg"
                            alt="Explore"
                            width={100}
                            height={100}
                            className="animate-bounce-daisy"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-sky-800 my-6">Explore</h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        See what our amazing community are sharing.
                    </p>

                    <div className="w-full max-w-3xl px-6 space-y-8">
                        <Separator className="h-0.5" />

                        {/* Featured Content */}
                        <section>
                            <h2 className="text-lg font-bold text-sky-800 mb-4">Featured Content</h2>
                            <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg p-6 text-white">
                                <div className="flex items-center gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">
                                            Weekly Challenge
                                        </h3>
                                        <p className="text-sky-100 mb-4">
                                            Learn and remember the biology keywords.
                                        </p>
                                        <Button variant="sidebar" className="bg-white text-sky-600 hover:bg-sky-50">
                                            Join Now
                                        </Button>
                                    </div>
                                    <div className="hidden md:block">
                                        <Image
                                            src="/images/mascot.svg"
                                            alt="Challenge"
                                            width={100}
                                            height={100}
                                            className="animate-bounce-daisy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>


                        {/* Active Learners */}
                        <section>
                            <h2 className="text-lg font-bold text-sky-800 mb-4">Active Learners</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((learner) => (
                                    <div key={learner} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-sky-100">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src="/placeholder-avatar.jpg" />
                                            <AvatarFallback>US</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sky-900">User Name</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Completed 5 lessons today
                                            </p>
                                        </div>
                                        <Button variant="primary" size="sm">
                                            Follow
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>


                        {/* Trending Topics */}
                        <section>
                            <h2 className="text-lg font-bold text-sky-800 mb-4">Trending Topics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((topic) => (
                                    <Link href="#" key={topic}>
                                        <div className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-sky-100">
                                            <div className="aspect-video relative mb-3 bg-sky-50 rounded-md overflow-hidden">
                                                <Image
                                                    src="/images/mascot.svg"
                                                    alt="Topic"
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-sky-900 group-hover:text-sky-700">
                                                Cambodian history grade 12
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Learn all you need to know about Cambodian history.
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </StudyContainer>

            <StickyContainer>
                <StudentStates
                    activeCourse={userProgress.activeClass}
                    petals={userProgress.patels}
                    points={userProgress.points}
                    isPremium={false}
                />
            </StickyContainer>
        </div>
    )
}

export default ExplorePage;