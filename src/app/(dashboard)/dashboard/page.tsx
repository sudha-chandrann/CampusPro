// app/page.tsx or pages/index.tsx

import { auth } from "@clerk/nextjs/server";
import { getDashboardCourses } from "../../../../actions/get-dashboard-courses";
import { redirect } from "next/navigation";
import CoursesList from "@/components/customui/CoursesList";
import InfoCard from "../_components/InfoCard";
import { CheckCircle, Clock } from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Await the result of getDashboardCourses
  const { completedCourse, courseInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InfoCard
        icon={Clock}
        label="In Progress "
        numberOfItems={courseInProgress.length}
        />

        <InfoCard
        icon={CheckCircle}
        label="Completed "
        numberOfItems={completedCourse.length}
        variant="success"
        />
      </div>
      <div className=" w-full">
        <CoursesList items={[...courseInProgress,...completedCourse]} />
      </div>

    </div>
  );
}
