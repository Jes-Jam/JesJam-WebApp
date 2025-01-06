"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    id: number,
    title: string,
    imageSrc: string,
    isPreviewAvailable: boolean,
    previewChaptersCount: number,
    isPrivateClass: boolean,
}

const ClassesPage = () => {
    const [classes, setClasses] = useState<Props[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get("/api/classes");
            if (!response.data) {
                throw new Error("Failed to fetch classes");
            }
            setClasses(response.data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-sky-500">Classes</h2>
                <Button onClick={() => {/* Add new class modal */ }}>
                    <Plus className="h-4 w-4 mr-2 text-sky-500" />
                    <p className="text-sky-500">Add New Class</p>
                </Button>
            </div>

            <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Private</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map((class_) => (
                            <tr key={class_.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{class_.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{class_.isPreviewAvailable ? "Yes" : "No"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{class_.isPrivateClass ? "Yes" : "No"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Button variant="ghost" size="sm" onClick={() => {/* Edit class */ }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => {/* Delete class */ }}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {!isLoading && classes.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">No classes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassesPage;