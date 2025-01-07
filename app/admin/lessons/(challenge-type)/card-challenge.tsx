import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
                        size="sm"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-600"
                    >
                        Delete
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