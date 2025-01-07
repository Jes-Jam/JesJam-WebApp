"use client"

import { useState } from "react"
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

type ChallengeType = "CARD" | "SELECT" | "ANSWER_BUILDING"

interface Challenge {
    type: ChallengeType;
    data: any;
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
    const [challenges, setChallenges] = useState<Challenge[]>([
        { type: "CARD", data: { term: "", definition: "" } }
    ]);

    const getEmptyChallengeData = (type: ChallengeType) => {
        switch (type) {
            case "CARD":
                return { term: "", definition: "" };
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

    const handleAddChallenge = (type: ChallengeType) => {
        setChallenges([...challenges, {
            type,
            data: getEmptyChallengeData(type)
        }]);
    };

    const handleDeleteChallenge = (index: number) => {
        const updatedChallenges = challenges.filter((_, i) => i !== index);
        setChallenges(updatedChallenges);
    };

    const handleChallengeChange = (index: number, field: string, value: any) => {
        const updatedChallenges = [...challenges];
        updatedChallenges[index].data[field] = value;
        setChallenges(updatedChallenges);
    };

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
                                        challenge={challenge.data}
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
                                        challenge={challenge.data}
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
                                        challenge={challenge.data}
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
                        <Button variant="primary">
                            Save challenges
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
