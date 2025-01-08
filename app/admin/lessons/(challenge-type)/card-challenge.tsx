import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface CardChallengeProps {
    index: number;
    challenge: {
        term: string;
        definition: string;
    };
    onDelete?: () => void;
    onChange: (field: 'term' | 'definition', value: string) => void;
    canDelete: boolean;
}

export const CardChallenge = ({
    index,
    challenge,
    onDelete,
    onChange,
    canDelete
}: CardChallengeProps) => {
    return (
        <div className="p-6 bg-white rounded-lg border space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                    {index + 1}
                </span>
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="text-rose-500 hover:text-rose-600"
                    >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Input
                        placeholder="Enter term"
                        value={challenge.term}
                        onChange={(e) => onChange('term', e.target.value)}
                        className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">TERM</span>
                </div>
                <div className="space-y-2">
                    <Input
                        placeholder="Enter the Mathematical symbols"
                        value={challenge.definition}
                        onChange={(e) => onChange('definition', e.target.value)}
                        className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">DEFINITION</span>
                </div>
            </div>
        </div>
    )
}