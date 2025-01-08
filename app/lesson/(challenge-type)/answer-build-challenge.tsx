import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface AnswerBuildingChallengeProps {
    challenge: {
        content: {
            question?: string;
            correctAnswer?: string;
            shuffledParts?: string[];
        };
    };
    onSelect: (indices: number[]) => void;
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
}

export const AnswerBuildingChallenge = ({
    challenge,
    onSelect,
    status
}: AnswerBuildingChallengeProps) => {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const parts = challenge.content.shuffledParts || [];

    const handlePartClick = (index: number) => {
        if (status !== "UNANSWERED") return;

        setSelectedIndices(prev => {
            const newIndices = [...prev, index];
            onSelect(newIndices);
            return newIndices;
        });
    };

    return (
        <div className="space-y-6">
            <div className="min-h-[100px] p-4 border-2 rounded-lg text-sky-700">
                {selectedIndices.map(index => parts[index]).join(' ')}
            </div>
            <div className="flex flex-wrap gap-2">
                {parts.map((part, index) => (
                    <Button
                        key={index}
                        variant="premiumOutline"
                        onClick={() => handlePartClick(index)}
                        disabled={status !== "UNANSWERED" || selectedIndices.includes(index)}
                        className={`px-4 py-2 rounded-lg transition
                            ${selectedIndices.includes(index)
                                ? 'bg-gray-100 text-muted-foreground'
                                : 'bg-sky-100 hover:bg-sky-200'
                            }`}
                    >
                        {part}
                    </Button>
                ))}
            </div>
        </div>
    )
}
