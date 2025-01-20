"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  initialData: Chapter
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
});

function ChapterDescriptionForm({ initialData, courseId,chapterId}: DescriptionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description||"",
    },
  });

  const { isSubmitting ,isValid} = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const router=useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Description updated successfully!");
      setIsEditing(false); 
      router.refresh();
    } catch (error) {
      console.error("Error updating Description:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-full lg:w-3/5 min-w-[340px] p-4  bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter Description</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
          {isEditing ? "Cancel" : <><Pencil className="h-4 w-4 mr-2" /> Edit Description</>}
        </Button>
      </div>

      {!isEditing && initialData.description && <p className="text-sm mt-2 text-slate-700">{initialData.description}</p>}
      {!isEditing && !initialData.description && <p className="text-sm mt-2 text-slate-700 italic">No description</p>}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Textarea
                      disabled={isSubmitting}
                      placeholder={initialData.description?initialData.description:"course description"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={isSubmitting || !isValid} variant="teacher" size="sm">
              {isSubmitting ? "Saving..." : "Save Description"}
            </Button>
            </div>

          </form>
        </Form>
      )}
    </div>
  );
}

export default ChapterDescriptionForm;
