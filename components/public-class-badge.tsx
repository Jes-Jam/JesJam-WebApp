import { Badge } from "@/components/ui/badge";
import { Globe2 } from "lucide-react";

export const PublicClassBadge = () => {
    return (
        <Badge
            variant="secondary"
            className="absolute bottom-4 left-4 bg-sky-100 text-sky-700 gap-1 border border-sky-200"
        >
            <Globe2 className="h-3 w-3" />
            Public
        </Badge>
    );
};