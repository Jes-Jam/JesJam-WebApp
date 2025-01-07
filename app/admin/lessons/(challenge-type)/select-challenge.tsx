import { useState } from "react"
import { Plus, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SelectChallengeProps {
    index: number;
    challenge: {
        question: string;
        options: string[];
        correctAnswer: string;
    };
    onDelete?: () => void;
    onChange: (field: string, value: any) => void;
    canDelete: boolean;
}

export const SelectChallenge = ({
    index,
    challenge,
    onDelete,
    onChange,
    canDelete
}: SelectChallengeProps) => {
    const handleOptionChange = (optionIndex: number, value: string) => {
        const newOptions = [...challenge.options]
        newOptions[optionIndex] = value
        onChange('options', newOptions)
    }

    const addOption = () => {
        const newOptions = [...challenge.options, ""]
        onChange('options', newOptions)
    }

    const removeOption = (optionIndex: number) => {
        const newOptions = challenge.options.filter((_, i) => i !== optionIndex)
        onChange('options', newOptions)

        // If we're removing the correct answer, reset it
        if (challenge.options[optionIndex] === challenge.correctAnswer) {
            onChange('correctAnswer', '')
        }
    }

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

                <div className="space-y-4">
                    <RadioGroup
                        value={challenge.correctAnswer}
                        onValueChange={(value) => onChange('correctAnswer', value)}
                    >
                        {challenge.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`option-${index}-${optionIndex}`} />
                                <div className="flex-1">
                                    <Input
                                        placeholder={`Option ${optionIndex + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                {challenge.options.length > 2 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(optionIndex)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </RadioGroup>

                    {challenge.options.length < 6 && (
                        <Button
                            variant="primaryOutline"
                            size="sm"
                            onClick={addOption}
                            className="mt-2"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Option
                        </Button>
                    )}
                </div>

                <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-sky-700">
                        <Check className="h-4 w-4" />
                        Correct answer: {challenge.correctAnswer || "Not selected"}
                    </div>
                </div>
            </div>
        </div>
    )
}