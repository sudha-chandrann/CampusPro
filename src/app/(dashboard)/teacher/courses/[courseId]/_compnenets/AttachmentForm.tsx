"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon, File, Loader2, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { useEdgeStore } from "@/lib/edgestore";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
});

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();
  const [name,setname]=useState<string>("");

  useEffect(()=>{
    console.log("the file  is ",file)
  },[file])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course attachment updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating Course Image:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Course attachment is deleted successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="w-[380px] mb-4 md:w-[450px] p-4 px-6 bg-slate-100 rounded-md">
      <div className="font-medium flex items-center justify-between">
        <span>Course Attachment</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div>
          {initialData.attachments.length === 0 && (
            <p className="text-sm text-slate-500 italic">No Attachments</p>
          )}

          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="w-full flex items-center p-2 mb-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md "
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0" />
              <a
                href={attachment.url}
                target="_blank"
                download={attachment.name} 
                className="text-sm line-clamp-1 mr-2 cursor-pointer hover:underline"
              >
                {attachment.name}
              </a>
              {deletingId === attachment.id && (
                <div>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {deletingId !== attachment.id && (
                <button
                  className="ml-auto hover:opacity-75 transition"
                  onClick={() => {
                    onDelete(attachment.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="w-full  ">
          <div className="w-full  bg-white h-40 flex flex-col items-center justify-center gap-3">
            <CloudUploadIcon className="h-12 w-12 text-sky-800"/>
            <input
            className="flex items-center justify-center"
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0]);
                setname(e.target.files?.[0].name)
              }}
            />
            <Button
              variant="teacher"
              size="teacher"
              onClick={async () => {
                if (file) {
                  const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                      console.log(progress);
                    },
                  });
                  onSubmit({url:res.url,name:name})
                  console.log("the response is ",res);
                }
              }}
            >
              Upload
            </Button>
          </div>

          <div className="text-sm text-muted-foreground mt-3">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentForm;
