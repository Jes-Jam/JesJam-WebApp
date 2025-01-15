"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddClassModal from "./class-dialog/class-dialog";
import { useState } from "react";
const AddClassButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button variant="primaryOutline" className="mt-4" onClick={() => setIsModalOpen(true)}>
        <PlusIcon className="w-4 h-4 mr-2" />
        Create your own class
      </Button>
      <AddClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddClassButton;
