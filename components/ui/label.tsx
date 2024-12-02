import { cn } from "@/lib/utils";

export const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <label
      className={cn(
        "md:text-md lg:text-lg font-medium leading-none px-5 py-5 rounded-md inline-block text-center",
        className
      )}
    >
      {children}
    </label>
  );
};