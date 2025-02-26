"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    imageSrc: z.string().url("Must be a valid URL").optional(),
    isPrivateClass: z.boolean().default(true),
})

interface ClassModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    initialData?: {
        id: number;
        title: string;
        imageSrc?: string;
        isPrivateClass: boolean;
    }
}

export const ClassModal = ({
    isOpen,
    onClose,
    onSuccess,
    initialData
}: ClassModalProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            imageSrc: initialData?.imageSrc || "",
            isPrivateClass: initialData?.isPrivateClass ?? true,
        }
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                imageSrc: initialData.imageSrc,
                isPrivateClass: initialData.isPrivateClass,
            })
        }
    }, [initialData, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            if (initialData) {
                // Update existing class
                await axios.patch(`/api/classes/${initialData.id}`, values)
                toast.success("Class updated successfully")
            } else {
                // Create new class
                await axios.post("/api/classes", values)
                toast.success("Class created successfully")
            }
            form.reset()
            onSuccess()
            onClose()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit class" : "Create a new class"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Enter class title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageSrc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Enter image URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="isPrivateClass"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3 rounded-lg border p-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">Private class</FormLabel>
                                </FormItem>
                            )}
                        /> */}
                        <div className="flex justify-end">
                            <Button disabled={isLoading} type="submit">
                                {initialData ? "Save changes" : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
