import { useState } from "react"
import { Plus, Minus, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface AnswerBuildingChallengeProps {
    index: number;
    challenge: {
        question: string;
        correctAnswer: string;
        hints?: string[];
        shuffledParts?: string[]; // Store the shuffled sentence parts
    };
    onDelete?: () => void;
    onChange: (field: string, value: any) => void;
    canDelete: boolean;
}

export const AnswerBuildingChallenge = ({
    index,
    challenge,
    onDelete,
    onChange,
    canDelete
}: AnswerBuildingChallengeProps) => {
    // Split sentence into parts and shuffle them
    const generateShuffledParts = () => {
        if (!challenge.correctAnswer) return;

        // Split the sentence into words
        let parts = challenge.correctAnswer.split(' ');

        // Combine short words (less than 3 characters) with adjacent words
        const combinedParts: string[] = [];
        let currentPart = '';

        parts.forEach((word, i) => {
            if (word.length < 3 && i < parts.length - 1) {
                currentPart = currentPart ? `${currentPart} ${word}` : word;
            } else if (currentPart) {
                combinedParts.push(`${currentPart} ${word}`);
                currentPart = '';
            } else {
                combinedParts.push(word);
            }
        });

        // Shuffle the parts
        const shuffled = [...combinedParts].sort(() => Math.random() - 0.5);
        onChange('shuffledParts', shuffled);
    };

    return (
        <div className="p-6 bg-white rounded-lg border space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                    {index + 1}
                </span>
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-600"
                    >
                        Delete
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Input
                        placeholder="Enter your question"
                        value={challenge.question}
                        onChange={(e) => onChange('question', e.target.value)}
                        className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">QUESTION</span>
                </div>

                <div className="space-y-2">
                    <Textarea
                        placeholder="Enter the correct sentence"
                        value={challenge.correctAnswer}
                        onChange={(e) => {
                            onChange('correctAnswer', e.target.value);
                            // Clear shuffled parts when answer changes
                            onChange('shuffledParts', []);
                        }}
                        className="w-full min-h-[100px]"
                    />
                    <span className="text-xs text-muted-foreground">CORRECT ANSWER</span>
                </div>

                <div className="space-y-4">
                    <Button
                        variant="primary"
                        onClick={generateShuffledParts}
                        disabled={!challenge.correctAnswer}
                    >
                        <Shuffle className="h-4 w-4 mr-2" />
                        Generate Word Blocks
                    </Button>

                    {challenge.shuffledParts && challenge.shuffledParts.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Preview of shuffled words:</label>
                            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg">
                                {challenge.shuffledParts.map((part, i) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="px-3 py-1.5 text-sm"
                                    >
                                        {part}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Optional hints section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Hints<span className="text-xs text-muted-foreground"> *Optional</span></label>
                    {challenge.hints?.map((hint, hintIndex) => (
                        <div key={hintIndex} className="flex items-center gap-2">
                            <Input
                                placeholder={`Hint ${hintIndex + 1}`}
                                value={hint}
                                onChange={(e) => {
                                    const newHints = [...(challenge.hints || [])];
                                    newHints[hintIndex] = e.target.value;
                                    onChange('hints', newHints);
                                }}
                                className="flex-1"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const newHints = challenge.hints?.filter((_, i) => i !== hintIndex);
                                    onChange('hints', newHints);
                                }}
                                className="text-red-500"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="primaryOutline"
                        className="ml-2"
                        size="sm"
                        onClick={() => {
                            const newHints = [...(challenge.hints || []), ''];
                            onChange('hints', newHints);
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Hint
                    </Button>
                </div>
            </div>
        </div>
    );
};