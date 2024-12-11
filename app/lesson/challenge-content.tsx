import { cn } from "@/lib/utils";
import { challenges, challengeContent } from "@/database/schema";
import { Choice } from "./choice";
type Props = {
    contents: typeof challengeContent.$inferSelect[];
    status: "CORRECT" | "INCORRECT" | "UNANSWERED";
    selectedOption: number | null;
    disabled: boolean;
    type: typeof challenges.$inferSelect["type"];
    onSelect: (id: number) => void;
}

export const ChallengeContent = ({ contents, status, selectedOption, disabled, type, onSelect }: Props) => {
    return (
        <div className={cn(
            "grid gap-2",
            type === "CARD" && "grid-cols-1",
            type === "SELECT" && "grid-cols-2 lg:grid-cols-3"
        )}>
            {contents.map((content, i) => (
                <Choice
                    key={content.id}
                    id={content.id}
                    text={content.text}
                    imageSrc={content.imageSrc}
                    audioSrc={content.audioSrc}
                    shortcut={`${i + 1}`}
                    selected={content.id === selectedOption}
                    status={status}
                    disabled={disabled}
                    type={type}
                    onClick={() => onSelect(content.id)}
                />
            ))}
        </div>
    )
}