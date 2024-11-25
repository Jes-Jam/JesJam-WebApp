import { getEnrollments } from "@/database/queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const EnrolledCourses = async () => {
    const enrollments = await getEnrollments();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl text-center font-semibold text-sky-500 pb-10">My Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                {enrollments.map((enrollment) => (
                    <div
                        key={`${enrollment.classId}-${enrollment.userId}`}
                        className="bg-gradient-to-r from-sky-100 via-blue-100 to-sky-200/80 border border-b-8 border-slate-200 text-sky-700 rounded-lg overflow-hidden"
                    >
                        <div className="aspect-video relative flex justify-center items-center">
                            <Image
                                src={enrollment.class.imageSrc || "/placeholder.jpg"}
                                alt={enrollment.class.title || "Course Image"}
                                className="object-cover"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <h3 className="font-semibold text-lg text-sky-500">{enrollment.class.title}</h3>
                            <div className="flex items-center">
                                <span className={`text-sm px-2 py-1 rounded-full ${enrollment.status === "active" ? "bg-green-100 text-green-700" :
                                    enrollment.status === "completed" ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-700"
                                    }`}>
                                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </span>
                            </div>
                            <Link href={`/class/${enrollment.class.id}`}>
                                <Button className="w-full">
                                    Continue learning
                                </Button>
                            </Link>
                        </div>

                    </div>
                ))}

                {enrollments.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        You haven't enrolled in any courses yet.
                    </div>
                )}
            </div>
        </div>
    )
}
