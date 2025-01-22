"use client";
import ConfirmModel from "@/components/modals/ConfirmModel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface ChapterActionProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}




function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionProps) {
   const router= useRouter();
    const handleDelete = async () => {
        try {
          await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
          toast.success("chapter is  deleted successfully!");
          router.back();
        } catch (error) {
          console.error("Error deleting chapter:", error);
          toast.error("Something went wrong. Please try again.");
        }
      };


      const handleTooglepublish = async () => {
        try {
          if(isPublished){
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
            toast.success("chapter is  unpublished successfully!");

          }
          else{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
            toast.success("chapter is  published successfully!");
          }
          router.refresh();
        } catch (error) {
          console.error("Error updating publishing:", error);
          toast.error("Something went wrong. Please try again.");
        }
      };
      


  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="teacher"
        size="sm"
        onClick={async () => {
            handleTooglepublish();
         }}
        disabled={disabled}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModel
         onConfirm={async () => {
             handleDelete();
          }}
      >
      <Button size="sm">
        <Trash className="w-4 h-4"/>
      </Button>
      </ConfirmModel>

    </div>
  );
}

export default ChapterActions;
