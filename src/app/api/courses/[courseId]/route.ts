import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  console.log("Mux credentials are missing")
  throw new Error("Mux credentials are missing");
}

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!params.courseId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
      include:{
        chapters:{
          include:{
            muxData:true,
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: "not found" }, { status: 403 });
    }

    for(const chapter of course.chapters){
       if(chapter.muxData?.assertId){
        await mux.video.assets.delete(chapter.muxData.assertId);
       }
    }
    
    await db.course.delete({
      where: { id: course.id},
    });


    return NextResponse.json({ message: "course is deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[course_ID_delete_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const values = await req.json();
    
    const updatedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



