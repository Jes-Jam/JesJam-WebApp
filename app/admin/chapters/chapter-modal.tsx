"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    order: z.number().min(1, "Order must be at least 1"),
})

interface ChapterModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    classId: number
    initialData: {
        id: number;
        title: string;
        description: string | null | undefined;
        order: number;
    } | null | undefined;
}

export const ChapterModal = ({
    isOpen,
    onClose,
    onSuccess,
    classId,
    initialData
}: ChapterModalProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            order: 1,
        }
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                description: initialData.description || "",
                order: initialData.order,
            })
        }
    }, [initialData, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            if (initialData) {
                // Update existing chapter
                await axios.patch(`/api/classes/${classId}/chapters/${initialData.id}`, values)
                toast.success("Chapter updated successfully")
            } else {
                // Create new chapter
                await axios.post(`/api/classes/${classId}/chapters`, values)
                toast.success("Chapter created successfully")
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        form.reset({
            title: "",
            description: "",
            order: 1,
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit chapter" : "Create new chapter"}
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
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Enter chapter title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder="Enter chapter description"
                                            {...field}
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            type="number"
                                            min={1}
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-x-2">
                            <Button
                                type="button"
                                variant="primaryOutline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {initialData ? "Save changes" : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
