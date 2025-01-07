import { Card } from "@/components/flashcard/card";

interface CardChallengeProps {
    challenge: {
        content: {
            term?: string;
            definition?: string;
        };
    };
    onSelect: (id: number) => void;
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
}

export const CardChallenge = ({
    challenge,
    onSelect,
    status
}: CardChallengeProps) => {
    return (
        <div className="w-full">
            <Card
                term={challenge.content.term || ""}
                definition={challenge.content.definition || ""}
                status={status}
            />
        </div>
    )
}
