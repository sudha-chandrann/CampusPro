
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation';
import React from 'react'
import CourseSideBarItem from './CourseSideBarItem';
import CourseProgress from '@/components/customui/CourseProgress';

interface CourseSideBarprops {
    course:Course & {
        chapters:(Chapter & {
            userProgress:UserProgress[] | null;
        })[]
    },
    progresscount:number
}

async function CourseSideBar({course,progresscount}:CourseSideBarprops) {
   const {userId}= await auth();
   if(!userId){
    return redirect("/");
   }
   const purchase = await db.purchase.findUnique({
    where: {
        userId_courseId:{
            userId:userId,
            courseId:course.id
        }
    }
   })


  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-md '>
        <div className='p-8 flex flex-col border-b'>
            <h1 className='font-semibold text-sky-800'>
                {course.title}
            </h1>
            {
                purchase && (
                    <div className='mt-4'>
                         <CourseProgress
                          variant={progresscount === 100 ? "success": "default"}
                          value={progresscount}
                          size={progresscount === 100 ? "success": "default"}
                         />
                    </div>
                )
            }
        </div>
        <div className='flex flex-col w-full'>
          {
            course.chapters.map((chapter) =>
            (
                <CourseSideBarItem 
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked ={!chapter.isFree && !purchase}

                />
            )
            )
          }
        </div>
    </div>
  )
}

export default CourseSideBar
