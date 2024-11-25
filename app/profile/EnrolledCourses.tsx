"use client";

import { getEnrollments } from "@/database/queries";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const EnrolledCourses = ({
    enrollments,
    userProgress }: {
        enrollments: Awaited<ReturnType<typeof getEnrollments>>;
        userProgress: { activeClassId: number | null } | null;
    }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const isActiveClass = (classId: number) => {
        return userProgress?.activeClassId === classId;
    }

    const slideLeft = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? enrollments.length - 1 : prevIndex - 1
        );
    };

    const slideRight = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === enrollments.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className={cn("mb-20", isExpanded ? "flex flex-col gap-4" : "space-y-4")}>
            <div className="flex justify-between items-center pb-10">
                <h2 className="text-2xl font-semibold text-sky-500">My Classes</h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-gray-600 hover:text-sky-500 transition-colors" >
                    {isExpanded ? (
                        <>
                            <span className="text-sky-500 text-lg">View Less</span>
                            <Minimize2 className="w-5 h-5 text-sky-500" />
                        </>
                    ) : (
                        <>
                            <span className="text-sky-500 text-lg">View All</span>
                            <Maximize2 className="w-5 h-5 font-bold text-sky-500" />
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isExpanded ? (
                    // Expanded Grid View
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-10"
                    >
                        {enrollments.map((enrollment) => (
                            <div
                                key={`grid-${enrollment.classId}`}
                                className={cn(
                                    "bg-gradient-to-r from-sky-100 via-blue-100 to-sky-200/80 border-2 border-b-4 text-sky-700 rounded-xl p-6 relative flex gap-6",
                                    isActiveClass(enrollment.classId) ? "border-sky-500" : "border-slate-200"
                                )}
                            >
                                {/* Card Content - Same as carousel view */}
                                <div className="flex-shrink-0">
                                    <Image
                                        src={enrollment.class.imageSrc || "/placeholder.jpg"}
                                        alt={enrollment.class.title || "Course Image"}
                                        className="object-cover"
                                        width={150}
                                        height={150}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <div className="text-sm text-gray-600/80 mb-2">New in stores</div>
                                    <h3 className="font-bold text-2xl text-sky-800 mb-4">
                                        {enrollment.class.title}
                                    </h3>
                                    <Link href={`/class/${enrollment.classId}`} className="mt-auto">
                                        <motion.div
                                            className="bg-white rounded-full p-4 border-2 border-b-4 border-sky-500 w-12 h-12 flex items-center justify-center"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ArrowRight className="w-8 h-8" />
                                        </motion.div>
                                    </Link>
                                </div>
                                <button className="absolute top-4 right-4">
                                    <X className="w-6 h-6 text-sky-900" />
                                </button>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    // Carousel View
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative max-w-[900px] mx-auto"
                    >
                        {/* Existing Carousel Code */}
                        <div className="absolute inset-y-0 -left-12 flex items-center">
                            <button
                                onClick={slideLeft}
                                className="border-2 border-slate-200 bg-white rounded-full p-4 shadow-md z-10 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="absolute inset-y-0 -right-12 flex items-center">
                            <button
                                onClick={slideRight}
                                className="border-2 border-slate-200 bg-white rounded-full p-4 shadow-md z-10 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn("bg-gradient-to-r from-sky-100 via-blue-100 to-sky-200/80 border-2 border-b-4  text-sky-700 rounded-xl p-6 relative flex gap-6",
                                        isActiveClass(enrollments[currentIndex].classId) ? "border-sky-500" : "border-slate-200"
                                    )}
                                >
                                    {/* Same card content as above */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={enrollments[currentIndex].class.imageSrc || "/placeholder.jpg"}
                                            alt={enrollments[currentIndex].class.title || "Course Image"}
                                            className="object-cover"
                                            width={150}
                                            height={150}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-grow">
                                        <div className="text-sm text-gray-600/80 mb-2">New in stores</div>
                                        <h3 className="font-bold text-2xl text-sky-800 mb-4">
                                            {enrollments[currentIndex].class.title}
                                        </h3>
                                        <Link href={`/class/${enrollments[currentIndex].classId}`} className="mt-auto">
                                            <motion.div
                                                className="bg-white rounded-full p-4 border-2 border-b-4 border-sky-500 w-12 h-12 flex items-center justify-center"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <ArrowRight className="w-8 h-8" />
                                            </motion.div>
                                        </Link>
                                    </div>
                                    <button className="absolute top-4 right-4">
                                        <X className="w-6 h-6 text-sky-900" />
                                    </button>
                                </motion.div>
                            </AnimatePresence>

                            {/* Pagination Dots */}
                            <div className="flex justify-center gap-2 mt-4">
                                {enrollments.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-sky-500' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                )}
            </AnimatePresence>
        </div >
    );
};