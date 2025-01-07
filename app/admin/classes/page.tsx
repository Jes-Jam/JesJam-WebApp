"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassModal } from "./class-modal";
import { toast } from "sonner";

type Class = {
    id: number;
    title: string;
    imageSrc: string;
    isPrivateClass: boolean;
}

const ClassesPage = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get("/api/classes");
            setClasses(response.data);
        } catch (error) {
            toast.error("Failed to fetch classes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (classId: number) => {
        try {
            await axios.delete(`/api/classes/${classId}`);
            toast.success("Class deleted successfully");
            fetchClasses();
        } catch (error) {
            toast.error("Failed to delete class");
        }
    };

    const handleEdit = (class_: Class) => {
        setEditingClass(class_);
        setShowModal(true);
    };

    return (
        <div className="p-6">
            <ClassModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingClass(null);
                }}
                onSuccess={fetchClasses}
                initialData={editingClass || undefined}
            />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-sky-500">Classes</h2>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="h-4 w-4 mr-2 text-sky-500" />
                    <p className="text-sky-500">Add New Class</p>
                </Button>
            </div>

            <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Private</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map((class_) => (
                            <tr key={class_.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{class_.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={class_.imageSrc} alt={class_.title} className="h-10 w-10 object-cover rounded" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{class_.isPrivateClass ? "Yes" : "No"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(class_)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(class_.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassesPage;