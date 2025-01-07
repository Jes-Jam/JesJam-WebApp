import React, { useState } from 'react';

interface AnswerBuildingChallengeProps {
    challenge: {
        content: {
            question?: string;
            correctAnswer?: string;
            shuffledParts?: string[];
        };
    };
    onSelect: (answer: string) => void;
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
}

export const AnswerBuildingChallenge = ({
    challenge,
    onSelect,
    status
}: AnswerBuildingChallengeProps) => {
    const [selectedParts, setSelectedParts] = useState<string[]>([]);

    const handlePartClick = (part: string) => {
        if (status !== "UNANSWERED") return;

        setSelectedParts(prev => {
            const newParts = [...prev, part];
            const answer = newParts.join(' ');
            onSelect(answer);
            return newParts;
        });
    };

    const parts = challenge.content.shuffledParts || [];

    return (
        <div className="space-y-6">
            <div className="min-h-[100px] p-4 border-2 rounded-lg">
                {selectedParts.join(' ')}
            </div>
            <div className="flex flex-wrap gap-2">
                {parts.map((part, index) => (
                    <button
                        key={index}
                        onClick={() => handlePartClick(part)}
                        disabled={status !== "UNANSWERED"}
                        className="px-4 py-2 bg-sky-100 rounded-lg hover:bg-sky-200 transition"
                    >
                        {part}
                    </button>
                ))}
            </div>
        </div>
    )
}
