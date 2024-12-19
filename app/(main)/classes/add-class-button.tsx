import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AddClassButtonProps {
  [key: string]: any; // Allows any additional props
}

const AddClassButton = ({ ...props }: AddClassButtonProps) => {
  return (
    <Link href="/classes/create" {...props}>
      <Button variant="primary" className="mt-4">
        Create a private class
      </Button>
    </Link>
  );
};

export default AddClassButton;
