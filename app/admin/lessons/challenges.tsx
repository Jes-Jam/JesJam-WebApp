"use client"

import { useState, useEffect } from "react"
import { Plus, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CardChallenge } from "./(challenge-type)/card-challenge"
import { SelectChallenge } from "./(challenge-type)/select-challenge"
import { AnswerBuildingChallenge } from "./(challenge-type)/answer-building-challenge"
import axios from "axios"
import { toast } from "sonner"

type ChallengeType = "CARD" | "SELECT" | "ANSWER_BUILDING"

interface Challenge {
    type: ChallengeType;
    data: CardData | SelectData | AnswerBuildingData;
}

interface CardData {
    term: string;
    definition: string;
}

interface SelectData {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface AnswerBuildingData {
    question: string;
    correctAnswer: string;
    hints?: string[];
    shuffledParts?: string[];
}

interface ChallengesProps {
    lesson: any;
    chapter: any;
    onBack: () => void;
}

export const Challenges = ({
    lesson,
    chapter,
    onBack
}: ChallengesProps) => {
    const getEmptyChallengeData = (type: ChallengeType) => {
        switch (type) {
            case "CARD":
                return {
                    term: "",
                    definition: ""
                };
            case "SELECT":
                return {
                    question: "",
                    options: ["", ""],
                    correctAnswer: ""
                };
            case "ANSWER_BUILDING":
                return {
                    question: "",
                    correctAnswer: "",
                    hints: [],
                    shuffledParts: []
                };
        }
    };

    const [challenges, setChallenges] = useState<Challenge[]>([
        {
            type: "CARD",
            data: getEmptyChallengeData("CARD") as CardData
        }
    ]);

    const handleAddChallenge = (type: ChallengeType) => {
        setChallenges([
            ...challenges,
            {
                type,
                data: getEmptyChallengeData(type)
            }
        ]);
    };

    const handleDeleteChallenge = async (index: number) => {
        try {
            // Delete from the database
            await axios.delete(
                `/api/classes/${chapter.classId}/chapters/${chapter.id}/lessons/${lesson.id}/challenges?index=${index}`
            );

            // Update local state
            const updatedChallenges = challenges.filter((_, i) => i !== index);
            setChallenges(updatedChallenges);

            toast.success("Challenge deleted successfully");
        } catch (error) {
            console.error("Error deleting challenge:", error);
            toast.error("Failed to delete challenge");
        }
    };

    const handleChallengeChange = (index: number, field: string, value: any) => {
        const updatedChallenges = [...challenges];
        const challenge = updatedChallenges[index];

        switch (challenge.type) {
            case "CARD":
                (challenge.data as CardData)[field as keyof CardData] = value;
                break;
            case "SELECT":
                (challenge.data as SelectData)[field as keyof SelectData] = value;
                break;
            case "ANSWER_BUILDING":
                (challenge.data as AnswerBuildingData)[field as keyof AnswerBuildingData] = value;
                break;
        }

        setChallenges(updatedChallenges);
    };

    // Fetch existing challenges
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(
                    `/api/classes/${chapter.classId}/chapters/${chapter.id}/lessons/${lesson.id}/challenges`
                )
                const existingChallenges = response.data.map((challenge: any) => ({
                    type: challenge.type,
                    data: challenge.content
                }))

                if (existingChallenges.length > 0) {
                    setChallenges(existingChallenges)
                }
            } catch (error) {
                console.error("Error fetching challenges:", error)
                toast.error("Failed to load challenges")
            }
        }

        if (lesson?.id && chapter?.id) {
            fetchChallenges()
        }
    }, [lesson?.id, chapter?.id, chapter?.classId])

    // Save challenges
    const handleSave = async () => {
        try {
            // Validation checks...
            const hasEmptyFields = challenges.some(challenge => {
                switch (challenge.type) {
                    case "CARD":
                        const cardData = challenge.data as CardData;
                        return !cardData.term || !cardData.definition;
                    case "SELECT":
                        const selectData = challenge.data as SelectData;
                        return !selectData.question ||
                            !selectData.correctAnswer ||
                            selectData.options.some(opt => !opt);
                    case "ANSWER_BUILDING":
                        const buildData = challenge.data as AnswerBuildingData;
                        return !buildData.question || !buildData.correctAnswer;
                }
            });

            if (hasEmptyFields) {
                toast.error("Please fill in all required fields")
                return
            }

            await axios.post(
                `/api/classes/${chapter.classId}/chapters/${chapter.id}/lessons/${lesson.id}/challenges`,
                { challenges }
            )

            toast.success("Challenges saved successfully")
            onBack()
        } catch (error) {
            console.error("Error saving challenges:", error)
            toast.error("Failed to save challenges")
        }
    }

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
                        <h2 className="text-2xl font-bold text-sky-500">Create new challenges</h2>

                    </div>
                    <Button variant="sidebar">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="space-y-4 mt-4">
                        <div className="space-y-1 bg-sky-100 p-4 rounded-lg">
                            <label className="text-sm text-gray-500">Title</label>
                            <div className="text-lg font-medium">{lesson?.title}</div>
                        </div>
                        <div className="space-y-4 bg-sky-100 p-4 rounded-lg">
                            <label className="text-sm text-gray-500">Description</label>
                            <div className="text-gray-600">{lesson?.description || "No description provided"}</div>
                        </div>
                    </div>
                    {challenges.map((challenge, index) => {
                        switch (challenge.type) {
                            case "CARD":
                                return (
                                    <CardChallenge
                                        key={index}
                                        index={index}
                                        challenge={challenge.data as CardData}
                                        onChange={(field, value) => handleChallengeChange(index, field, value)}
                                        onDelete={() => handleDeleteChallenge(index)}
                                        canDelete={challenges.length > 1}
                                    />
                                );
                            case "SELECT":
                                return (
                                    <SelectChallenge
                                        key={index}
                                        index={index}
                                        challenge={challenge.data as SelectData}
                                        onChange={(field, value) => handleChallengeChange(index, field, value)}
                                        onDelete={() => handleDeleteChallenge(index)}
                                        canDelete={challenges.length > 1}
                                    />
                                );
                            case "ANSWER_BUILDING":
                                return (
                                    <AnswerBuildingChallenge
                                        key={index}
                                        index={index}
                                        challenge={challenge.data as AnswerBuildingData}
                                        onChange={(field, value) => handleChallengeChange(index, field, value)}
                                        onDelete={() => handleDeleteChallenge(index)}
                                        canDelete={challenges.length > 1}
                                    />
                                );
                        }
                    })}
                </div>

                <div className="mt-4 flex justify-between">
                    <div className="flex items-center gap-4">
                        <Select onValueChange={handleAddChallenge}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Add new challenge" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CARD">Add Flashcard</SelectItem>
                                <SelectItem value="SELECT">Add Multiple Choice</SelectItem>
                                <SelectItem value="ANSWER_BUILDING">Add Answer Building</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="primaryOutline" onClick={onBack}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Challenges
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
