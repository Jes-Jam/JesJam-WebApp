import { cn } from "@/lib/utils";

/**
 * A simple label component.
 *
 * @param {React.ReactNode} children - The children element(s) to render within the label.
 * @param {string} [className] - The class name to apply to the label element.
 * @returns {JSX.Element}
 */
const Label = ({ children, className }: { children: React.ReactNode, className?: string }): JSX.Element => {
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

export default Label;