import { IconBadge } from "@/components/customui/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TittleForm from "./_compnenets/TittleForm";
import DescriptionForm from "./_compnenets/DescriptionForm";
import ImageForm from "./_compnenets/ImageForm";
import CategoryForm from "./_compnenets/CategoryForm";
import PriceForm from "./_compnenets/PriceForm";
import AttachmentForm from "./_compnenets/AttachmentForm";
import ChapterForm from "./_compnenets/ChapterForm";
import Banner from "@/components/customui/Banner";
import CourseActions from "./_compnenets/CourseAction";
import toast from "react-hot-toast";

async function Page({ params }: { params: { courseId: string } }) {
  const { userId } = await auth();
  const { courseId } = await params;
  if (!userId) {
    console.error("User not authenticated");
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: courseId, userId },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createAt: "desc",
        },
      },
    },
  });

  if (!course) {
    toast.error("Course not found");
    return redirect("/teacher/courses");
  } 

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categroyId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;
  const iscomplete=requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished.It is not be visible to the students"
        />
      )}
      <div className="h-full p-6 w-full md:px-12">
        <div className="flex items-center flex-wrap justify-between w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-600">
              Complete all fields {completionText}
            </span>
          </div>
          <div>
            <CourseActions isPublished={course.isPublished} courseId={courseId} disabled={!iscomplete}/>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="space-y-4 w-full justify-items-center">
            <div className="flex items-center gap-x-2 w-full min-w-[320px] lg:w-4/5">
              <IconBadge size="sm" icon={LayoutDashboard} />
              <h1 className="text-lg text-slate-600">Customize your course</h1>
            </div>
            <TittleForm
              initialData={{ title: course.title }}
              courseId={courseId}
            />
            <DescriptionForm
              initialData={{ description: course.description || "" }}
              courseId={courseId}
            />
            <ImageForm
              initialData={{ imageUrl: course.imageUrl || "" }}
              courseId={courseId}
            />
            <CategoryForm
              initialData={course}
              courseId={courseId}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className=" space-y-4 w-full justify-items-center">
            <div className="flex items-center gap-x-2 w-full lg:w-4/5 min-w-[320px]">
              <IconBadge size="sm" icon={ListChecks} />
              <h1 className="text-lg text-slate-600"> Course Chapters</h1>
            </div>
            <ChapterForm initialData={course} courseId={courseId} />
            <div className="flex items-center gap-x-2 w-full lg:w-4/5 min-w-[320px]">
              <IconBadge size="sm" icon={CircleDollarSign} />
              <h1 className="text-sm text-slate-600">Sell Your Course</h1>
            </div>
            <PriceForm
              initialData={{ price: course.price }}
              courseId={courseId}
            />
            <div className="flex items-center gap-x-2 w-full lg:w-4/5 min-w-[320px]">
              <IconBadge size="sm" icon={File} />
              <h1 className="text-sm text-slate-600">
                Resource and Attachments
              </h1>
            </div>
            <AttachmentForm initialData={course} courseId={courseId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
