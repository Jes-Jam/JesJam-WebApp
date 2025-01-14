import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AddClassFormData {
    title: string;
    imageSrc: string;
}

const AddClassModal = ({ isOpen, onClose }: AddClassModalProps) => {
    const { register, handleSubmit } = useForm<AddClassFormData>();


    const onSubmit = async (data: AddClassFormData) => {
        try {
            const response = await axios.post('/api/user-classes', {
                ...data,
                isPrivateClass: true,
            });
            console.log(response.data);
            toast.success("Class created successfully");
            onClose();
        } catch (error) {
            console.error("Error creating class:", error);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-sky-500">Create a New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input {...register("title")} placeholder="Class Title" required />
                    <Input {...register("imageSrc")} placeholder="Image URL" />
                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddClassModal;
