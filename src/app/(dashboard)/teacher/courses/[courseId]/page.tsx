import { IconBadge } from "@/components/customui/IconBadge";
import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs/server'
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TittleForm from "./_compnenets/TittleForm";
import DescriptionForm from "./_compnenets/DescriptionForm";
async function Page({ params }: { params: { courseId: string } }) {

    const { userId } = await auth()

    if (!userId) return redirect('/')
    
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  if (!course) return redirect('/teacher/courses');

  const requiredfields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categroyId
  ]

  const totalFields = requiredfields.length;
  const compltedFields= requiredfields.filter(Boolean).length;
  const completionText = `(${compltedFields} / ${totalFields})`


  return (
    <div className="h-full p-6 w-full md:px-12">
        <div className="flex flex-wrap items-center justify-between  gap-3 ">
            <div className="flex flex-col ">
                <h1 className="text-2xl font-medium">Course setup</h1>
                <span className="text-sm text-slate-600">
                    Complete all fields {completionText}
                </span>
            </div>
            <div className="flex items-center gap-x-2">
                <IconBadge size="sm" icon={LayoutDashboard}/>
                <h1 className="text-lg text-slate-600">Customize your course</h1>
            </div>         
        </div>
        <div className="flex flex-wrap items-center justify-between  gap-3 mt-4 md:mt-10 ">
          <div className="h-full flex flex-col gap-y-4">
          <TittleForm initialData={{title:course.title}} courseId={params.courseId}/>
          <DescriptionForm initialData={{ description: course.description?course.description:"" }} courseId={params.courseId} />        
          </div>
        </div>
    </div>
  );
}

export default Page;
