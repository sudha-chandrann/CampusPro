import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { getChapter } from "../../../../../../../actions/get-chapter";
import Banner from "@/components/customui/Banner";
import VideoPlayer from "../../components/VideoPlayer";
import CourseEnrollButton from "../../components/CourseEnrollButton";
import Preview from "@/components/customui/Preview";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";

async function page({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
 const {courseId, chapterId}=await params;
  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: userId,
    courseId: courseId,
    chapterId: chapterId,
  });

  if (!chapter || !course) {
    return redirect("/dashboard");
  }

  const isLocked = !chapter.isFree && !purchase;
  const onCompeleOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner variant="warning" label="You need  to purchase this course to watch this chapter." />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-10">
        <div className="px-4 pt-4">
        <VideoPlayer
          chapterId={chapterId}
          courseId={courseId}
          title={chapter.title}
          nextChapterId={nextChapter?.id||""}
          playbackId={muxData?.playbackId||""}
          isLocked={isLocked}
          completeOnEnd={onCompeleOnEnd}
         />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-5">
          <h1 className="text-2xl font-semibold mb-2">
            {chapter.title}
          </h1>
          {
            purchase?(
              <div>
                <Button  variant="teacher" >
                  Enorolled
                </Button>
              </div>
            ):(
              <CourseEnrollButton
              courseId={courseId}
              price={course.price!}
              />
            )
          }
        </div>
        <Separator className="mt-3"/>
        <div className="w-full my-3">
          <Preview content={chapter.description!}/>
        </div>
        {
           !!attachments.length && (
            <>
            <Separator/>
            <div className="p-4 flex flex-col gap-2">
              {
                attachments.map((attachment)=>(
                  <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  > 
                    <File/>
                    <p className="line-clamp-1 pl-2">
                      {attachment.name}
                    </p>

                  </a>
                ))
              }
            </div>
            </>
          )
        }
      </div>
    </div>
  );
}

export default page;
