import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
    // Ensure challenge has default values if undefined
    const safeChallenge = {
        question: challenge?.question || "",
        options: challenge?.options || ["", ""],
        correctAnswer: challenge?.correctAnswer || ""
    };

    const handleOptionChange = (optionIndex: number, value: string) => {
        const newOptions = [...safeChallenge.options];
        newOptions[optionIndex] = value;
        onChange('options', newOptions);
    };

    const addOption = () => {
        const newOptions = [...safeChallenge.options, ""];
        onChange('options', newOptions);
    };

    const removeOption = (optionIndex: number) => {
        const newOptions = safeChallenge.options.filter((_, i) => i !== optionIndex);
        onChange('options', newOptions);

        // If we're removing the correct answer, reset it
        if (safeChallenge.options[optionIndex] === safeChallenge.correctAnswer) {
            onChange('correctAnswer', '');
        }
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
                        value={safeChallenge.question}
                        onChange={(e) => onChange('question', e.target.value)}
                        className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">QUESTION</span>
                </div>

                <div className="space-y-4">
                    <RadioGroup
                        value={safeChallenge.correctAnswer}
                        onValueChange={(value) => onChange('correctAnswer', value)}
                    >
                        {safeChallenge.options.map((option, optionIndex) => (
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
                                {safeChallenge.options.length > 2 && (
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

                    {safeChallenge.options.length < 6 && (
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
                        Selected answer: {safeChallenge.correctAnswer || "Not selected"}
                    </div>
                </div>
            </div>
        </div>
    );
};