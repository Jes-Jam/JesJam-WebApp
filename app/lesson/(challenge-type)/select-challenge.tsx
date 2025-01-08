import { cn } from "@/lib/utils";

interface SelectChallengeProps {
    challenge: {
        content: {
            question?: string;
            options?: string[];
            correctAnswer?: string;
        };
    };
    selectedOption: number | number[] | null;
    onSelect: (id: number) => void;
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
}

export const SelectChallenge = ({
    challenge,
    selectedOption,
    onSelect,
    status
}: SelectChallengeProps) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {challenge.content.options?.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(index)}
                    disabled={status !== "UNANSWERED"}
                    className={cn(
                        "p-4 rounded-lg border-2 transition",
                        status === "UNANSWERED" && selectedOption === index && "border-sky-300",
                        status === "CORRECT" && selectedOption === index && "bg-green-100 border-green-500",
                        status === "INCORRECT" && selectedOption === index && "bg-red-100 border-red-500",
                        status === "INCORRECT" && selectedOption !== index && "bg-green-100 border-green-500 opacity-50"
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}
