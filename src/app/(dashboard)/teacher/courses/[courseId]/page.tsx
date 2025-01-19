import { IconBadge } from "@/components/customui/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TittleForm from "./_compnenets/TittleForm";
import DescriptionForm from "./_compnenets/DescriptionForm";
import ImageForm from "./_compnenets/ImageForm";
import CategoryForm from "./_compnenets/CategoryForm";
import PriceForm from "./_compnenets/PriceForm";
import AttachmentForm from "./_compnenets/AttachmentForm";
import ChapterForm from "./_compnenets/ChapterForm";

async function Page({ params }: { params: { courseId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    console.error("User not authenticated");
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId,userId },
    include: {
      chapters:{
        orderBy:{
          position: 'asc'
        }
      },
      attachments:{
        orderBy: {
          createAt: 'desc',
        },
      }
    }
  });

  if (!course) {
    console.error("Course not found");
    return redirect("/teacher/courses");
  } else {
    console.log(" the course is ", course);
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categroyId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <div className="h-full p-6 w-full md:px-12">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium">Course setup</h1>
        <span className="text-sm text-slate-600">
          Complete all fields {completionText}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center gap-3 mt-4 md:mt-10 h-fit">
        <div className="h-full flex flex-col gap-y-4 ">
          <div className="flex items-center gap-x-2">
            <IconBadge size="sm" icon={LayoutDashboard} />
            <h1 className="text-lg text-slate-600">Customize your course</h1>
          </div>
          <TittleForm
            initialData={{ title: course.title }}
            courseId={params.courseId}
          />
          <DescriptionForm
            initialData={{ description: course.description || "" }}
            courseId={params.courseId}
          />
          <ImageForm
            initialData={{ imageUrl: course.imageUrl || "" }}
            courseId={params.courseId}
          />
          <CategoryForm
            initialData={course}
            courseId={params.courseId}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className=" flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 ">
            <IconBadge size="sm" icon={ListChecks} />
            <h1 className="text-lg text-slate-600"> Course Chapters</h1>
        </div>
        <ChapterForm
            initialData={course}
            courseId={params.courseId}
          />
        <div className="flex items-center gap-x-2 ">
          <IconBadge size="sm" icon={CircleDollarSign} />
            <h1 className="text-sm text-slate-600">Sell Your Course</h1>
        </div>
        <PriceForm
            initialData={{ price: course.price }}
            courseId={params.courseId}
          />
        <div className="flex items-center gap-x-2 ">
          <IconBadge size="sm" icon={File} />
            <h1 className="text-sm text-slate-600">Resource and Attachments</h1>
        </div>
        <AttachmentForm
            initialData={course}
            courseId={params.courseId}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
