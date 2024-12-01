import { cn } from "@/lib/utils";

export const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
    </label>
  );
};