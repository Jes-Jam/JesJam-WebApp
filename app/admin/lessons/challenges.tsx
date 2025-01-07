"use client"

import { useState } from "react"
import { Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ChallengesProps {
    lesson: any
    chapter: any
    onBack: () => void
}

export const Challenges = ({
    lesson,
    chapter,
    onBack
}: ChallengesProps) => {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="space-y-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        onClick={onBack}
                                        className="text-sm text-muted-foreground hover:text-sky-500 cursor-pointer"
                                    >
                                        Chapters
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        onClick={onBack}
                                        className="text-sm text-muted-foreground hover:text-sky-500 cursor-pointer"
                                    >
                                        {chapter?.title}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {lesson?.title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-2xl font-bold">Challenges</h2>
                    </div>
                    <Button onClick={() => { }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Challenge
                    </Button>
                </div>

                <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No challenges found. Create your first challenge!
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
