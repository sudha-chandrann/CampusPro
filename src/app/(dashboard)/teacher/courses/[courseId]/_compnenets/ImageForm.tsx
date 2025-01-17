"use client";
import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/customui/FileUploader";
import Image from "next/image";

interface CourseImageFormProps {
  initialData: {
    imageUrl: string;
  };
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Course Image is required" }),
});

function ImageForm({ initialData, courseId }: CourseImageFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting } = form.formState;
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Image updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating Course Image:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-[380px] md:w-[450px] p-4 px-6 bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Course Image</span>
        <Button variant="ghost" onClick={toggleEdit} disabled={isSubmitting}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Course Image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit Course Image
            </>
          )}
        </Button>
      </div>

      {!isEditing && initialData.imageUrl && (
        
        <div className="flex items-center p-2 shadow-md rounded-md justify-center w-full h-fit">
          <Image
            width="100"
            height="600"
            src={initialData.imageUrl}
            alt="image"
            className="w-[400px] h-[200px] rounded-md object-cover object-center"
          />
        </div>
      )}
      {!isEditing && !initialData.imageUrl && (
        <div className="flex items-center shadow-md rounded-md justify-center w-full h-[100px]">
          <ImageIcon />
        </div>
      )}

      {isEditing && (
        <div>
          <FileUploader
            onChange={(info) => {
              if (typeof info === "object" && "url" in info) {
                onSubmit({ imageUrl: info.url });
              } else {
                console.error("Invalid info type:", info);
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageForm;
